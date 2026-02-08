import React from "react";

export default function SignupHeader() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
      
      <div className="flex flex-row items-center justify-center mt-10 mb-8">
        
        <img 
          src="/sentry-logo.png" 
          alt="Sentry Logo" 
          className="w-14 h-14 object-contain mr-4" 
        />

        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            Sentry<span className="text-blue-600">.</span>
          </h2> 
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
            Asset Guardian
          </p>
        </div>

      </div>
      <p className="text-center text-sm text-slate-600">
        Buat akun baru untuk memulai monitoring
      </p>
    </div>
  );
}