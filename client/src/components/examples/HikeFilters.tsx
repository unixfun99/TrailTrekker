import HikeFilters from '../HikeFilters';

export default function HikeFiltersExample() {
  return (
    <div className="p-4 max-w-2xl">
      <HikeFilters onFilterChange={(filters) => console.log('Filters:', filters)} />
    </div>
  );
}