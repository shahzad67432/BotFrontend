"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { HeaderPage } from "../Header";

const jwt = localStorage.getItem("auth_token");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <body>
            <HeaderPage />
          {children}

      </body>
  );
}




// // <div className="flex justify-center items-center w-full">
//           <div className="flex justify-between px-6 w-full mx-[20%] py-2 items-center border rounded-full border-[#e086f8] mt-6">
//             <Image onClick={()=>{window.location.href = '/';}} src="/logo.png" alt="Logo" width={40} height={40} />
//             <div className="flex text-center items-center">
//               <div>
//                 {jwt ? (
//                   <button onClick={() => {localStorage.removeItem("auth_token"); window.location.href = '/login';}} className="">Logout</button>
//                 ) : (
//                   <button onClick={() => {window.location.href = '/login'}}>Login</button>
//                 )}
//               </div>
//               <button className="py-0.5 px-3 border bg-[#ecbbf9] border-[#e086f8] ml-4 mr-2 rounded-full text-[#cc39f5] text-center flex items-center gap-2" onClick={() => {window.location.href = '/docs'}}>Learn <ArrowRight width={16} height={16} /> </button>
//             </div>
//           </div>
//         </div>