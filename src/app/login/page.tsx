"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogedinButtons from "../component/LogedinButtons";
import Cookies from 'js-cookie';
const staticCredentials = {
  email: "rs009161@gmail.com", // Replace with your static email
  password: "wapday"     // Replace with your static password
};

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e:any) => {
    e.preventDefault();
    
    if (email === staticCredentials.email && password === staticCredentials.password) {
      // Redirect to admin page
      Cookies.set('email', email, { expires: 7 }); 
      localStorage.setItem("email",email)
      router.push("/admin");
    } else {
      alert("Invalid email or password");
    }
  };


  return (
    <>
      <div className="signin max-w-md mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Sign In</h1>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md outline-none w-full py-3 px-4 placeholder-gray-500 focus:border-blue-500 transition- placeholder:font-semibold placeholder:text-[17px]"
              placeholder="Enter your Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md outline-none w-full py-3 px-4 placeholder-gray-500 focus:border-blue-500 transition-colors placeholder:font-semibold placeholder:text-[17px]"
              placeholder="Enter your Password"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-[17px] text-white font-semibold rounded-md px-4 py-2 transition-colors hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
          <div className="relative my-4 w-full">
            <div className="border-t border-gray-300">
              <p className="absolute top-[-13px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-gray-600 font-semibold">
                or
              </p>
            </div>
          </div>
          <LogedinButtons />
          <p id="termsAndConditions" className="py-6 text-sm text-gray-600">
            By continuing, you agree to our{" "}
            <Link className="text-blue-600 hover:underline" href="/terms" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </Link>,{" "}
            <Link className="text-blue-600 hover:underline" href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Statement
            </Link>, and{" "}
            <Link className="text-blue-600 hover:underline" href="/rewards/terms" target="_blank" rel="noopener noreferrer">
              Quiz Rewards Terms & Conditions
            </Link>.
          </p>
        </div>
      </div>
    </>
  );
}
