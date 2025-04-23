// components/OfficersSection.jsx
import React from 'react';
import Link from 'next/link';
import { LucideEye } from 'lucide-react';

export default function OfficersSection({ officers = [] }) {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Active Officers</h2>
        <Link href="dashboard/myOrg#officers" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          View all
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right h-4 w-4 ml-1"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* Officer Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {officers.map((officer) => (
          <div
            key={officer._id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {officer.initials}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{officer.name}</p>
                <p className="text-xs text-gray-500">{officer.lastActive}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
                {officer.role}
              </span>
              <button
                onClick={officer.onView}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <LucideEye className="h-3 w-3 mr-1" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
