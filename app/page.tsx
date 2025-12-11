import { getUserMessages } from "@/actions";
import Home from "@/components/homePage";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

const page = () => {


  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <Home />
    </Suspense>
  );
};

export default page;