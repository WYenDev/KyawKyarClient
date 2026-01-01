import { Car } from '../types';

export const cars: Car[] = [
  // Toyota Cars
  {
    id: '1',
    brand: 'Toyota',
    model: 'Crown',
    year: 2020,
    price: 45000000,
    mileage: 35000,
    fuelType: 'Hybrid',
    transmission: 'Manual',
    bodyType: 'Sedan',
    color: 'Pearl White',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/193991/pexels-photo-193991.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Leather Seats', 'Navigation System', 'Backup Camera', 'Bluetooth', 'Sunroof'],
    description: 'Luxury Toyota Crown with premium features and excellent condition.',
    isFeatured: true,
    isPopular: true,
    location: 'Yangon'
  },
  {
    id: '2',
    brand: 'Toyota',
    model: 'Mark II',
    year: 2019,
    price: 38000000,
    mileage: 42000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'Silver Metallic',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Power Steering', 'Air Conditioning', 'Electric Windows', 'Central Locking'],
    description: 'Classic Toyota Mark II in excellent condition with low mileage.',
    isFeatured: false,
    isPopular: true,
    location: 'Yangon'
  },
  {
    id: '3',
    brand: 'Toyota',
    model: 'Ractis',
    year: 2018,
    price: 32000000,
    mileage: 48000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Hatchback',
    color: 'Blue Metallic',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Compact Design', 'Fuel Efficient', 'Easy Parking', 'Reliable Engine'],
    description: 'Compact and fuel-efficient Toyota Ractis perfect for city driving.',
    isFeatured: false,
    isPopular: false,
    location: 'Mandalay'
  },
  {
    id: '4',
    brand: 'Toyota',
    model: 'Camry',
    year: 2021,
    price: 52000000,
    mileage: 25000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'Midnight Black',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Hybrid Engine', 'Advanced Safety', 'Premium Interior', 'Touchscreen'],
    description: 'Latest Toyota Camry with hybrid technology and premium features.',
    isFeatured: true,
    isPopular: true,
    location: 'Yangon'
  },
  {
    id: '5',
    brand: 'Toyota',
    model: 'Vitz',
    year: 2017,
    price: 28000000,
    mileage: 55000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Hatchback',
    color: 'Red',
    status: 'sold',
    images: [
      'https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Compact Size', 'Good Fuel Economy', 'Easy Maintenance', 'City Car'],
    description: 'Popular Toyota Vitz ideal for first-time car owners.',
    isFeatured: false,
    isPopular: true,
    location: 'Yangon'
  },

  // Honda Cars
  {
    id: '6',
    brand: 'Honda',
    model: 'Civic',
    year: 2020,
    price: 42000000,
    mileage: 38000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'White Pearl',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Sport Design', 'Turbo Engine', 'Premium Sound', 'Safety Package'],
    description: 'Sporty Honda Civic with excellent performance and modern features.',
    isFeatured: true,
    isPopular: false,
    location: 'Yangon'
  },
  {
    id: '7',
    brand: 'Honda',
    model: 'CR-V',
    year: 2019,
    price: 48000000,
    mileage: 35000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Space Gray',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['AWD', 'Safety Package', 'Premium Sound', 'Heated Seats', 'Power Tailgate'],
    description: 'Spacious and reliable Honda CR-V perfect for families.',
    isFeatured: true,
    isPopular: true,
    location: 'Mandalay'
  },
  {
    id: '8',
    brand: 'Honda',
    model: 'Accord',
    year: 2018,
    price: 39000000,
    mileage: 45000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'Silver',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Spacious Interior', 'Comfortable Ride', 'Reliable Engine', 'Good Resale Value'],
    description: 'Well-maintained Honda Accord with spacious interior.',
    isFeatured: false,
    isPopular: false,
    location: 'Yangon'
  },
  {
    id: '9',
    brand: 'Honda',
    model: 'Fit',
    year: 2019,
    price: 33000000,
    mileage: 41000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    bodyType: 'Hatchback',
    color: 'Blue',
    status: 'reserved',
    images: [
      'https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Hybrid Technology', 'Spacious Interior', 'Fuel Efficient', 'Reliable'],
    description: 'Honda Fit hybrid with excellent fuel economy and reliability.',
    isFeatured: false,
    isPopular: true,
    location: 'Mandalay'
  },

  // Nissan Cars
  {
    id: '10',
    brand: 'Nissan',
    model: 'Altima',
    year: 2018,
    price: 35000000,
    mileage: 52000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'Midnight Blue',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Push Start', 'Cruise Control', 'Power Windows', 'Air Conditioning'],
    description: 'Well-maintained Nissan Altima with good fuel economy.',
    isFeatured: false,
    isPopular: true,
    location: 'Yangon'
  },
  {
    id: '11',
    brand: 'Nissan',
    model: 'X-Trail',
    year: 2020,
    price: 46000000,
    mileage: 32000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Gun Metallic',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['7 Seater', 'AWD', 'Navigation', 'Panoramic Sunroof', 'Safety Features'],
    description: 'Spacious Nissan X-Trail with 7-seater configuration.',
    isFeatured: true,
    isPopular: false,
    location: 'Naypyidaw'
  },
  {
    id: '12',
    brand: 'Nissan',
    model: 'March',
    year: 2017,
    price: 26000000,
    mileage: 58000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Hatchback',
    color: 'Pink',
    status: 'sold',
    images: [
      'https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Compact Design', 'Easy Parking', 'Fuel Efficient', 'Low Maintenance'],
    description: 'Cute and compact Nissan March perfect for city driving.',
    isFeatured: false,
    isPopular: false,
    location: 'Yangon'
  },

  // Mazda Cars
  {
    id: '13',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2021,
    price: 48000000,
    mileage: 25000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Soul Red',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Premium Interior', 'Advanced Safety', 'Touchscreen', 'Wireless Charging'],
    description: 'Nearly new Mazda CX-5 with premium features and warranty.',
    isFeatured: true,
    isPopular: true,
    location: 'Naypyidaw'
  },
  {
    id: '14',
    brand: 'Mazda',
    model: 'Axela',
    year: 2019,
    price: 36000000,
    mileage: 43000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'White',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Sport Design', 'Good Handling', 'Fuel Efficient', 'Modern Interior'],
    description: 'Stylish Mazda Axela with excellent driving dynamics.',
    isFeatured: false,
    isPopular: false,
    location: 'Mandalay'
  },
  {
    id: '15',
    brand: 'Mazda',
    model: 'Demio',
    year: 2018,
    price: 29000000,
    mileage: 47000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Hatchback',
    color: 'Black',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Compact Size', 'Good Fuel Economy', 'Reliable', 'Easy to Drive'],
    description: 'Reliable Mazda Demio perfect for daily commuting.',
    isFeatured: false,
    isPopular: true,
    location: 'Yangon'
  },

  // BMW Cars
  {
    id: '16',
    brand: 'BMW',
    model: '3 Series',
    year: 2020,
    price: 65000000,
    mileage: 32000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'Jet Black',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Luxury Package', 'Sport Suspension', 'Premium Sound', 'Ambient Lighting'],
    description: 'Luxury BMW 3 Series with exceptional performance.',
    isFeatured: true,
    isPopular: false,
    location: 'Yangon'
  },
  {
    id: '17',
    brand: 'BMW',
    model: 'X3',
    year: 2019,
    price: 72000000,
    mileage: 38000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Alpine White',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['xDrive AWD', 'Luxury Interior', 'Advanced Technology', 'Premium Sound'],
    description: 'Premium BMW X3 SUV with all-wheel drive and luxury features.',
    isFeatured: true,
    isPopular: false,
    location: 'Yangon'
  },

  // Hyundai Cars
  {
    id: '18',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2019,
    price: 38000000,
    mileage: 41000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Silver',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Safety Features', 'Touchscreen', 'Backup Camera', 'Bluetooth'],
    description: 'Reliable Hyundai Tucson with excellent safety ratings.',
    isFeatured: false,
    isPopular: true,
    location: 'Mandalay'
  },
  {
    id: '19',
    brand: 'Hyundai',
    model: 'Elantra',
    year: 2020,
    price: 34000000,
    mileage: 36000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'White',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Modern Design', 'Fuel Efficient', 'Comfortable Interior', 'Good Value'],
    description: 'Modern Hyundai Elantra with excellent fuel efficiency.',
    isFeatured: false,
    isPopular: false,
    location: 'Yangon'
  },

  // Kia Cars
  {
    id: '20',
    brand: 'Kia',
    model: 'Optima',
    year: 2018,
    price: 32000000,
    mileage: 58000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'White Pearl',
    status: 'sold',
    images: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Heated Seats', 'Panoramic Sunroof', 'Premium Audio', 'Smart Key'],
    description: 'Feature-rich Kia Optima with comfortable interior.',
    isFeatured: false,
    isPopular: false,
    location: 'Yangon'
  },
  {
    id: '21',
    brand: 'Kia',
    model: 'Sportage',
    year: 2020,
    price: 44000000,
    mileage: 33000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Red',
    status: 'available',
    images: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['AWD', 'Safety Package', 'Touchscreen', 'Heated Seats'],
    description: 'Stylish Kia Sportage SUV with all-wheel drive capability.',
    isFeatured: false,
    isPopular: true,
    location: 'Naypyidaw'
  }
];

export const brands = Array.from(new Set(cars.map(car => car.brand))).sort();
export const fuelTypes = Array.from(new Set(cars.map(car => car.fuelType))).sort();
export const transmissions = Array.from(new Set(cars.map(car => car.transmission))).sort();
export const bodyTypes = Array.from(new Set(cars.map(car => car.bodyType))).sort();

// Brand-specific models
export const brandModels: Record<string, string[]> = {
  'Toyota': ['Crown', 'Mark II', 'Ractis', 'Camry', 'Vitz'],
  'Honda': ['Civic', 'CR-V', 'Accord', 'Fit'],
  'Nissan': ['Altima', 'X-Trail', 'March'],
  'Mazda': ['CX-5', 'Axela', 'Demio'],
  'BMW': ['3 Series', 'X3'],
  'Hyundai': ['Tucson', 'Elantra'],
  'Kia': ['Optima', 'Sportage']
};
