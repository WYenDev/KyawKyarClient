import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useGetApiCarsId } from '../services/api';
import CarDetailsGallery from '../components/CarDetailsGallery';
import CarDetailsSummary from '../components/CarDetailsSummary';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('cars');

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: carData, isLoading, isError } = useGetApiCarsId(id ?? '');

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-32 mb-4" />
          <div className="h-64 bg-slate-200 rounded mb-4" />
          <div className="h-4 bg-slate-200 rounded w-48" />
        </div>
      </div>
    );
  }

  if (isError || !carData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('details.back', 'Back')}
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('details.not_found_title', 'Car not found')}</h1>
        <p className="text-gray-600 mb-6">{t('details.not_found_description', 'The car you are looking for does not exist or may have been removed.')}</p>
        <button
          type="button"
          onClick={() => navigate('/buyCars')}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-sm font-medium"
        >
          {t('details.back_to_inventory', 'Back to inventory')}
        </button>
      </div>
    );
  }


  const images = (carData as any)?.images ?? [];

  const handlePreviousImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };


  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb / Back */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('details.back', 'Back to results')}
          </button>
          <div className="text-xs text-gray-500 hidden sm:block">
            <span className="cursor-pointer hover:text-gray-800" onClick={() => navigate('/')}>{t('details.breadcrumb_home', 'Home')}</span>
            <span className="mx-1">/</span>
            <span className="cursor-pointer hover:text-gray-800" onClick={() => navigate('/buyCars')}>{t('details.breadcrumb_inventory', 'Cars')}</span>
            <span className="mx-1">/</span>
            <span className="text-gray-700">{carData?.model?.brand?.name ?? ''} {carData?.model?.name ?? ''}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <CarDetailsGallery
            images={(carData as any)?.images ?? []}
            currentIndex={currentImageIndex}
            onPrev={handlePreviousImage}
            onNext={handleNextImage}
            onSelect={(i: number) => setCurrentImageIndex(i)}
          />

          <CarDetailsSummary car={carData as any} />
        </div>

        {/* 
        Detailed sections 
        <div className="mt-12 grid lg:grid-cols-1 gap-10">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {t('details.overview', 'Car Overview')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {'description not available'}
            </p>
          </div>
        </div>
*/}
        {/* Features */}
        {/*
        {car.features && car.features.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('details.features', 'Features')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature: string) => (
                <span
                  key={feature}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
*/}
      </div>
    </div >
  );
};

export default CarDetails;
