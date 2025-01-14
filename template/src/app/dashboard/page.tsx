"use client";

import { useState } from "react";
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

export default function Page() {
  const [activeView, setActiveView] = useState("scan-summary");

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
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {activeView === "scan-summary" && <PerformScanGiveTable />}
            {activeView === "persistance-data" && <Persistance />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
