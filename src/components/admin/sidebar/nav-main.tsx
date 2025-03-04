"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { NavItem } from './app-sidebar';

function renderNavItems(items: NavItem[]) {
  return items.map((item) => (
    <Collapsible
      key={item.title}
      defaultOpen={item.isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} asChild>
            {item.url !== "#" ? (
              <Link href={item.url} className={`flex items-center w-full ${item.isActive ? 'text-primary font-semibold' : ''}`}>
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.title}</span>
                {item.items && item.items.length > 0 && (
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                )}
              </Link>
            ) : (
              <button className={`flex items-center w-full ${item.isActive ? 'text-primary font-semibold' : ''}`}>
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.title}</span>
                {item.items && item.items.length > 0 && (
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                )}
              </button>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {item.items && item.items.length > 0 && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {renderNavItems(item.items)}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  ));
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {renderNavItems(items)}
      </SidebarMenu>
    </SidebarGroup>
  );
}

