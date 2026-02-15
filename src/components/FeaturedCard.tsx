import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CarListItem } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

interface FeaturedCardProps {
  car: CarListItem;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ car }) => {
  const { t } = useTranslation('home');
  const navigate = useNavigate();
  const { user } = useAuth();
  const title = `${car?.model?.brand?.name || ''} ${car?.model?.name || ''}`.trim();
  const imgSrc = car.primaryImage?.url;
  const showPrice = user && typeof (car as any).price === 'number' ? (car as any).price.toLocaleString() : (car as any).formattedPrice;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/cars/${car.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/cars/${car.id}`); }}
      className="group flex-shrink-0 rounded-none overflow-hidden bg-white border border-slate-100 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-56 sm:h-64 bg-gray-100 overflow-hidden">
        <img
          src={imgSrc || 'https://www.shutterstock.com/image-vector/flat-car-picture-placeholder-symbol-600nw-2366856295.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      <div className="p-3 bg-white">
        <h3 className="text-base text-left font-semibold text-slate-900 truncate mb-1">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 font-medium">{car.modelYear}</span>
          {showPrice && (
            <>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-indigo-600 font-bold">
                {showPrice} {t('lakhs', 'LAKHs')}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FeaturedCard;
