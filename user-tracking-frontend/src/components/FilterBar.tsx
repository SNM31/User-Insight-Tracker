// src/components/FilterBar.tsx

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define the shape of the filters state
interface MetricsFilterRequest {
  startDate: string;
  endDate: string;
  country: string | null;
  deviceType: string | null;
  userId: number | null;
}

// Define the component's props
interface FilterBarProps {
  userRole: string;
  currentFilters: MetricsFilterRequest;
  onFilterChange: (newFilters: MetricsFilterRequest) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ userRole, currentFilters, onFilterChange }) => {
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onFilterChange({
      ...currentFilters,
      startDate: start ? start.toISOString().split('T')[0] : '',
      endDate: end ? end.toISOString().split('T')[0] : '',
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    let nextValue: string | number | null = value || null;
    if (name === 'userId') {
      if (!value) {
        nextValue = null;
      } else {
        const parsed = Number(value);
        nextValue = Number.isFinite(parsed) ? parsed : null;
      }
    }
    onFilterChange({
      ...currentFilters,
      [name]: nextValue,
    });
  };

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Filters</p>
          <p className="mt-1 text-sm text-slate-300">Tune the dashboard view without leaving the workspace.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">Date Range</label>
        <DatePicker
          selectsRange={true}
          startDate={new Date(currentFilters.startDate)}
          endDate={new Date(currentFilters.endDate)}
          onChange={handleDateChange}
          className="w-full md:w-64 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">Country</label>
        <select
          name="country"
          value={currentFilters.country || ''}
          onChange={handleFilterChange}
          className="w-full md:w-36 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white"
        >
          <option value="">All</option>
          <option value="USA">USA</option>
          <option value="IND">India</option>
          <option value="GBR">UK</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">Device</label>
        <select
          name="deviceType"
          value={currentFilters.deviceType || ''}
          onChange={handleFilterChange}
          className="w-full md:w-36 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white"
        >
          <option value="">All</option>
          <option value="DESKTOP">Desktop</option>
          <option value="MOBILE">Mobile</option>
          <option value="TABLET">Tablet</option>
        </select>
      </div>

      {userRole === 'ROLE_ADMIN' && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">User ID</label>
          <input
            type="text"
            name="userId"
            placeholder="Filter by User ID..."
            value={currentFilters.userId || ''}
            onChange={handleFilterChange}
            className="w-full md:w-48 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white placeholder:text-slate-500"
          />
        </div>
      )}
      </div>
    </div>
  );
};

export default FilterBar;