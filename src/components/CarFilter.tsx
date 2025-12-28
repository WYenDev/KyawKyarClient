import React from 'react';
import { FilterOptions } from '../types';
import { brands as localBrands, fuelTypes, transmissions, brandModels as localBrandModels } from '../data/cars';
import { Filter, X } from 'lucide-react';
import { formatPriceLakhs } from '../utils/price';

interface CarFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
  // serverBrands may be names or ids depending on API
  serverBrands?: string[];
  // serverBrandModels may be an array of strings or array of objects {id, name}
  serverBrandModels?: Record<string, Array<string | { id?: string; name?: string }>>;
}

const CarFilter: React.FC<CarFilterProps> = ({ filters, onFiltersChange, isOpen, onToggle, serverBrands, serverBrandModels }) => {

  const updateFilters = (key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    onFiltersChange({ ...filters, [key]: value } as FilterOptions);
  };

  const CURRENT_YEAR = new Date().getFullYear();

  const clearFilters = () => {
    onFiltersChange({
      brand: '',
      model: '',
      priceRange: [0, 5000], // units: Lakhs
      yearRange: [1980, CURRENT_YEAR + 1],
      mileageRange: [0, 200000],
      fuelTypes: [],
      transmissions: [],
      bodyTypes: [],
      status: []
    });
  };

  const brandsToShow = serverBrands && serverBrands.length > 0 ? serverBrands : localBrands;
  const brandModelsRaw = serverBrandModels && Object.keys(serverBrandModels).length > 0 ? serverBrandModels : localBrandModels;

  const normalizeModelsForBrand = (brandKey?: string) => {
    if (!brandKey) return [] as { id: string; name: string }[];
    const raw = brandModelsRaw[brandKey] ?? [];
    if (raw.length === 0) return [] as { id: string; name: string }[];
    // if items are strings
    if (typeof raw[0] === 'string') {
      return (raw as string[]).map(name => ({ id: name, name }));
    }
    // items are objects
    return (raw as { id?: string; name?: string }[]).map(m => ({ id: m.id ?? m.name ?? String(m), name: m.name ?? m.id ?? String(m) }));
  };

  const getAvailableModels = () => {
    if (!filters.brand) return [] as { id: string; name: string }[];
    return normalizeModelsForBrand(filters.brand);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={onToggle}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </button>
      </div>

      {/* Filter Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-none lg:bg-transparent lg:rounded-xl lg:p-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 lg:p-6 h-full lg:h-auto overflow-y-auto lg:overflow-visible bg-white lg:bg-slate-50 rounded-xl lg:rounded-none shadow-lg lg:shadow-none">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggle}
                className="lg:hidden text-slate-500 hover:text-slate-700"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={clearFilters}
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                Clear All
              </button>
            </div>
          </div>

          <div>
            <div className="p-5 bg-white border border-slate-100 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">Filters</h4>
                  <p className="text-xs text-slate-500">Refine results using multiple filters</p>
                </div>
                <div className="flex items-center gap-3 text-right text-xs text-slate-600">
                  <div>{formatPriceLakhs(filters.priceRange[0])}</div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div>{formatPriceLakhs(filters.priceRange[1])}</div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-sm font-medium text-slate-800">Price Range</label>
                    <p className="text-xs text-slate-500">Select price in Lakhs</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="1"
                    value={filters.priceRange[0]}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value, 10);
                      if (newMin <= filters.priceRange[1]) {
                        updateFilters('priceRange', [newMin, filters.priceRange[1]]);
                      }
                    }}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-indigo-600"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="1"
                    value={filters.priceRange[1]}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value, 10);
                      if (newMax >= filters.priceRange[0]) {
                        updateFilters('priceRange', [filters.priceRange[0], newMax]);
                      }
                    }}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-indigo-600"
                  />
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500">Min</label>
                    <div className="text-sm text-slate-800">{formatPriceLakhs(filters.priceRange[0])}</div>
                  </div>
                  <div className="text-right">
                    <label className="text-xs text-slate-500">Max</label>
                    <div className="text-sm text-slate-800">{formatPriceLakhs(filters.priceRange[1])}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-sm font-medium text-slate-800 mb-2">Brand</label>
                <select
                  value={filters.brand}
                    onChange={(e) => {
                    const newBrand = e.target.value;
                    const availableModels = normalizeModelsForBrand(newBrand);
                    const retainedModel = availableModels.some(m => m.id === filters.model || m.name === filters.model) ? filters.model : '';
                    onFiltersChange({ ...filters, brand: newBrand, model: retainedModel });
                  }}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm shadow-sm bg-white"
                >
                  <option value="">All</option>
                  {brandsToShow.map((brand: string) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-sm font-medium text-slate-800 mb-2">Model</label>
                <select
                  value={filters.model}
                  onChange={(e) => updateFilters('model', e.target.value)}
                  className={`w-full border border-slate-200 rounded-md px-3 py-2 text-sm shadow-sm ${!filters.brand ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900'}`}
                  disabled={!filters.brand}
                >
                  <option value="">All</option>
                  {getAvailableModels().map((model) => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-800">Year Range</h4>
                  <p className="text-xs text-slate-500">From 1980 to next year</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.yearRange[0]}
                    onChange={(e) => updateFilters('yearRange', [parseInt(e.target.value, 10), filters.yearRange[1]])}
                    className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
                  >
                    {Array.from({ length: (new Date().getFullYear() + 1) - 1980 + 1 }, (_, i) => 1980 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select
                    value={filters.yearRange[1]}
                    onChange={(e) => updateFilters('yearRange', [filters.yearRange[0], parseInt(e.target.value, 10)])}
                    className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
                  >
                    {Array.from({ length: (new Date().getFullYear() + 1) - 1980 + 1 }, (_, i) => 1980 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-sm font-medium text-slate-800 mb-2">Fuel Type</label>
                <div className="flex flex-wrap gap-2">
                  {fuelTypes.map((fuelType) => (
                    <button
                      key={fuelType}
                      onClick={() => {
                        const selected = filters.fuelTypes.includes(fuelType);
                        if (selected) {
                          // deselect if already selected
                          updateFilters('fuelTypes', []);
                        } else {
                          // single-select: selecting one clears others
                          updateFilters('fuelTypes', [fuelType]);
                        }
                      }}
                      aria-pressed={filters.fuelTypes.includes(fuelType)}
                      className={`px-3 py-1 rounded-full text-sm border ${filters.fuelTypes.includes(fuelType) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
                    >
                      {fuelType}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-sm font-medium text-slate-800 mb-2">Transmission</label>
                <div className="flex flex-wrap gap-2">
                  {transmissions.map((transmission) => (
                    <button
                      key={transmission}
                      onClick={() => {
                        const selected = filters.transmissions.includes(transmission);
                        if (selected) updateFilters('transmissions', filters.transmissions.filter(t => t !== transmission));
                        else updateFilters('transmissions', [...filters.transmissions, transmission]);
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${filters.transmissions.includes(transmission) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
                    >
                      {transmission}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-sm font-medium text-slate-800 mb-2">Status</label>
                <div className="flex gap-2">
                  {(['available', 'sold', 'reserved'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        const selected = filters.status.includes(status);
                        if (selected) updateFilters('status', filters.status.filter(s => s !== status));
                        else updateFilters('status', [...filters.status, status]);
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${filters.status.includes(status) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Footer actions (desktop sticky) */}
          <div className="mt-4 lg:mt-6">
            <div className="flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Reset
              </button>
              <button
                onClick={() => onToggle()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default CarFilter;
