"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {

  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "px-3 py-1 rounded-full bg-[#6E026F] text-white"
      : "px-3 py-1 rounded-full text-[#6E026F] hover:bg-[#6E026F]/10 transition";

  return (
    <header className="bg-white shadow-sm h-16">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          {/* <img src="/logo.png" alt="Logo" className="h-8 w-auto" /> */}
          <span className="text-xl font-[1000] text-[#6E026F]">
            ImageTools
          </span>
        </Link>

        {/* NAV */}
        <nav className="flex gap-2">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/compress" className={linkClass("/compress")}>
            Compress
          </Link>
          {/* <Link href="/convert" className={linkClass("/convert")}>
            Convert
          </Link> */}
        </nav>

      </div>
    </header>
  );
}
