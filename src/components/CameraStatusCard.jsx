// components/CameraStatusCard.jsx
'use client';

import Link from 'next/link';

export default function CameraStatusCard({
  title = 'Camera Status',
  linkHref = '/cameras',
  linkText = 'View all',
  percentage = 75,
  onlineCount = 18,
  offlineCount = 6,
  size = 40,            // circle diameter in Tailwind spacing (w-40 ≡ 10rem)
  strokeWidth = 10,     // same as SVG stroke‑width
  bgStroke = '#e5e7eb', // light gray
  fgStroke = '#3b82f6'  // Tailwind blue-500
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage / 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <Link href={linkHref} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          {linkText}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      <div className="h-64 relative">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className={`relative w-${size} h-${size}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={bgStroke}
                strokeWidth={strokeWidth}
              />
              <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={fgStroke}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 50 50)"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-gray-800">{percentage}%</p>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>

          <div className="w-full mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Online ({onlineCount})</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-gray-300 mr-2" />
              <span className="text-sm text-gray-600">Offline ({offlineCount})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
