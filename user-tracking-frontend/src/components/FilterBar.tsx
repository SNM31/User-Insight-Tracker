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
  userId: string | null;
}

// Define the component's props
interface FilterBarProps {
  userRole: string;
  currentFilters: MetricsFilterRequest;
  onFilterChange: (newFilters: MetricsFilterRequest) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ userRole, currentFilters, onFilterChange }) => {

  // --- Handlers for each filter change ---

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
    onFilterChange({
      ...currentFilters,
      [name]: value || null, // Set to null if value is empty string
    });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 items-center">
      
      {/* --- Date Range Filter --- */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Date Range</label>
        <DatePicker
          selectsRange={true}
          startDate={new Date(currentFilters.startDate)}
          endDate={new Date(currentFilters.endDate)}
          onChange={handleDateChange}
          className="w-full md:w-64 border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      {/* --- Country Filter (Example) --- */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
        <select
          name="country"
          value={currentFilters.country || ''}
          onChange={handleFilterChange}
          className="w-full md:w-36 border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="USA">USA</option>
          <option value="IND">India</option>
          <option value="GBR">UK</option>
          {/* Add more countries as needed */}
        </select>
      </div>

      {/* --- Device Filter --- */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Device</label>
        <select
          name="deviceType"
          value={currentFilters.deviceType || ''}
          onChange={handleFilterChange}
          className="w-full md:w-36 border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="DESKTOP">Desktop</option>
          <option value="MOBILE">Mobile</option>
          <option value="TABLET">Tablet</option>
        </select>
      </div>

      {/* --- ADMIN-ONLY: User ID Filter --- */}
      {userRole === 'USER_ADMIN' && (
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
          <input
            type="text"
            name="userId"
            placeholder="Filter by User ID..."
            value={currentFilters.userId || ''}
            onChange={handleFilterChange}
            className="w-full md:w-48 border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      )}

    </div>
  );
};

export default FilterBar;