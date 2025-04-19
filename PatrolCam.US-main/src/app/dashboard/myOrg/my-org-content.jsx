// src/components/my-org-content.jsx
'use client';
import { useState, useEffect, use } from 'react';
import { Button, Input, Badge } from "@/components/ui/button";
import { Building2, Mail, Phone, MapPin, Settings, Building, Camera, Users, Shield, Search, UserPlus, Edit as EditIcon } from "lucide-react"
import { EditCameraModal} from  "./edit-camera"; // Adjust the import path as needed;
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function Sidebar() {
  const [activeSection, setActiveSection] = useState("organization");

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);

    // Find the element to scroll to
    const element = document.getElementById(sectionId);
    if (element) {
      // Smooth scroll to the element
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <aside className="w-64 bg-blue-300 shadow-md p-6 rounded-lg sticky top-10 left-3 self-start">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="h-5 w-5 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-left py-3 px-4 rounded-lg transition-transform transform ${
            activeSection === "organization"
              ? "bg-blue-200 text-blue-700 font-medium scale-105"
              : "text-gray-700 hover:bg-blue-100 hover:scale-105"
          }`}
          onClick={() => scrollToSection("organization")}
        >
          <Building className="h-5 w-5" />
          Organization Info
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-left py-3 px-4 rounded-lg transition-transform transform ${
            activeSection === "cameras"
              ? "bg-blue-200 text-blue-700 font-medium scale-105"
              : "text-gray-700 hover:bg-blue-100 hover:scale-105"
          }`}
          onClick={() => scrollToSection("cameras")}
        >
          <Camera className="h-5 w-5" />
          Cameras
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-left py-3 px-4 rounded-lg transition-transform transform ${
            activeSection === "officers"
              ? "bg-blue-200 text-blue-700 font-medium scale-105"
              : "text-gray-700 hover:bg-blue-100 hover:scale-105"
          }`}
          onClick={() => scrollToSection("officers")}
        >
          <Users className="h-5 w-5" />
          Officers
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-left py-3 px-4 rounded-lg transition-transform transform ${
            activeSection === "privacy"
              ? "bg-blue-200 text-blue-700 font-medium scale-105"
              : "text-gray-700 hover:bg-blue-100 hover:scale-105"
          }`}
          onClick={() => scrollToSection("privacy")}
        >
          <Shield className="h-5 w-5" />
          Privacy
        </Button>
      </div>
    </aside>
  );
}

