"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";

function generateBreadcrumbs(pathname: string) {
  // Remove locale prefix if present
  const pathWithoutLocale = pathname.replace(
    new RegExp(`^/${routing.locales.join("|")}`),
    ""
  );
  const paths = pathWithoutLocale.split("/").filter(Boolean);

  return paths.map((path, index) => ({
    href: "/" + paths.slice(0, index + 1).join("/"),
    label: path.charAt(0).toUpperCase() + path.slice(1),
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* <Toaster richColors></Toaster> */}
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {generateBreadcrumbs(usePathname()).map((item, index, arr) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className="hidden md:block">
                      <Link href={item.href}>
                        {item.label}
                      </Link>
                    </BreadcrumbItem>
                    {index < arr.length - 1 && (
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle className="mr-4" />
        </header>
        <div className="p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
