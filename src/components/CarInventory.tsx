import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterOptions } from '../types';
import CarCard from './CarCard';
import CarFilter from './CarFilter';
import { Search } from 'lucide-react';
import { useGetApiCarsSearch, useGetApiCarsFilters, Status } from '../services/api';
import type { GetApiCarsSearchParams } from '../services/api';
import type { Fuel, Transmission } from '../services/api';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData } from '@tanstack/react-query';

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_FILTERS: FilterOptions = {
  brand: '',
  model: '',
  priceRange: [0, 5000], // units: Lakhs
  yearRange: [1980, CURRENT_YEAR + 1],
  mileageRange: [0, 200000],
  fuelTypes: [],
  transmissions: [],
  bodyTypes: [],
  status: []
};

const CarInventory: React.FC = () => {
  const { t } = useTranslation('cars');

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'year-new' | 'year-old' | 'mileage-low'>('price-low');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [page, setPage] = useState<number>(1);
  const LIMIT = 9;

  // Fetch filter metadata from the API
  const { data: filterData, isLoading: filtersLoading, isError: filtersError } = useGetApiCarsFilters();
  const serverBrands = filterData?.brandsWithModels ? Object.keys(filterData.brandsWithModels) : undefined;
  const serverBrandModels = filterData?.brandsWithModels ?? undefined;

  // Helpers: parse & serialize URL search params
  const parseFiltersFromSearchParams = (sp: URLSearchParams): { filters: FilterOptions; search: string; page?: number } => {
    const brand = sp.get('brand') ?? '';
    const model = sp.get('model') ?? '';
    const priceMin = sp.get('priceMin');
    const priceMax = sp.get('priceMax');
    const yearMin = sp.get('yearMin');
    const yearMax = sp.get('yearMax');
    const fuel = sp.get('fuel') ?? '';
    const transmission = sp.get('transmission') ?? '';
    const status = sp.get('status') ?? ''; // comma separated
    const search = sp.get('q') ?? '';
    const pageParam = sp.get('page');

    const parsed: FilterOptions = {
      brand,
      model,
      priceRange: [
        priceMin ? parseInt(priceMin, 10) : DEFAULT_FILTERS.priceRange[0],
        priceMax ? parseInt(priceMax, 10) : DEFAULT_FILTERS.priceRange[1]
      ],
      yearRange: [
        yearMin ? parseInt(yearMin, 10) : DEFAULT_FILTERS.yearRange[0],
        yearMax ? parseInt(yearMax, 10) : DEFAULT_FILTERS.yearRange[1]
      ],
      mileageRange: DEFAULT_FILTERS.mileageRange,
      fuelTypes: fuel ? [fuel] : [],
      transmissions: transmission ? [transmission] : [],
      bodyTypes: DEFAULT_FILTERS.bodyTypes,
      status: status ? status.split(',').filter(Boolean) as Array<'available' | 'sold' | 'reserved'> : []
    };

    return { filters: parsed, search, page: pageParam ? parseInt(pageParam, 10) : 1 };
  };

  const serializeFiltersToParams = (f: FilterOptions, q: string, p?: number) => {
    const params: Record<string, string> = {};
    if (f.brand) params.brand = f.brand;
    if (f.model) params.model = f.model;
    if (f.priceRange && (f.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] || f.priceRange[1] !== DEFAULT_FILTERS.priceRange[1])) {
      params.priceMin = String(f.priceRange[0]);
      params.priceMax = String(f.priceRange[1]);
    }
    if (f.yearRange && (f.yearRange[0] !== DEFAULT_FILTERS.yearRange[0] || f.yearRange[1] !== DEFAULT_FILTERS.yearRange[1])) {
      params.yearMin = String(f.yearRange[0]);
      params.yearMax = String(f.yearRange[1]);
    }
    if (f.fuelTypes && f.fuelTypes.length > 0) params.fuel = String(f.fuelTypes[0]);
    if (f.transmissions && f.transmissions.length > 0) params.transmission = String(f.transmissions[0]);
    if (f.status && f.status.length > 0) params.status = f.status.join(',');
    if (q) params.q = q;
    // always include page (default 1)
    params.page = String(p ?? 1);
    return params;
  };

  // Sync URL -> state on mount and when search params change (handles back/forward)
  useEffect(() => {
    const { filters: parsedFilters, search, page: parsedPage } = parseFiltersFromSearchParams(searchParams);

    // shallow compare filters to avoid unnecessary state updates
    const filtersEqual = (a: FilterOptions, b: FilterOptions) => {
      if (a.brand !== b.brand) return false;
      if (a.model !== b.model) return false;
      if (a.priceRange[0] !== b.priceRange[0] || a.priceRange[1] !== b.priceRange[1]) return false;
      if (a.yearRange[0] !== b.yearRange[0] || a.yearRange[1] !== b.yearRange[1]) return false;
      if ((a.fuelTypes[0] ?? '') !== (b.fuelTypes[0] ?? '')) return false;
      if ((a.transmissions[0] ?? '') !== (b.transmissions[0] ?? '')) return false;
      if ((a.status ?? []).join(',') !== (b.status ?? []).join(',')) return false;
      return true;
    };

    if (!filtersEqual(parsedFilters, filters)) {
      setFilters(parsedFilters);
    }
    if (search !== searchTerm) {
      setSearchTerm(search);
    }
    if (parsedPage !== undefined && parsedPage !== page) {
      setPage(parsedPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // When local filters/searchTerm/page change, update URL search params
  useEffect(() => {
    const params = serializeFiltersToParams(filters, searchTerm, page);
    setSearchParams(params);
    // We intentionally only depend on filters, searchTerm and page here.
  }, [filters, searchTerm, page, setSearchParams]);

  // Build search params for API from filters and search term

  // reset to first page when filters or search term change
  useEffect(() => {
    setPage(1);
  }, [filters, searchTerm]);

  const apiSearchParams = useMemo((): GetApiCarsSearchParams => {
    const params: GetApiCarsSearchParams = {};
    if (filters.model) params.model = filters.model;
    if (filters.brand) params.brand = filters.brand;
    if (filters.priceRange) {
      params.priceMin = filters.priceRange[0];
      params.priceMax = filters.priceRange[1];
    }
    if (filters.yearRange) {
      params.yearMin = filters.yearRange[0];
      params.yearMax = filters.yearRange[1];
    }
    if (filters.fuelTypes && filters.fuelTypes.length > 0) params.fuel = filters.fuelTypes[0] as unknown as Fuel;
    if (filters.transmissions && filters.transmissions.length > 0) params.transmission = filters.transmissions[0] as unknown as Transmission;
    if (searchTerm) {
      params.model = params.model || searchTerm;
      params.brand = params.brand || searchTerm;
    }
    params.page = page;
    params.limit = LIMIT;
    return params;
  }, [filters, searchTerm, page]);

  const { data: searchResponse, isLoading: carsLoading, isError: carsError } = useGetApiCarsSearch(apiSearchParams, { query: { placeholderData: keepPreviousData } });

  const availableCars = searchResponse?.items?.filter(car => car.status === Status.Available);
  const soldCars = searchResponse?.items?.filter(car => car.status === Status.Sold);
  const totalCount = searchResponse?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  // clamp page if API returns fewer pages
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('title')}</h1>
        <p className="text-xl text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          {filtersLoading ? (
            <div className="p-4 text-sm text-slate-500">Loading filters...</div>
          ) : filtersError ? (
            <div className="p-4 text-sm text-red-500">Failed to load filters</div>
          ) : (
            <CarFilter
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              serverBrands={serverBrands}
              serverBrandModels={serverBrandModels}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price-low' | 'price-high' | 'year-new' | 'year-old' | 'mileage-low')}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest First</option>
              <option value="year-old">Year: Oldest First</option>
              <option value="mileage-low">Mileage: Low to High</option>
            </select>
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full">Available: {availableCars?.length}</div>
            <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full">Sold: {soldCars?.length}</div>
            <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full">Total Results: {totalCount}</div>
          </div>

          {/* Car Grid */}
          {carsLoading ? (
            <div className="p-6 text-sm text-slate-500">Loading cars...</div>
          ) : carsError ? (
            <div className="p-6 text-sm text-red-500">Failed to load cars</div>
          ) : searchResponse?.total && searchResponse.total > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {searchResponse?.items?.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing {(page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, totalCount)} of {totalCount}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newPage = Math.max(1, page - 1);
                      setPage(newPage);
                    }}
                    disabled={page <= 1}
                    className={`px-3 py-1 rounded-md border ${page <= 1 ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                  >
                    Prev
                  </button>
                  <div className="text-sm text-slate-700">Page {page} of {totalPages}</div>
                  <button
                    onClick={() => {
                      const newPage = Math.min(totalPages, page + 1);
                      setPage(newPage);
                    }}
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
              <p className="text-slate-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarInventory;
