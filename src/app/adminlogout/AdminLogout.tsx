"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Page() {
  const router = useRouter();

  const handleAdminLogOut = () => {
    Cookies.remove("email");
    // Use `router.push` to navigate to the login page
    router.push("/login");
  };

  // Redirect on component mount if necessary
  useEffect(() => {
    // Check if a certain condition is met (e.g., user is not logged in)
    if (!Cookies.get("email")) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <button
        onClick={handleAdminLogOut}
        className="text-white font-semibold bg-blue-500 px-2 py-2 rounded-xl absolute top-[30%] left-1/2 translate-x-[-50%] translate-y-[-30%]"
      >
        Logout
      </button>
    </>
  );
}
