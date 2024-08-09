"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function page() {
  const Route = useRouter();
  const HandleAdminLogOut = () => {
    Cookies.remove("email");
  Route.push("/login");
  };
  return (
    <>
      <button
        onClick={HandleAdminLogOut}
        className="text-white  font-semibold bg-blue-500 px-2 py-2 rounded-xl absolute top-[30%] left-1/2 translate-x-[-50%] translate-y-[-30%]"
      >
        Logout
      </button>
    </>
  );
}
