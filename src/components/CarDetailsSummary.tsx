import React from 'react';
import { Calendar, Gauge, Fuel, Settings, Palette, Box, Badge, MapPin } from 'lucide-react';
import CarEngine from "../assets/car-engine.webp";
import LicensePlate from "../assets/licnese-plate.png"
import { useTranslation } from 'react-i18next';

// Define a proper interface to avoid using 'as any'
interface Car {
  model?: {
    brand?: { name: string };
    name: string;
  };
  formattedPrice: string;
  modelYear: number;
  formattedLicense?: string;
  mileage: number;
  fuel: string;
  transmission: string;
  color?: { name: string };
  buildType?: { name: string } | number; // Handling the potential number/object mix
  steering: string;
  enginePower?: number;
  grade?: { name: string };
  showroom?: { city: string };
  license?: { region?: { name: string } };
}

interface Props {
  car: Car;
  callToActionPhone?: string;
}

const CarDetailsSummary: React.FC<Props> = ({ car, callToActionPhone }) => {
  const { t } = useTranslation('cars');

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        {car?.model?.brand?.name} {car?.model?.name}
      </h1>

      <div className="flex items-center justify-between my-6">
        <div>
          <div className="text-3xl font-extrabold text-blue-700">{car.formattedPrice}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 text-gray-700">
        {/* Year */}
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-3 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">{t('details.year', 'Year')}</div>
            <div className="text-lg font-semibold text-gray-900">{car.modelYear}</div>
          </div>
        </div>

        {/* License */}
        {car.formattedLicense && (
          <div className="flex items-center">
            <img src={LicensePlate} alt="License" className="w-6 h-6 mr-3" />
            <div>
              <div className="text-sm text-gray-600">{t('details.licnese', 'License')}</div>
              <div className="text-lg font-semibold text-gray-900">{car.formattedLicense}</div>
            </div>
          </div>
        )}

        {/* Mileage */}
        <div className="flex items-center">
          <Gauge className="h-5 w-5 mr-3 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">{t('details.mileage', 'Mileage')}</div>
            <div className="text-lg font-semibold text-gray-900">{car.mileage.toLocaleString()} km</div>
          </div>
        </div>

        {/* Fuel */}
        <div className="flex items-center">
          <Fuel className="h-5 w-5 mr-3 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">{t('details.fuel_type', 'Fuel Type')}</div>
            <div className="text-lg font-semibold text-gray-900">{car.fuel}</div>
          </div>
        </div>

        {/* Transmission */}
        <div className="flex items-center">
          <Settings className="h-5 w-5 mr-3 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">{t('details.transmission', 'Transmission')}</div>
            <div className="text-lg font-semibold text-gray-900">{car.transmission}</div>
          </div>
        </div>

        {/* Color */}
        <div className="flex items-center">
          <Palette className="h-5 w-5 mr-3 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">{t('details.color', 'Color')}</div>
            <div className="text-lg font-semibold text-gray-900">{car.color?.name ?? ''}</div>
          </div>
        </div>

        {/* Build Type - FIXED: Added !! to prevent rendering 0 */}
        {!!car.buildType && typeof car.buildType === 'object' && (
          <div className="flex items-center">
            <Box className="h-5 w-5 mr-3 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">{t('details.build_type', 'Build Type')}</div>
              <div className="text-lg font-semibold text-gray-900">{car.buildType.name}</div>
            </div>
          </div>
        )}

        {/* Steering */}
        <div className="flex items-center">
          <Box className="h-5 w-5 mr-3 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">{t('details.steerin_position', 'Steering Position')}</div>
            <div className="text-lg font-semibold text-gray-900">{car.steering}</div>
          </div>
        </div>

        {/* Engine Power */}
        {!!car.enginePower && (
          <div className="flex items-center">
            <img src={CarEngine} alt="Engine" className="w-6 h-6 mr-3" />
            <div>
              <div className="text-sm text-gray-600">{t('details.engine_power', 'Engine Power')}</div>
              <div className="text-lg font-semibold text-gray-900">{car.enginePower} HP</div>
            </div>
          </div>
        )}

        {/* Grade */}
        {!!car.grade && (
          <div className="flex items-center">
            <Badge className="h-5 w-5 mr-3 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">{t('details.grade', 'Grade')}</div>
              <div className="text-lg font-semibold text-gray-900">{car.grade.name}</div>
            </div>
          </div>
        )}

        {/* Showroom Location */}
        {!!car.showroom?.city && (
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-3 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">{t('details.showroom_location', 'Showroom Location')}</div>
              <div className="text-lg font-semibold text-gray-900">{car.showroom.city}</div>
            </div>
          </div>
        )}

        {/* License Region */}
        {!!car.license?.region && (
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-3 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">{t('details.licence', 'License Region')}</div>
              <div className="text-lg font-semibold text-gray-900">{car.license.region.name}</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-10">
        <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center transition-colors">
          {t('details.call_now', callToActionPhone ?? 'Call Now: +95-9-123-456-789')}
        </button>
        <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center transition-colors">
          {'Viber'}
        </button>
      </div>
    </div>
  );
};

export default CarDetailsSummary;
