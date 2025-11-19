import { getUserMessages } from "@/actions";
import Home from "@/components/homePage";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

const page = () => {


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
};

export default page;