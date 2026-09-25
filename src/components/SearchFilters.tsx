"use client";

import React, { useState } from "react";

export const SearchFilters: React.FC<{
    onFilter: (city: string) => void;
}> = ({ onFilter }) => {
    const [city, setCity] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter(city);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4"
            aria-label="Property Search Filters"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                    <label
                        htmlFor="filter-city"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Location
                    </label>

                    <select
                        id="filter-city"
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                        <option value="">All Locations</option>
                        <option value="Austin">Austin, TX</option>
                        <option value="Denver">Denver, CO</option>
                    </select>
                  
                </div>

                <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Apply Filters
                </button>
            </div>
        </form>
    );
};