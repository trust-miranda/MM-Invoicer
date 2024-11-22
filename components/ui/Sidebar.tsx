"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import { SidebarAccordion } from "./sidebarAccordion";
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "./tooltip";
import { Button } from "./button";

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <section className={`sidebar h-screen ${isCollapsed ? "collapsed" : ""}`}>
      <nav className="flex flex-col gap-4">
        <Link href="/" className="cursor-pointer flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Trust logo"
            className="mt-4 size-[24px] max-xl:size-14"
          />
          <h1
            className={` mt-4 sidebar-logo text-nowrap ${isCollapsed ? "hidden" : ""}`}
          >
            TRUST Monitor
          </h1>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 p-1 -translate-x-1"
                onClick={toggleSidebar}
              >
                <ChevronLeftIcon
                  className={`w-4 h-4 transition-transform ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
        {/* {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
            >
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({
                    "brightness-[3] invert-0": isActive,
                  })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {item.label}
              </p>
            </Link>
          );
        })} */}
        <SidebarAccordion isCollapsed={isCollapsed} />
      </nav>

      <Footer user={user} isSidebarCollapsed={isCollapsed} />
    </section>
  );
};

function ChevronLeftIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default Sidebar;
