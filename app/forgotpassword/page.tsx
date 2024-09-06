"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ForgotPassword() {
  const [pass, setPass] = useState("");
  const [newpass, setNewpass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  const handleButton = async () => {
    try {
      const response = await axios.post("/api/users/forgotpassword", {
        pass,
        newpass,
      });
      console.log(response.data.msg);
      alert("Reset successfull");
      router.push("/login");
    } catch (error: any) {
      alert("Error:enter correct password ");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center items-center">
        <div className="relative w-full max-w-xs">
          <input
            className="border-2 border-black p-2 m-1 rounded w-full"
            type={showPassword ? "text" : "password"}
            placeholder="enter password"
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <button
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2  text-black rounded px-2 py-1"
          >
            {showPassword ? "Hide" : "See"}
          </button>
        </div>
        <div className="relative w-full max-w-xs">
          <input
            className="border-2 border-black p-2 m-1 rounded w-full"
            type={showRePassword ? "text" : "password"}
            placeholder="enter password again"
            onChange={(e) => {
              setNewpass(e.target.value);
            }}
          />
          <button
            onClick={toggleRePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2  text-black rounded px-2 py-1"
          >
            {showRePassword ? "Hide" : "See"}
          </button>
        </div>
        <button
          className="m-1 p-2 bg-blue-400 text-white rounded w-auto"
          onClick={handleButton}
        >
          Reset password
        </button>
      </div>
    </div>
  );
}
