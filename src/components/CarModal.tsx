import React, { useState } from 'react';
import { Car } from '../types';
import { X, Calendar, Gauge, Fuel, Settings, MapPin, Phone, Mail, Heart } from 'lucide-react';
import { formatPriceLakhs } from '../utils/price';

interface CarModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

const CarModal: React.FC<CarModalProps> = ({ car, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {car.brand} {car.model}
              </h2>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {car.location}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="mb-4">
                <img 
                  src={car.images[currentImageIndex]} 
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              {car.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-700 mb-2">
                  {formatPriceLakhs(car.price)}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  car.status === 'available' ? 'bg-green-100 text-green-800' :
                  car.status === 'sold' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                </span>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Year</div>
                    <div className="font-medium">{car.year}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Gauge className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Mileage</div>
                    <div className="font-medium">{car.mileage.toLocaleString()} km</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Fuel className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Fuel Type</div>
                    <div className="font-medium">{car.fuelType}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Settings className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Transmission</div>
                    <div className="font-medium">{car.transmission}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{car.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Heart className="h-4 w-4 mr-2 text-gray-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                  <Phone className="h-5 w-5" />
                  <span>Call Now: +95-9-123-456-789</span>
                </button>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                  <Mail className="h-5 w-5" />
                  <span>Request More Info</span>
                </button>
                <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors">
                  Schedule Test Drive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarModal;
