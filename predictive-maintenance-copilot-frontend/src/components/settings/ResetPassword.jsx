import React from "react";

export default function ResetPassword({ email, onEmailChange, onReset }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md border">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      <div className="space-y-5 mt-3">
        <p className="text-sm text-gray-500">Email</p>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="border p-3 rounded-xl w-full text-sm"
        />

        <button
          onClick={onReset}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg 
                     hover:bg-blue-700 transition-all duration-200 hover:scale-[1.03] active:scale-95"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}