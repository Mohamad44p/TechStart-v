"use client";

import * as React from "react";
import {
  Layers,
  Radio,
  Home,
  Users,
  Phone,
  SearchCheckIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  items?: NavItem[];
  isActive?: boolean;
}

const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Home Page",
      url: "#",
      icon: Home,
      items: [
        {
          title: "Hero Section",
          url: "/admin/pages/home",
        },
        {
          title: "Stats Counter",
          url: "/admin/pages/stats",
        },
        {
          title: "home Saf Banner",
          url: "/admin/home-banner",
        },
        {
          title: "Footer",
          url: "/admin/pages/footer",
        },
      ],
    },
    {
      title: "About Us",
      url: "#",
      icon: Users,
      items: [
        {
          title: "About Page",
          url: "/admin/pages/about",
        },
        {
          title: "Partners",
          url: "/admin/pages/partners",
        },
        {
          title: "Team Members",
          url: "/admin/pages/team",
        },
        {
          title: "Work With Us",
          url: "/admin/pages/work-with-us",
        },
        {
          title: "Palestinian IT Leads",
          url: "/admin/beneficiaries",
        },
        {
          title: "Focus Areas",
          url: "/admin/pages/focusareas",
        },
      ],
    },
    {
      title: "Programs",
      url: "#",
      icon: Layers,
      items: [
        {
          title: "Programs Tabs",
          url: "/admin/program-tabs",
        },
        {
          title: "Programs Hero",
          url: "/admin/programs-hero",
        },
      ],
    },
    {
      title: "Contact & Support",
      url: "#",
      icon: Phone,
      items: [
        {
          title: "Contact Info",
          url: "/admin/contact-info",
        },
        {
          title: "Contact Submissions",
          url: "/admin/pages/contact-submissions",
        },
        {
          title: "Complaints",
          url: "/admin/complaints",
        },
        {
          title: "FAQ Management",
          url: "/admin/pages/faq",
        },
      ],
    },
    {
      title: "Social and Environmental",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Safeguards",
          url: "/admin/safeguards",
        },
      ],
    },
    {
      title: "Media Center",
      url: "#",
      icon: Radio,
      items: [
        {
          title: "News",
          url: "#",
          items: [
            {
              title: "Create News",
              url: "/admin/blog/create",
            },
            {
              title: "All News",
              url: "/admin/blog",
            },
          ],
        },
        {
          title: "Gallery",
          url: "#",
          items: [
            {
              title: "Images",
              url: "#",
              items: [
                {
                  title: "All Images",
                  url: "/admin/ImageGallery",
                },
                {
                  title: "Create Image Gallery",
                  url: "/admin/ImageGallery/create",
                },
              ],
            },
            {
              title: "Videos",
              url: "#",
              items: [
                {
                  title: "All Videos",
                  url: "/admin/VideoGallery",
                },
                {
                  title: "Create Video Gallery",
                  url: "/admin/VideoGallery/create",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Files Management",
      url: "#",
      icon: Layers,
      items: [
        {
          title: "All Files",
          url: "/admin/filesmangemnt",
        },
        {
          title: "Upload",
          url: "#",
          items: [
            {
              title: "Upload File",
              url: "/admin/filesmangemnt/upload/file",
            },
            {
              title: "Upload Image",
              url: "/admin/filesmangemnt/upload/image",
            },
            {
              title: "Upload Video",
              url: "/admin/filesmangemnt/upload/video",
            },
          ],
        },
      ],
    },
    {
      title: "Seo Management",
      url: "#",
      icon: SearchCheckIcon,
      items: [
        {
          title: "Seo Metadata",
          url: "/admin/seo",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navMainWithActive = React.useMemo(() => {
    const markActive = (items: NavItem[]): NavItem[] => {
      return items.map((item) => ({
        ...item,
        isActive:
          item.url === pathname ||
          (item.items &&
            markActive(item.items).some((subItem) => subItem.isActive)),
        items: item.items ? markActive(item.items) : undefined,
      }));
    };
    return markActive(data.navMain);
  }, [pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-center h-16">
          <Button asChild variant="outline" className="w-full mx-4">
            <Link href="/">Back to Front</Link>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
