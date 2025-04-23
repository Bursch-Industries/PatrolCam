'use client';
import { CameraEdit, SaveButton } from "./my-org-content";
import { UserData } from "@/components/user-data";
import { CamerasSection, OrganizationSection, Sidebar, OfficerSection } from "./my-org-content";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export default function MyOrg(){
    return (
        <div className="flex min-h-screen bg-blue-200">
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
       <OfficerSection />
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