export function OrganizationSection() {
  const [organization, setOrganization] = useState(null); // Initialize organization as null
  const [loading, setLoading] = useState(true); // Initialize loading as true
  const [error, setError] = useState(null); // Initialize error as null

  // Function to handle organization fetching
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await fetch('/api/auth/myOrgAPI', { credentials: 'include' }); // fetching from the API endpoint
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch organization details');
        }
        const data = await res.json();
        setOrganization(data.organization); // Assuming the API returns an organization object in the response data
        setError(null); // Reset error state on successful fetch
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch completes (success or failure)
      }
    };

    fetchOrganization(); // Call the fetch function when the component mounts
  }, []);
  return (
    <div className="container mx-auto p-4">
      {loading ? (
        // Loading state with multiple skeleton elements for a more realistic loading appearance
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </section>
      ) : error ? (
        // Error state with a more prominent alert
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Alert variant="destructive" className="border-2">
            <AlertTitle className="text-lg font-semibold">Error Loading Organization</AlertTitle>
            <AlertDescription className="mt-2">{error}</AlertDescription>
          </Alert>
        </section>
      ) : organization ? (
        // Modern organization details section with icons and better spacing
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{organization.organizationName}</h2>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
              Status: {organization.status}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-gray-100 p-2 rounded-full">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-gray-800">{organization.organizationEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 bg-gray-100 p-2 rounded-full">
                <Phone className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-gray-800">{organization.organizationPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <div className="mt-1 bg-gray-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-gray-800">
                  {organization.organizationAddress.Address1}, {organization.organizationAddress.City},{" "}
                  {organization.organizationAddress.State} {organization.organizationAddress.ZipCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <div className="mt-1 bg-gray-100 p-2 rounded-full">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Organization Details</p>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    This organization has been registered in our system and is currently{" "}
                    {organization.status.toUpperCase()}. For more details or to update this information, please contact
                    the administrator.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // Improved empty state
        <section className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No Organization Details</h3>
          <p className="text-gray-500 mt-2">No organization information is currently available.</p>
        </section>
      )}
    </div>
  )
}

export function CamerasSection() {
  const [cameras, setCameras] = useState([]); // Initialize cameras as an empty array
  const [loading, setLoading] = useState(true); // Initialize loading as true
  const [error, setError] = useState(null); // Initialize error as null
  const [editingCamera, setEditingCamera] = useState(null); // State to manage the camera being edited
  const [addingCamera, setAddingCamera] = useState(null); // State to manage the camera being added

  // Function to handle camera fetching
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await fetch('/api/auth/camerasAPI', { credentials: 'include' }); // fetching from the API endpoint
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch cameras');
        }
        const data = await res.json();
        setCameras(data.cameras); // Assuming the API returns an array of cameras in the response data
        setError(null); // Reset error state on successful fetch
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch completes (success or failure)
      }
    };

    fetchCameras(); // Call the fetch function when the component mounts
  }, []);

  // Function to handle camera update
  const handleUpdate = (updatedCamera) => {
    setCameras((cams) =>
      cams.map((camera) => (camera.id === updatedCamera.id ? updatedCamera : camera))
    );
    setEditingCamera(null); // Close the edit modal after updating
  };

  // Function to handle camera addition // TODO: Implement this function to add a new camera
  const handleAdd = (newCamera) => {
    setCameras((cams) => [...cams, newCamera]);
    setAddingCamera(null); // Close the add modal after adding
  };

  // determine skeleton count based on the number of cameras
  const skeletonCount = cameras.length > 0 ? cameras.length : 2;

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">Cameras</h2>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Camera List</h3>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => console.log("Add Camera")}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Camera
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {editingCamera && (
        <EditCameraModal
          camera={editingCamera}
          onClose={() => setEditingCamera(null)}
          onUpdate={handleUpdate}
        />
      )}
      {/* Scrollable container for the camera list */}
      <div className="overflow-y-auto max-h-[400px]">
        <div className="grid grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={`skeleton-${index}`} className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 animate-pulse w-2/3" />
                </div>
              </div>
            ))
          ) : cameras.length > 0 ? (
            cameras.map((camera) => (
              <div key={camera.id} className="border rounded-lg overflow-hidden">
                {/* Camera image or placeholder */}
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {camera.image ? (
                    <img src={camera.image} alt={camera.camera_Name} className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Name: {camera.camera_Name}
                  </h3>
                  <p className="text-sm text-gray-600">Serial Number: {camera.id}</p>
                  <p className="text-sm text-gray-600">Model: {camera.model}</p>
                  <p className="text-sm">
                    Status:{' '}
                    <span className={camera.status === 'Online' ? 'text-green-600' : 'text-red-600'}>
                      {camera.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">Location: {camera.location}</p>
                  <Button
                    onClick={() => setEditingCamera(camera)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <EditIcon className="mr-2" />
                    Edit Camera
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500">No cameras found.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export function OfficerSection() {
  const [officers, setOfficers] = useState([]); // Initialize officers as an empty array
  const [loading, setLoading] = useState(true); // Initialize loading as true
  const [error, setError] = useState(null); // Initialize error as null
  const [searchTerm, setSearchTerm] = useState(""); // State to manage the search term

  // Filter officers based on the search term
  const filteredOfficers = officers.filter((officer) =>
    officer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to determine status color
  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-500' : 'bg-red-500';
  };

  // Fetch officers from the API
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await fetch('/api/auth/officersAPI', { credentials: 'include' }); // Fetching from the API endpoint
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch officers');
        }
        const data = await res.json();
        setOfficers(data.officers); // Assuming the API returns an array of officers in the response data
        setError(null); // Reset error state on successful fetch
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch completes (success or failure)
      }
    };

    fetchOfficers(); // Call the fetch function when the component mounts
  }, []);

  // Determine skeleton count based on the number of officers
  const skeletonCount = officers.length > 0 ? officers.length : 2;

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Section Title */}
      <h2 className="text-xl font-semibold mb-6">Officers</h2>

      {/* Search and Add Officer Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search officers..."
            className="w-full px-8 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Officer Button */}
        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => console.log("Add Officer")}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add Officer
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Officer List */}
      <div className="overflow-y-auto max-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            // Skeleton Loading State
            Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={`skeleton-${index}`} className="border rounded-lg overflow-hidden">
                <div className="h-24 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 animate-pulse w-2/3" />
                </div>
              </div>
            ))
          ) : filteredOfficers.length > 0 ? (
            // Render Officer Cards
            filteredOfficers.map((officer) => (
              <div
                key={officer._id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Officer Avatar */}
                <div className="bg-gray-100 p-4 flex items-center justify-center">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(
                        officer.status
                      )} border-2 border-white`}
                    />
                  </div>
                </div>

                {/* Officer Details */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-center mb-2">
                    {officer.firstname} {officer.lastname}
                  </h3>
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
                      {officer.roles || "No Role"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No Officers Found
            <div className="col-span-full text-center text-gray-500 py-8">
              No officers found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}



