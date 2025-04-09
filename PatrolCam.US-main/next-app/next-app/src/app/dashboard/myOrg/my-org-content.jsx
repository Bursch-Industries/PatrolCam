// src/components/my-org-content.jsx
'use client';
import { useState, useEffect, use } from 'react';
import { Button } from "@/components/ui/button";
import { Edit as EditIcon } from 'lucide-react';
import { Building2, Mail, Phone, MapPin, Settings, Building, Camera, Users, Shield } from "lucide-react"
import { EditCameraModal} from  "./edit-camera"; // Adjust the import path as needed
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


export function SaveButton() {
  return (
    <div>
      <Button onClick={() => console.log('Clicked')}>Click me</Button>
    </div>
  );
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
      cams.map((camera) => (camera._id === updatedCamera._id ? updatedCamera : camera))
    );
    setEditingCamera(null); // Close the edit modal after updating
  };

  // Function to handle camera addition
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
        <Button className="text-blue-200 hover:text-blue-200" onClick={() => console.log('Add Camera')}>
          <EditIcon className="mr-2" /> Add Camera
        </Button>
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
                {/* Placeholder for camera image or video feed */}
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Name: {camera.camera_Name}
                  </h3>
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


/*export function CamerasSection () {
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
    setCameras(cams =>
      cams.map(camera => (camera._id === updatedCamera._id ? updatedCamera : camera)) // this will update the camera in the list 
    );
    setEditingCamera(null); // Close the edit modal after updating
  };

  // Function to handle camera addition
  const handleAdd = (newCamera) => {
    setCameras(cams => [...cams, newCamera]); // Add the new camera to the list
    setAddingCamera(null); // Close the add modal after adding
  };



  // determine skeleton count based on the number of cameras
  const skeletonCount = cameras.length > 0 ? cameras.length : 2; // Show 4 skeletons if no cameras are found
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8" >
      <h2 className="text-xl font-semibold mb-6">Cameras</h2>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Camera List</h3>
        <Button className="text-blue-200 hover:text-blue-200" onClick={() => console.log('Add Camera')}>
          <EditIcon className="mr-2" /> Add Camera
        </Button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
          {editingCamera && (
            <EditCameraModal
              camera={editingCamera}
              onClose={() => setEditingCamera(null)}
              onUpdate={handleUpdate}
            />
          )}
        
        <div className="grid grid-cols-2 gap-6">
          {loading ? (
             // Dynamic skeleton count based on existing cameras
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
                {/* Placeholder for camera image or video feed 
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Name: {camera.camera_Name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Model: {camera.model}
                  </p>
      
                  <p className="text-sm">
                    Status:{' '}
                    <span
                      className={
                        camera.status === 'Online'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {camera.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {camera.location}
                  </p>
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
            <div className="col-span-2 text-center text-gray-500">
              No cameras found.
            </div>
          )}
        </div>
    </section>
  );
};*/

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

export function Sidebar() {
  const [activeSection, setActiveSection] = useState("organization")

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)

    // Find the element to scroll to
    const element = document.getElementById(sectionId)
    if (element) {
      // Smooth scroll to the element
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <aside className="w-64 bg-blue-300 shadow-md p-6 rounded-lg sticky top-10 left-3 self-start">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="h-5 w-5 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-left py-3 px-4 rounded-lg ${
            activeSection === "organization"
              ? "bg-blue-100 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-blue-100"
          }`}
          onClick={() => scrollToSection("organization")}
        >
          <Building className="h-5 w-5" />
          Organization Info
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-left py-3 px-4 rounded-lg ${
            activeSection === "cameras" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-blue-100"
          }`}
          onClick={() => scrollToSection("cameras")}
        >
          <Camera className="h-5 w-5" />
          Cameras
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-left py-3 px-4 rounded-lg ${
            activeSection === "officers" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-blue-100"
          }`}
          onClick={() => scrollToSection("officers")}
        >
          <Users className="h-5 w-5" />
          Officers
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-left py-3 px-4 rounded-lg ${
            activeSection === "privacy" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-blue-100"
          }`}
          onClick={() => scrollToSection("privacy")}
        >
          <Shield className="h-5 w-5" />
          Privacy
        </Button>
      </div>
    </aside>
  )
}

