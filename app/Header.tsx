"use cleint"
import { ArrowRight } from "lucide-react";
import Image from "next/image";
const jwt = localStorage.getItem("auth_token");
export const HeaderPage = () => {
    return (
        <>
        <div className="flex justify-center items-center w-full">
               <div className="flex justify-between px-6 w-full mx-[20%] py-2 items-center border rounded-full border-[#e086f8] mt-6">
                 <Image className="cursor-pointer" onClick={()=>{window.location.href = '/';}} src="/logo.png" alt="Logo" width={40} height={40} />
                 <div className="flex text-center items-center">
                    <div className="cursor-pointer underline px-3" onClick={() => {window.location.href = '/documentation'}}>
                        documentation
                    </div>
                   <div>
                     {jwt ? (
                       <button className="cursor-pointer" onClick={() => {localStorage.removeItem("auth_token"); window.location.href = '/login';}} >Logout</button>
                     ) : (
                       <button className="cursor-pointer" onClick={() => {window.location.href = '/login'}}>Login</button>
                     )}
                   </div>
                 </div>
               </div>
             </div>
        </>
    )
}