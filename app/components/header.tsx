import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white shadow-sm h-16">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">

        {/* LOGO + BRAND */}
        <Link href="/" className="flex items-center gap-3">
          {/* <img
            src="/logo.png"
            alt="ImageTools Logo"
            className="h-20 w-20 object-contain"
          /> */}
          <span className="text-xl font-[1000] text-[#6E026F]">
            ImageTools
          </span>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full bg-[#6E026F] text-white"
          >
            Home
          </Link>

          <Link
            href="/compress"
            className="px-4 py-1.5 rounded-full text-[#6E026F] hover:bg-[#6E026F]/10 transition"
          >
            Compress
          </Link>

          {/* <Link
            href="/convert"
            className="px-4 py-1.5 rounded-full text-[#6E026F] hover:bg-[#6E026F]/10 transition"
          >
            Convert
          </Link> */}
        </nav>

      </div>
    </header>
  );
}
