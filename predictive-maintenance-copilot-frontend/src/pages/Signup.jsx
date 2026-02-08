import React from "react";
import useSignup from "../hooks/auth/useSignup";
import SignupHeader from "../components/auth/SignupHeader";
import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
  const {
    form,
    error,
    isLoading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  } = useSignup();

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-6 py-12 lg:px-8">
      
      <SignupHeader />
      
      <SignupForm
        form={form}
        error={error}
        isLoading={isLoading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

    </div>
  );
}