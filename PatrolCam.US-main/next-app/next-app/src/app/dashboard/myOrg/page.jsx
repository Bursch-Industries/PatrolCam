'use client';
import { CameraEdit, SaveButton } from "./my-org-content";
import { UserData } from "@/components/user-data";
import { CamerasSection, OrganizationSection, Sidebar } from "./my-org-content";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export default function MyOrg(){
    return (
        <div className="flex min-h-screen base-background">
  {/* Sidebar */}
  <Sidebar />

  {/* Header */}

  {/* Main Content */}
  <main className="flex-1 p-8">
    {/* Organization Info Tab */}
      <section id="organization" className="bg-white rounded-lg shadow-lg p-5 mb-8">
        <OrganizationSection />
      </section>

      {/* Cameras Tab */}
    <section id="cameras">
      <CamerasSection />
    </section>


    {/* Officers Tab */}
    <section id="officers" className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Officers</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Add</button>
      </div>
      <div className="space-y-4">
        {[1, 2].map((officer) => (
          <div key={officer} className="border rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 w-1/4 mb-2" />
            <div className="h-4 bg-gray-200 w-1/2" />
          </div>
        ))}
      </div>
    </section>

    {/* Privacy Tab */}
    <section id="privacy" className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Privacy</h2>
      <div className="space-y-4">
        <p className="p-3 hover:bg-gray-50 rounded-md cursor-pointer">Change Password</p>
        <p className="p-3 hover:bg-gray-50 rounded-md cursor-pointer">Two Factor Authentication (2FA)</p>
        <p className="p-3 hover:bg-gray-50 rounded-md cursor-pointer">Last Login</p>
        <div className="h-32 bg-gray-100 rounded-md animate-pulse" />
      </div>
    </section>
  </main>
</div>
        
    );

}

