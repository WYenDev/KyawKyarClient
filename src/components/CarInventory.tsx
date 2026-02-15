import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterOptions } from '../types';
import CarCard from './CarCard';
import CarFilter from './CarFilter';
import { useGetApiCarsSearch, useGetApiCarsFilters } from '../services/api';
import type { GetApiCarsSearchParams } from '../services/api';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData } from '@tanstack/react-query';

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_FILTERS: FilterOptions = {
  brand: '',
  model: '',
  priceRange: [0, 5000],
  yearRange: [1980, CURRENT_YEAR + 1],
  mileageRange: [0, 200000],
  fuelTypes: [],
  transmissions: [],
  bodyTypes: [],
  showrooms: [],
  steeringPositions: [],
  status: []
};

const CarInventory: React.FC = () => {
  const { t } = useTranslation('cars');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  
  const LIMIT = 12;

  // --- PRO LOGIC: Derive page from URL (Single Source of Truth) ---
  const page = useMemo(() => {
    const p = searchParams.get('page');
    return p ? parseInt(p, 10) : 1;
  }, [searchParams]);

  // Fetch filter metadata
  const { data: filterData, isLoading: filtersLoading, isError: filtersError } = useGetApiCarsFilters();
  
  const serverBrands = filterData?.brandsWithModels ? Object.keys(filterData.brandsWithModels) : undefined;
  const serverBrandModels = filterData?.brandsWithModels ?? undefined;
  const serverBodyTypes = filterData?.buildTypes ?? [];
  const serverShowrooms = filterData?.showrooms ?? [];
  const serverSteeringPositions = filterData?.steeringPositions ?? [];
  const serverFuelTypes = filterData?.fuelTypes ?? [];
  const serverTransmissionTypes = filterData?.transmissionTypes ?? [];

  const parseFiltersFromSearchParams = (sp: URLSearchParams) => {
    const search = sp.get('q') ?? '';
    const parsed: FilterOptions = {
      ...DEFAULT_FILTERS,
      brand: sp.get('brand') ?? '',
      model: sp.get('model') ?? '',
      priceRange: [
        sp.get('priceMin') ? parseInt(sp.get('priceMin')!, 10) : DEFAULT_FILTERS.priceRange[0],
        sp.get('priceMax') ? parseInt(sp.get('priceMax')!, 10) : DEFAULT_FILTERS.priceRange[1]
      ],
      yearRange: [
        sp.get('yearMin') ? parseInt(sp.get('yearMin')!, 10) : DEFAULT_FILTERS.yearRange[0],
        sp.get('yearMax') ? parseInt(sp.get('yearMax')!, 10) : DEFAULT_FILTERS.yearRange[1]
      ],
      fuelTypes: sp.get('fuelTypeId') ? [sp.get('fuelTypeId')!] : [],
      transmissions: sp.get('transmissionTypeId') ? [sp.get('transmissionTypeId')!] : [],
      bodyTypes: sp.get('buildType')?.split(',').filter(Boolean) ?? [],
      showrooms: sp.get('showroom')?.split(',').filter(Boolean) ?? [],
      steeringPositions: sp.get('steeringPosition')?.split(',').filter(Boolean) ?? [],
      status: (sp.get('status')?.split(',').filter(Boolean) as any) ?? []
    };
    return { filters: parsed, search };
  };

  const serializeFiltersToParams = (f: FilterOptions, q: string, p: number) => {
    const params: Record<string, string> = {};
    if (f.brand) params.brand = f.brand;
    if (f.model) params.model = f.model;
    if (f.priceRange[0] !== DEFAULT_FILTERS.priceRange[0]) params.priceMin = String(f.priceRange[0]);
    if (f.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]) params.priceMax = String(f.priceRange[1]);
    if (f.yearRange[0] !== DEFAULT_FILTERS.yearRange[0]) params.yearMin = String(f.yearRange[0]);
    if (f.yearRange[1] !== DEFAULT_FILTERS.yearRange[1]) params.yearMax = String(f.yearRange[1]);
    if (f.fuelTypes.length > 0) params.fuelTypeId = f.fuelTypes[0];
    if (f.transmissions.length > 0) params.transmissionTypeId = f.transmissions[0];
    if (f.bodyTypes.length > 0) params.buildType = f.bodyTypes.join(',');
    if (f.showrooms && f.showrooms.length > 0) params.showroom = f.showrooms.join(',');
    if (f.steeringPositions && f.steeringPositions.length > 0) params.steeringPosition = f.steeringPositions.join(',');
    if (f.status.length > 0) params.status = f.status.join(',');
    if (q) params.q = q;
    if (p > 1) params.page = String(p);
    return params;
  };

  // Sync URL -> Local State (Handles Back/Forward buttons)
  useEffect(() => {
    const { filters: parsedFilters, search } = parseFiltersFromSearchParams(searchParams);
    setFilters(prev => JSON.stringify(prev) === JSON.stringify(parsedFilters) ? prev : parsedFilters);
    setSearchTerm(search);
  }, [searchParams]);

  // Sync Local State -> URL (Handles user interaction)
  const updateUrl = (newFilters: FilterOptions, newSearch: string, newPage: number, useReplace = false) => {
    const params = serializeFiltersToParams(newFilters, newSearch, newPage);
    setSearchParams(params, { replace: useReplace });
  };

  // When filters change, reset page to 1 and update URL
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    updateUrl(newFilters, searchTerm, 1, true); // Use replace for filter changes to keep history clean
  };

  const handlePageChange = (newPage: number) => {
    updateUrl(filters, searchTerm, newPage, false); // Use push for pagination
  };

  const apiSearchParams = useMemo((): GetApiCarsSearchParams => {
    const runtimeParams: any = {
      brand: filters.brand || undefined,
      model: filters.model || undefined,
      priceMin: filters.priceRange[0],
      priceMax: filters.priceRange[1],
      yearMin: filters.yearRange[0],
      yearMax: filters.yearRange[1],
      fuelTypeId: filters.fuelTypes[0],
      transmissionTypeId: filters.transmissions[0],
      buildType: filters.bodyTypes.join(',') || undefined,
      showroom: filters?.showrooms?.join(',') || undefined,
      steeringPosition: filters?.steeringPositions?.join(',') || undefined,
      page,
      limit: LIMIT,
    };
    if (searchTerm) {
        runtimeParams.q = searchTerm;
    }
    return runtimeParams;
  }, [filters, searchTerm, page]);

  const { data: searchResponse, isLoading: carsLoading, isError: carsError } = useGetApiCarsSearch(apiSearchParams, { query: { placeholderData: keepPreviousData } });

  const totalCount = searchResponse?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [page]);

  return (
    <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('title')}</h1>
        <p className="text-lg sm:text-xl text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="xl:w-80 flex-shrink-0">
          {!filtersLoading && !filtersError && (
            <CarFilter
              filters={filters}
              onFiltersChange={handleFilterChange}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              serverBrands={serverBrands}
              serverBrandModels={serverBrandModels}
              serverBodyTypes={serverBodyTypes}
              serverShowrooms={serverShowrooms.map(s => ({
                ...s,
                name: s.name ?? undefined
              }))}
              serverSteeringPositions={serverSteeringPositions}
              serverFuelTypes={serverFuelTypes}
              serverTransmissionTypes={serverTransmissionTypes}
            />
          )}
        </div>

        <div className="flex-1">
          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full">Total Results: {totalCount}</div>
          </div>

          {carsLoading ? (
            <div className="p-6 text-sm text-slate-500">Loading cars...</div>
          ) : carsError ? (
            <div className="p-6 text-sm text-red-500">Failed to load cars</div>
          ) : totalCount > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {searchResponse?.items?.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing {(page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, totalCount)} of {totalCount}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className={`px-3 py-1 rounded-md border ${page <= 1 ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                  >
                    Prev
                  </button>
                  <div className="text-sm text-slate-700">Page {page} of {totalPages}</div>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className={`px-3 py-1 rounded-md border ${page >= totalPages ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No cars found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarInventory;
