import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X } from 'lucide-react';
import { postApiSellCarRequestsPresignedUrl } from '../services/api';
import { client } from '../services/mutator';

interface SellCarFormValues {
  ownerName: string;
  phone: string;
  email: string;
  carBrand: string;
  carModel: string;
  year: string;
  mileage: string;
  expectedPrice: string;
  condition: string;
  color: string;
  message: string;
  images: File[];
}

type SellCarFormField = keyof SellCarFormValues;

type SellCarFormErrors = Partial<Record<SellCarFormField, string>>;

const initialValues: SellCarFormValues = {
  ownerName: '',
  phone: '',
  email: '',
  carBrand: '',
  carModel: '',
  year: '',
  mileage: '',
  expectedPrice: '',
  condition: '',
  color: '',
  message: '',
  images: [],
};

const MAX_IMAGES = 5;

const SellCarForm: React.FC = () => {
  const { t } = useTranslation('cars');
  const [values, setValues] = useState<SellCarFormValues>(initialValues);
  const [errors, setErrors] = useState<SellCarFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Create previews for current images
    const newPreviews = values.images.map((file) => URL.createObjectURL(file));
    // Revoke old previews
    previews.forEach((p) => URL.revokeObjectURL(p));
    setPreviews(newPreviews);
    // Cleanup on unmount
    return () => {
      newPreviews.forEach((p) => URL.revokeObjectURL(p));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.images]);

  const validate = (): boolean => {
    const newErrors: SellCarFormErrors = {};

    if (!values.ownerName.trim()) {
      newErrors.ownerName = `${t('sell.form.owner_name')} is required`;
    }
    if (!values.phone.trim()) {
      newErrors.phone = `${t('sell.form.phone')} is required`;
    }
    if (!values.carBrand.trim()) {
      newErrors.carBrand = `${t('sell.form.car_brand')} is required`;
    }
    if (!values.carModel.trim()) {
      newErrors.carModel = `${t('sell.form.car_model')} is required`;
    }

    if (!values.color.trim()) {
      newErrors.color = `${t('sell.form.color', 'Color')} is required`;
    }

    if (values.year.trim()) {
      const yearNumber = Number(values.year);
      if (Number.isNaN(yearNumber) || yearNumber < 1980 || yearNumber > new Date().getFullYear() + 1) {
        newErrors.year = `${t('sell.form.year')} is invalid`;
      }
    }

    if (values.images.length > MAX_IMAGES) {
      newErrors.images = `You can upload up to ${MAX_IMAGES} images.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof SellCarFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (field in errors) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field as SellCarFormField];
        return updated;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedToAdd = Math.max(0, MAX_IMAGES - values.images.length);
    const toAdd = files.slice(0, allowedToAdd).filter((f) => f.type.startsWith('image/'));

    if (toAdd.length === 0) return;

    setValues((prev) => ({ ...prev, images: [...prev.images, ...toAdd] }));

    // clear the input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';

    // clear image related errors if any
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.images;
      return updated;
    });
  };

  const removeImage = (index: number) => {
    setValues((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(false);
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];

      if (values.images.length > 0) {
        // Request presigned URLs
        const presignedResp = await postApiSellCarRequestsPresignedUrl({ images: values.images.length });
        const urls = presignedResp?.urls ?? [];

        if (urls.length < values.images.length) {
          throw new Error('Failed to get presigned URLs for all images');
        }

        // Upload each file to its uploadUrl
        for (let i = 0; i < values.images.length; i += 1) {
          const file = values.images[i];
          const urlItem = urls[i];
          if (!urlItem?.uploadUrl) {
            throw new Error('Missing upload URL for image');
          }

          const res = await fetch(urlItem.uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type || 'application/octet-stream',
            },
            body: file,
          });

          if (!res.ok) {
            throw new Error(`Failed to upload image ${i + 1}`);
          }

          // Use permanentUrl returned by the presigned generation endpoint
          if (urlItem.permanentUrl) {
            imageUrls.push(urlItem.permanentUrl);
          } else if (urlItem.key) {
            // fallback: construct URL from key if needed
            imageUrls.push(urlItem.key);
          }
        }
      }



      // Build request payload (convert types and map fields to backend expectations)
      const payload = {
        sellerName: values.ownerName,
        sellerPhone: values.phone,
        email: values.email,
        make: values.carBrand,
        model: values.carModel,
        makeYear: Number(values.year || 0),
        mileage: Number(values.mileage || 0),
        expectedPrice: Number(values.expectedPrice || 0),
        condition: (() => {
          switch (values.condition) {
            case 'like_new':
              return 'LIKENEW';
            case 'good':
              return 'GOOD';
            case 'fair':
              return 'FAIR';
            case 'needs_work':
              return 'NEEDWORK';
            default:
              return undefined;
          }
        })(),
        color: values.color || undefined,
        message: values.message,
        images: imageUrls,
      };

      // Create sell car request
      await client.post('/api/sell-car-requests', payload);

      setIsSubmitted(true);
      // cleanup
      previews.forEach((p) => URL.revokeObjectURL(p));
      setValues(initialValues);
      setPreviews([]);
    } catch (err) {
      console.error(err);
      setSubmitError((err as Error)?.message ?? 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('sell.form_title')}</h2>
      <p className="text-sm text-gray-600 mb-6">{t('sell.form_subtitle')}</p>

      {isSubmitted && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p className="font-semibold mb-1">{t('sell.form.success_title')}</p>
          <p>{t('sell.form.success_message')}</p>
        </div>
      )}

      {submitError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold mb-1">{t('sell.form.error_title', 'Submission failed')}</p>
          <p>{submitError}</p>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sell.form.owner_name')}
            </label>
            <input
              type="text"
              value={values.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              placeholder={t('sell.form.owner_name_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.ownerName && <p className="mt-1 text-xs text-red-600">{errors.ownerName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sell.form.phone')}
            </label>
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={t('sell.form.phone_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('sell.form.email')}
          </label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder={t('sell.form.email_placeholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sell.form.car_brand')}
            </label>
            <input
              type="text"
              value={values.carBrand}
              onChange={(e) => handleChange('carBrand', e.target.value)}
              placeholder={t('sell.form.car_brand_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.carBrand && <p className="mt-1 text-xs text-red-600">{errors.carBrand}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sell.form.car_model')}
            </label>
            <input
              type="text"
              value={values.carModel}
              onChange={(e) => handleChange('carModel', e.target.value)}
              placeholder={t('sell.form.car_model_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.carModel && <p className="mt-1 text-xs text-red-600">{errors.carModel}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('sell.form.color', 'Color')}</label>
            <input
              type="text"
              value={values.color}
              onChange={(e) => handleChange('color', e.target.value)}
              placeholder={t('sell.form.color_placeholder', 'e.g. Silver')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.color && <p className="mt-1 text-xs text-red-600">{errors.color}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sell.form.year')}
            </label>
            <input
              type="text"
              value={values.year}
              onChange={(e) => handleChange('year', e.target.value)}
              placeholder={t('sell.form.year_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sell.form.mileage')}
            </label>
            <input
              type="text"
              value={values.mileage}
              onChange={(e) => handleChange('mileage', e.target.value)}
              placeholder={t('sell.form.mileage_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sell.form.expected_price')}
            </label>
            <input
              type="text"
              value={values.expectedPrice}
              onChange={(e) => handleChange('expectedPrice', e.target.value)}
              placeholder={t('sell.form.expected_price_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sell.form.condition')}
            </label>
            <select
              value={values.condition}
              onChange={(e) => handleChange('condition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('sell.form.condition_placeholder')}</option>
              <option value="like_new">{t('sell.form.condition_like_new')}</option>
              <option value="good">{t('sell.form.condition_good')}</option>
              <option value="fair">{t('sell.form.condition_fair')}</option>
              <option value="needs_work">{t('sell.form.condition_needs_work')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sell.form.message')}
            </label>
            <textarea
              rows={3}
              value={values.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={t('sell.form.message_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('sell.form.images_label', 'Upload images')}</label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
            >
              {t('sell.form.images_button', 'Choose images')}
            </button>
            <p className="text-sm text-gray-500">{t('sell.form.images_help', `You can upload up to ${MAX_IMAGES} images.`)}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />

          {errors.images && <p className="mt-2 text-xs text-red-600">{errors.images}</p>}

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative rounded-md overflow-hidden border border-gray-200">
                  <img src={src} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 inline-flex items-center justify-center w-6 h-6 bg-white rounded-full border text-gray-600"
                    aria-label={t('sell.form.remove_image', 'Remove image')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {isSubmitting ? t('buttons.sending', 'Sending...') : t('sell.form.submit')}
        </button>
      </form>

      <p className="mt-4 text-[11px] text-gray-500">
        {t(
          'sell.disclaimer',
          'By submitting this form you agree that our team may contact you via phone or email about your car. We never share your details with third parties.',
        )}
      </p>
    </div>
  );
};

export default SellCarForm;
