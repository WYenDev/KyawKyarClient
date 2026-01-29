import React from 'react';
import { FilterOptions } from '../types';
import { brands as localBrands, fuelTypes as localFuelTypes, transmissions as localTransmissions, brandModels as localBrandModels } from '../data/cars';
import { Filter, X } from 'lucide-react';
import { formatPriceLakhs } from '../utils/price';

interface CarFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
  // serverBrands may be names or ids depending on API
  serverBrands?: string[];
  // serverBrandModels can be Record<string, any> to support both legacy array (local) and API object structure
  serverBrandModels?: Record<string, any>;
  // serverBodyTypes (build types) may be array of strings or objects
  serverBodyTypes?: Array<string | { id?: string; name?: string }>;
  // serverShowrooms may be array of strings or objects {id, city, name}
  serverShowrooms?: Array<string | { id?: string; city?: string; name?: string }>;
  serverSteeringPositions?: Array<string | { id?: string; name?: string }>;
  // serverFuelTypes may be array of strings or objects {id, name}
  serverFuelTypes?: Array<string | { id?: string; name?: string }>;
  // serverTransmissionTypes may be array of strings or objects {id, name}
  serverTransmissionTypes?: Array<string | { id?: string; name?: string }>;
}

const CarFilter: React.FC<CarFilterProps> = ({ filters, onFiltersChange, isOpen, onToggle, serverBrands, serverBrandModels, serverBodyTypes, serverShowrooms, serverSteeringPositions, serverFuelTypes, serverTransmissionTypes }) => {

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
      showrooms: [],
      steeringPositions: [],
      status: []
    });
  };

  const brandsToShow = serverBrands && serverBrands.length > 0 ? serverBrands : localBrands;
  const brandModelsRaw = serverBrandModels && Object.keys(serverBrandModels).length > 0 ? serverBrandModels : localBrandModels;

  const normalizeModelsForBrand = (brandKey?: string) => {
    if (!brandKey) return [] as { id: string; name: string; carCount?: number }[];
    
    const raw: any = brandModelsRaw[brandKey];
    if (!raw) return [] as { id: string; name: string; carCount?: number }[];

    // Handle API structure: { totalCars: number, models: [...] }
    if (raw.models && Array.isArray(raw.models)) {
        const modelsArr = raw.models as Array<{ id?: string; name?: string; carCount?: number } | string>;
        return modelsArr.map((m) => ({
            id: (typeof m === 'string' ? m : (m.id ?? m.name ?? String(m))),
            name: (typeof m === 'string' ? m : (m.name ?? m.id ?? String(m))),
            carCount: typeof m === 'string' ? undefined : (m.carCount)
        }));
    }

    // Handle local data or array structure
    if (Array.isArray(raw)) {
        if (raw.length === 0) return [] as { id: string; name: string; carCount?: number }[];
        
        if (typeof raw[0] === 'string') {
            return (raw as string[]).map(name => ({ id: name, name, carCount: undefined }));
        }
        
        return (raw as { id?: string; name?: string }[]).map(m => ({
            id: m.id ?? m.name ?? String(m),
            name: m.name ?? m.id ?? String(m),
            carCount: undefined
        }));
    }

    return [] as { id: string; name: string; carCount?: number }[];
  };

  const getAvailableModels = () => {
    if (!filters.brand) return [] as { id: string; name: string; carCount?: number }[];
    return normalizeModelsForBrand(filters.brand);
  };

  // normalize strings or objects to {id, name}
  const normalizeStringsOrObjects = (arr?: Array<string | { id?: string; name?: string }>) => {
    if (!arr) return [] as { id: string; name: string }[];
    if (arr.length === 0) return [] as { id: string; name: string }[];
    if (typeof arr[0] === 'string') {
      return (arr as string[]).map(s => ({ id: s, name: s }));
    }
    return (arr as { id?: string; name?: string }[]).map(o => ({ id: o.id ?? o.name ?? String(o), name: o.name ?? o.id ?? String(o) }));
  };


  const bodyTypesToShow = (serverBodyTypes && serverBodyTypes.length > 0)
    ? normalizeStringsOrObjects(serverBodyTypes).map(b => b.name)
    : [];

  const normalizeShowrooms = (arr?: Array<string | { id?: string; city?: string; name?: string }>) => {
    if (!arr) return [] as { id: string; city: string; name: string }[];
    if (arr.length === 0) return [] as { id: string; city: string; name: string }[];
    if (typeof arr[0] === 'string') {
      return (arr as string[]).map(s => ({ id: s, city: s, name: s }));
    }
    return (arr as { id?: string; city?: string; name?: string }[]).map(o => ({ id: o.id ?? o.city ?? o.name ?? String(o), city: o.city ?? o.name ?? '', name: o.name ?? o.city ?? '' }));
  };

  const showroomsToShow = normalizeShowrooms(serverShowrooms);
  const steeringToShow = normalizeStringsOrObjects(serverSteeringPositions).map(s => s.name);

  // Fuel and Transmission: prefer server-provided lists when available, otherwise fall back to local data
  const normalizeIdNameList = (arr?: Array<string | { id?: string; name?: string }>) => {
    if (!arr) return [] as { id: string; name: string }[];
    if (arr.length === 0) return [] as { id: string; name: string }[];
    if (typeof arr[0] === 'string') {
      return (arr as string[]).map(s => ({ id: s, name: s }));
    }
    return (arr as { id?: string; name?: string }[]).map(o => ({ id: o.id ?? o.name ?? String(o), name: o.name ?? o.id ?? String(o) }));
  };

  const fuelTypesToShow = serverFuelTypes && serverFuelTypes.length > 0
    ? normalizeIdNameList(serverFuelTypes)
    : (localFuelTypes || []).map((f: string) => ({ id: f, name: f }));

  const transmissionsToShow = serverTransmissionTypes && serverTransmissionTypes.length > 0
    ? normalizeIdNameList(serverTransmissionTypes)
    : (localTransmissions || []).map((t: string) => ({ id: t, name: t }));

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
                  {brandsToShow.map((brand: string) => {
                    const count = (serverBrandModels as any)?.[brand]?.totalCars;
                    return (
                      <option key={brand} value={brand}>
                        {brand}{count !== undefined ? ` (${count})` : ''}
                      </option>
                    );
                  })}
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
                   {getAvailableModels().map((model: { id: string; name: string; carCount?: number }) => (
                     <option key={model.id} value={model.id}>
                       {model.name}{model.carCount !== undefined ? ` (${model.carCount})` : ''}
                     </option>
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
                  {fuelTypesToShow.map((fuelType: { id: string; name: string }) => (
                    <button
                      key={fuelType.id}
                      onClick={() => {
                        const selected = filters.fuelTypes.includes(fuelType.id);
                        if (selected) {
                          // deselect if already selected
                          updateFilters('fuelTypes', []);
                        } else {
                          // single-select: selecting one clears others
                          updateFilters('fuelTypes', [fuelType.id]);
                        }
                      }}
                      aria-pressed={filters.fuelTypes.includes(fuelType.id)}
                      className={`px-3 py-1 rounded-full text-sm border ${filters.fuelTypes.includes(fuelType.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
                    >
                      {fuelType.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-sm font-medium text-slate-800 mb-2">Transmission</label>
                <div className="flex flex-wrap gap-2">
                  {transmissionsToShow.map((transmission: { id: string; name: string }) => (
                    <button
                      key={transmission.id}
                      onClick={() => {
                        const selected = filters.transmissions.includes(transmission.id);
                        if (selected) updateFilters('transmissions', filters.transmissions.filter(t => t !== transmission.id));
                        else updateFilters('transmissions', [...filters.transmissions, transmission.id]);
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${filters.transmissions.includes(transmission.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
                    >
                      {transmission.name}
                    </button>
                  ))}
                </div>
              </div>

              {/*  
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
              */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-sm font-medium text-slate-800 mb-2">Build Type</label>
                <div className="flex flex-wrap gap-2">
                    {(bodyTypesToShow.length > 0 ? bodyTypesToShow : []).map((bt) => (
                    <button
                      key={bt}
                      onClick={() => {
                        const selected = filters.bodyTypes.includes(bt);
                        if (selected) updateFilters('bodyTypes', []);
                        else updateFilters('bodyTypes', [bt]);
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${filters.bodyTypes.includes(bt) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
                    >
                      {bt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-sm font-medium text-slate-800 mb-2">Steering Position</label>
                <div className="flex flex-wrap gap-2">
                  {(steeringToShow.length > 0 ? steeringToShow : ['Left','Right']).map((sp) => (
                    <button
                      key={sp}
                      onClick={() => {
                        const selected = (filters.steeringPositions ?? []).includes(sp);
                        if (selected) updateFilters('steeringPositions', []);
                        else updateFilters('steeringPositions', [sp]);
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${(filters.steeringPositions ?? []).includes(sp) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}>
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-sm font-medium text-slate-800 mb-2">Showroom</label>
                <div className="flex flex-wrap gap-2">
{(showroomsToShow.length > 0 ? showroomsToShow : []).map((s) => {
                    const id = s.id;
                    const selected = (filters.showrooms ?? []).includes(id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (selected) updateFilters('showrooms', []);
                          else updateFilters('showrooms', [id]);
                        }}
                        className={`px-3 py-1 rounded-full text-sm border ${selected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}>
                        {s.name || s.city}
                      </button>
                    );
                  })}
                </div>
              </div>

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
