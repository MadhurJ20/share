"use client";

import { ChartArea, HomeIcon } from "lucide-react";
import { ThemeToggle } from "./themeToggle";

export const Nav = () => {
  return (
    <nav
      className='flex px-6 py-3 justify-between bg-[#ccc2] dark:bg-[#222] backdrop-blur-md shadow-lg mt-8 absolute rounded-full lg:w-1/3 top-0 w-4/5 z-10'>
      <h2 className='font-bold'> ACES </h2>
      <section className='flex space-x-4'>
        <ThemeToggle />
        <a href='/' className='hover:text-blue-500'><HomeIcon className="w-5 h-5" /></a>
        <a href='/analytics' className='hover:text-blue-500'><ChartArea className="w-5 h-5" /></a>
      </section>
    </nav>
  );
};