"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import PerformScanGiveTable from "../perform-and-scan/page";
import Persistance from "../persistance-data/page";
import TargetDevice from "../target-device/page";

export default function Page() {
  const [activeView, setActiveView] = useState("scan-summary");
  const [localIp, setLocalIp] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocalIp = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8001/my-ip/");
        const data = await response.json();
        setLocalIp(data.local_ip);
      } catch (error) {
        console.error("Failed to fetch IP:", error);
      }
    };

    fetchLocalIp();
  }, []);

  const handleItemSelect = (url: string) => {
    setActiveView(url);
  };

  return (
    <SidebarProvider>
      <AppSidebar onItemSelect={handleItemSelect} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {activeView === "scan-summary" && "Scan Summary"}
                    {activeView === "persistance-data" && "Monitor Network"}
                    {activeView === "target-device" && "Target Device"}

                  </BreadcrumbLink>
                </BreadcrumbItem>
                <Separator orientation="vertical" className="h-4" />
                <BreadcrumbLink>
                  Device: {localIp ? localIp : "Loading IP..."}
                </BreadcrumbLink>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {activeView === "scan-summary" && <PerformScanGiveTable />}
            {activeView === "persistance-data" && <Persistance />}
            {activeView === "target-device" && <TargetDevice />}

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
