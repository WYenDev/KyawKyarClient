import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CarListItemSearch, useGetApiHome } from '../services/api';
import { Calendar, Gauge, Fuel, Settings, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ViberIcon from '../assets/viber-icon.avif';

interface CarCardProps {
  car: CarListItemSearch;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { t } = useTranslation('cars');
  const navigate = useNavigate();
  const { data: homeData } = useGetApiHome();
  const phoneNumber = (homeData?.phoneNo ?? '').toString().replace(/\s/g, '');
  const viberNumber = (homeData?.viberNo ?? '').toString().replace(/\s/g, '').replace(/^\+/, '');
  const hasPhone = phoneNumber.length > 0;
  const hasViber = viberNumber.length > 0;
  const hasContact = hasPhone || hasViber;

  {/*
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.Available:
        return 'bg-green-100 text-green-800 border border-green-200';
      case Status.Sold:
        return 'bg-red-100 text-red-800 border border-red-200';
      //case 'reserved':
      //  return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  */}
  const handleClick = () => {
    navigate(`/cars/${car.id}`);
  };

  return (
    <div
      className="bg-white rounded-none border border-slate-100 transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="relative">
        <img
          src={car.primaryImage?.url || 'https://www.shutterstock.com/image-vector/flat-car-picture-placeholder-symbol-600nw-2366856295.jpg'}
          alt={`carImage} ${car.model?.name}`}
          className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {/* 

        <div className="absolute top-3 left-3 flex gap-2">
          {car.isFeatured && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
          {car.isPopular && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Popular
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(car.status)}`}>
            {t(`${car.status}`)}
          </span>
        </div>

        */}
      </div>

      <div className="p-6 flex flex-col min-h-[280px]">
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {car.model?.brand?.name || ""} {car.model?.name || ""}
            </h3>
            <div className="flex items-center text-slate-600 text-sm">
              <MapPin className="h-4 w-4 mr-1 shrink-0" />
              {car.showroom?.city || 'Unknown Location'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {car.modelYear}
            </div>
            <div className="flex items-center">
              <Gauge className="h-4 w-4 mr-2 text-gray-400" />
              {(car.mileage).toLocaleString()} km
            </div>
            <div className="flex items-center">
              <Fuel className="h-4 w-4 mr-2 text-gray-400" />
              {car.fuelType?.name}
            </div>
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2 text-gray-400" />
              {car.transmissionType?.name}
            </div>
          </div>

          {
            ((car as any).formattedPrice || car.price > 0) && (
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {(car as any).formattedPrice || car.price} {t('details.lakhs', 'LAKHs')}
                </div>
              </div>
            )
          }
        </div>
        {hasContact && (
          <div className="grid grid-cols-2 gap-3 mt-auto pt-4" onClick={(e) => e.stopPropagation()}>
            {hasPhone ? (
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center py-4 px-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-red-500/10 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow-md border border-slate-100 hover:border-red-400/30"
                aria-label="Call"
              >
                <Phone className="h-6 w-6" />
              </a>
            ) : (
              <div />
            )}
            {hasViber ? (
              <a
                href={`viber://chat?number=%2B${viberNumber}`}
                className="flex items-center justify-center py-4 px-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#7360f2]/40 hover:bg-[#7360f2]/10 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden"
                aria-label="Viber"
              >
                <img src={ViberIcon} alt="" className="h-6 w-6 object-contain" />
              </a>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarCard;
