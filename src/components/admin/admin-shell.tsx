"use client";

import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AdminSidebar } from "./admin-sidebar";

interface AdminShellProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function AdminShell({ title, description, actions, children }: AdminShellProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="md:hidden" />
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
            <span>
              <PanelLeft className="size-4" />
            </span>
          </Button>
          <Separator orientation="vertical" className="mr-2 hidden h-4 md:block" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">{title}</h1>
            {description ? <p className="truncate text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
        <div className="flex flex-1 flex-col gap-6 bg-muted/20 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
