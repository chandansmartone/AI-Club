"use client";


import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "./SideBar";
// import { Sidebar } from "@/components/sidebar";
// interface MobileSidebarProps{
//   apiLimitCount:number;
//   isPro:boolean
// }
export const MobileSidebar = (
    {
  apiLimitCount = 0,
   isPro = false
}: { apiLimitCount:number;
  isPro:boolean}
) => { 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
       </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SideBar isPro={isPro}apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet> 
  );
};