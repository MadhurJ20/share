"use client";

import { ChartPieIcon, HomeIcon, UserCog2 } from "lucide-react";
import { ThemeToggle } from "@components/themeToggle";
import Link from "next/link";

export const Nav = () => {
  return (
    <nav className="flex px-6 py-3 justify-between items-center bg-[#ccc2] dark:bg-[#8882] backdrop-blur-md shadow-lg mt-8 absolute rounded-full lg:w-1/3 top-0 w-4/5 z-20 c-beige:text-beige-800">
      <h2 className="font-bold">
        ACES : <Link href="/share">Share</Link>
      </h2>
      <section className="flex space-x-3 *:*:w-5 *:*:h-5 items-center">
        <Link href="/share" className="hover:text-blue-500">
          <HomeIcon />
        </Link>
        <Link href="/graphs" className="hover:text-blue-500">
          <ChartPieIcon />
        </Link>
        <Link href="/analytics" className="hover:text-blue-500">
          <UserCog2 />
        </Link>
        <ThemeToggle />
      </section>
    </nav>
  );
};
