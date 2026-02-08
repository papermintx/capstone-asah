import React from "react";

export default function SettingsProfile({ fullName, email }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md border">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      <div className="space-y-6">
        {/* FULL NAME */}
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <div className="mt-1 p-3 rounded-xl w-full bg-gray-100 text-gray-800 border">
            {fullName}
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <div className="mt-1 p-3 rounded-xl w-full bg-gray-100 text-gray-800 border">
            {email}
          </div>
        </div>
      </div>
    </div>
  );
}