import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CarListItem } from '../services/api';

interface FeaturedCardProps {
  car: CarListItem;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const title = `${car?.model?.brand?.name || ''} ${car?.model?.name || ''}`.trim();
  const imgSrc = car.primaryImage?.url;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/cars/${car.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/cars/${car.id}`); }}
      className="group flex-shrink-0 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        <img
          src={imgSrc || 'https://www.shutterstock.com/image-vector/flat-car-picture-placeholder-symbol-600nw-2366856295.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute left-3 bottom-3 bg-white/90 text-slate-900 px-3 py-0.5 rounded-full text-sm font-semibold shadow">{car.modelYear || ''}</div>
      </div>

      <div className="p-3 bg-white">
        <h3 className="text-base text-center font-semibold text-slate-900 truncate">{title}</h3>
      </div>
    </article>
  );
};

export default FeaturedCard;
