"use client";

import { FormEvent } from "react";
 import { FcGoogle } from "react-icons/fc";
import { doSocialLogin } from "../action/index";

export default function LogedinButtons() {
  const handleLogin = async (provider: string, event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('action', provider);
    await doSocialLogin(formData);
  };

  return (
    <> 
      
      <div 
        className="button google-set flex items-center bg-blue-800 gap-7 justify-center py-2  rounded-md text-white cursor-pointer  w-full my-3 font-semibold" 
        onClick={(event) => handleLogin('google', event)}
      >
        <FcGoogle size={30} />
        Login with google
      </div>
    </>
  );
}
