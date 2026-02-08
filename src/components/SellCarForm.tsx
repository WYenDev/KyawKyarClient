import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Sparkles } from 'lucide-react';
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
  const { t, i18n } = useTranslation('cars');
  const isMyanmar = i18n?.language?.startsWith('mm');
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
          if (urlItem.key) {
            imageUrls.push(urlItem.key);
          }}
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
        details: values.message,
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
    <div className="bg-white rounded-none border border-slate-100 p-5 sm:p-8">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h2 className={`text-xl sm:text-2xl font-black mb-1 tracking-tight ${isMyanmar ? 'font-myanmar leading-relaxed' : ''}`}>
          <span className="inline-block pt-3 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            {t('sell.form_title')}
          </span>
        </h2>
        <p className="text-sm text-slate-500">{t('sell.form_subtitle')}</p>
      </div>

      {isSubmitted && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p className="font-semibold mb-1">{t('sell.form.success_title')}</p>
          <p>{t('sell.form.success_message')}</p>
        </div>
      )}

      {submitError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold mb-1">{t('sell.form.error_title', 'Submission failed')}</p>
          <p>{submitError}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              {t('sell.form.owner_name')}
            </label>
            <input
              type="text"
              value={values.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              placeholder={t('sell.form.owner_name_placeholder')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            {errors.ownerName && <p className="mt-1 text-xs text-red-600">{errors.ownerName}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              {t('sell.form.phone')}
            </label>
            <div className="relative">
              <input
                type="tel"
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder={t('sell.form.phone_placeholder')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            {t('sell.form.email')}
          </label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder={t('sell.form.email_placeholder')}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              {t('sell.form.car_brand')}
            </label>
            <input
              type="text"
              value={values.carBrand}
              onChange={(e) => handleChange('carBrand', e.target.value)}
              placeholder={t('sell.form.car_brand_placeholder')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            {errors.carBrand && <p className="mt-1 text-xs text-red-600">{errors.carBrand}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              {t('sell.form.car_model')}
            </label>
            <input
              type="text"
              value={values.carModel}
              onChange={(e) => handleChange('carModel', e.target.value)}
              placeholder={t('sell.form.car_model_placeholder')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            {errors.carModel && <p className="mt-1 text-xs text-red-600">{errors.carModel}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">{t('sell.form.color', 'Color')}</label>
            <input
              type="text"
              value={values.color}
              onChange={(e) => handleChange('color', e.target.value)}
              placeholder={t('sell.form.color_placeholder', 'e.g. Silver')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            {errors.color && <p className="mt-1 text-xs text-red-600">{errors.color}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              {t('sell.form.year')}
            </label>
            <input
              type="text"
              value={values.year}
              onChange={(e) => handleChange('year', e.target.value)}
              placeholder={t('sell.form.year_placeholder')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              {t('sell.form.mileage')}
            </label>
            <input
              type="text"
              value={values.mileage}
              onChange={(e) => handleChange('mileage', e.target.value)}
              placeholder={t('sell.form.mileage_placeholder')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              {t('sell.form.expected_price')}
            </label>
            <input
              type="text"
              value={values.expectedPrice}
              onChange={(e) => handleChange('expectedPrice', e.target.value)}
              placeholder={t('sell.form.expected_price_placeholder')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              {t('sell.form.condition')}
            </label>
            <select
              value={values.condition}
              onChange={(e) => handleChange('condition', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none"
            >
              <option value="">{t('sell.form.condition_placeholder')}</option>
              <option value="like_new">{t('sell.form.condition_like_new')}</option>
              <option value="good">{t('sell.form.condition_good')}</option>
              <option value="fair">{t('sell.form.condition_fair')}</option>
              <option value="needs_work">{t('sell.form.condition_needs_work')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            {t('sell.form.message')}
          </label>
          <textarea
            rows={4}
            value={values.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder={t('sell.form.message_placeholder')}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
          />
        </div>

        {/* Image upload */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">{t('sell.form.images_label', 'Upload images')}</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
              {t('sell.form.images_button', 'Choose images')}
            </button>
            <p className="text-xs text-slate-500">{t('sell.form.images_help', `You can upload up to ${MAX_IMAGES} images.`)}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />

          {errors.images && <p className="mt-2 text-xs text-red-600 font-medium">{errors.images}</p>}

          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 flex items-center justify-center w-7 h-7 bg-white/90 backdrop-blur rounded-full border border-slate-200 text-slate-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={t('sell.form.remove_image', 'Remove image')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {isSubmitting ? t('buttons.sending', 'Sending...') : t('sell.form.submit')}
          </button>
          
          <p className="mt-4 text-[11px] text-slate-500 text-center leading-relaxed">
            {t(
              'sell.disclaimer',
              'By submitting this form you agree that our team may contact you via phone or email about your car. We never share your details with third parties.',
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default SellCarForm;
