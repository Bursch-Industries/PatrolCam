'use client';
import User from "@/lib/model/User";
import { SaveButton } from "./my-org-content";
import { UserData } from "@/components/user-data";

export default function MyOrg(){
    return (
        <div className="flex min-h-screen base-background">
  {/* Sidebar */}
  <aside className="w-64 base-background p-6 shadow-md">
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    <div className="space-y-4">
      <button className="w-full text-left p-3  base-background">Organization Info</button>
      <hr className="my-2" />
      <button className="w-full text-left p-3 hover:bg-blue-50 rounded-lg">Cameras</button>
      <hr className="my-2" />
      <button className="w-full text-left p-3 hover:bg-blue-50 rounded-lg">Officers</button>
      <hr className="my-2" />
      <button className="w-full text-left p-3 hover:bg-blue-50 rounded-lg">Privacy</button>
      <hr className="my-2" />
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-8">
    {/* Organization Info Tab */}
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Organization</h1>
        <UserData />
      </div>

      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Organization Info</h2>
        <button className="text-blue-600 hover:text-blue-800">✎</button>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Organization Name:</label>
            <input className="w-full p-2 border rounded-md" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address:</label>
            <input className="w-full p-2 border rounded-md" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number:</label>
            <input className="w-full p-2 border rounded-md" disabled />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address:</label>
            <input className="w-full p-2 border rounded-md" disabled />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City:</label>
              <input className="w-full p-2 border rounded-md" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State:</label>
              <input className="w-full p-2 border rounded-md" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zip Code:</label>
              <input className="w-full p-2 border rounded-md" disabled />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subscription:</label>
            <select className="w-full p-2 border rounded-md" disabled>
              <option>Premium</option>
              <option>Gold</option>
              <option>Silver</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
        <SaveButton />
      </div> */}
    </section>

    {/* Cameras Tab */}
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">Cameras</h2>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((camera) => (
          <div key={camera} className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Officers Tab */}
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
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
    <section className="bg-white rounded-lg shadow-md p-6">
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

