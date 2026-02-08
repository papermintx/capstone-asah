import React from "react";
import useLogin from "../hooks/auth/useLogin";
import LoginHeader from "../components/auth/LoginHeader";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  const {
    form,
    error,
    isLoading,
    showPassword,
    setShowPassword,
    handleChange,
    handleLogin,
  } = useLogin();

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-6 py-12 lg:px-8">
      
      <LoginHeader />
      
      <LoginForm
        form={form}
        error={error}
        isLoading={isLoading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onChange={handleChange}
        onSubmit={handleLogin}
      />

    </div>
  );
}