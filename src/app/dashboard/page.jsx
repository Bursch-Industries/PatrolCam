'use client';
import { LucideCamera, LucideUsers, LucideAlertCircle, LucideMails } from 'lucide-react';
import useCameras from '@/hooks/useCameras';
import CameraStatusCard from '@/components/CameraStatusCard';
import StatsCard from '@/components/StatsCard';
import useOfficers from '@/hooks/useOfficers';
import OfficersSection from '@/components/OfficersSection';

export default function Page() {
  const { cameras, loading: camsLoading, error: camsError } = useCameras();
  const { officers, loading: offsLoading, error: offsError } = useOfficers();

  const loading = camsLoading || offsLoading;
  const error = camsError || offsError;

  const onlineCount = cameras.filter(c => c.status === 'Online').length;
  const offlineCount = cameras.filter(c => c.status === 'Offline').length;
  const totalCameras = cameras.length;

  // prepare officer data with unique id keys
  const officerData = officers.map(officer => ({
    _id: officer._id,
    initials: `${officer.firstname[0]}${officer.lastname[0]}`,
    name: `${officer.firstname} ${officer.lastname}`,
    lastActive: officer.status,  // or map timestamp -> "2 mins ago"
    role: officer.roles || 'Patrol',
    lastActive: officer.lastLoggedIn || 'Just now',
    onView: () => { /* navigate or open modal */ },
  }));

  return (
    <div className="bg-blue-200 min-h-screen container max-w-screen px-4 py-6 flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          [0,1,2,3].map(i => (
            <div key={`stats-skel-${i}`} className="animate-pulse bg-gray-300 h-24 rounded" />
          ))
        ) : (
          <>
            <StatsCard
              icon={<LucideCamera className="w-6 h-6" />}
              label="Total Cameras"
              value={totalCameras}
              iconBg="bg-blue-200"
              iconText="text-blue-700"
            />
            <StatsCard
              icon={<LucideUsers className="w-6 h-6" />}
              label="Total Users"
              value={officers.length}
              iconBg="bg-green-200"
              iconText="text-blue-700"
            />
            <StatsCard
              icon={<LucideAlertCircle className="w-6 h-6" />}
              label="Total Alerts"
              value={0}
              iconBg="bg-red-200"
              iconText="text-blue-700"
            />
            <StatsCard
              icon={<LucideMails className="w-6 h-6" />}
              label="Total Messages"
              value={0}
              iconBg="bg-yellow-200"
              iconText="text-blue-700"
            />
          </>
        )}
      </div>

      {/* Camera Status Card */}
      <div className="mb-6">
        {loading ? (
          <div className="animate-pulse bg-gray-300 h-40 rounded" />
        ) : camsError ? (
          <div className="text-red-600">Failed to load cameras.</div>
        ) : (
          <CameraStatusCard
            title="Camera Status"
            linkHref="dashboard/myOrg#cameras"
            linkText="View all"
            percentage={totalCameras ? (onlineCount / totalCameras) * 100 : 0}
            onlineCount={onlineCount}
            offlineCount={offlineCount}
            size={40}
            strokeWidth={10}
            bgStroke="#e5e7eb"
            fgStroke="#3b82f6"
          />
        )}
      </div>

      {/* Officers Section */}
      <div className="mt-6">
        {loading ? (
          <div className="animate-pulse bg-gray-300 h-8 w-1/3 mb-4 rounded" />
        ) : offsError ? (
          <div className="text-red-600">Failed to load officers.</div>
        ) : officerData.length > 0 ? (
          <OfficersSection officers={officerData} />
        ) : (
          <p>No officers found.</p>
        )}
      </div>
    </div>
  );
}
