'use client';

export default function StatsCard({
  icon,
  label,
  value,
  iconBg = 'bg-blue-200',
  iconText = 'text-blue-700',
}) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-4 flex items-center">
      <div className={`${iconBg} ${iconText} p-4 rounded-full mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className="flex items-center">
          <h3 className="text-xl font-bold text-gray-800 mr-2">{value}</h3>
        </div>
      </div>
    </div>
  );
}
