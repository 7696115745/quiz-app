"use client";
import { FormEvent,useEffect } from "react";
import { doLogout } from "../action/index";
 

const LogoutForm: React.FC = () => {
   

  const handleSocialLogout = async (event: FormEvent, action: string) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set('action', action);

    await doLogout(formData);
  };
 


  return (
    <>
      <button onClick={(event) => handleSocialLogout(event, 'google')} className="text-white  font-semibold bg-blue-500 px-2 py-2 rounded-xl absolute top-[30%] left-1/2 translate-x-[-50%] translate-y-[-30%]">Logout</button>
    </>
  );
};

export default LogoutForm;
