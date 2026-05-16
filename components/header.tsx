"use client"

import { Fragment, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

type HeaderVariant = "default" | "hero"

interface HeaderProps {
  variant?: HeaderVariant
}

export function Header({ variant = "default" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isHero = variant === "hero"

  const navLinkClass = cn(
    "text-sm font-semibold transition-colors",
    isHero ? "text-[#531b07] hover:text-[#d44612]" : "text-foreground hover:text-primary",
  )

  const ctaClass = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-95",
    isHero
      ? "bg-gradient-to-b from-[#ec4e14] to-[#bd3e10] shadow-sm"
      : "rounded-md bg-primary hover:bg-primary/90",
  )

  const panelClass = cn(
    "overflow-hidden border shadow-[0_12px_40px_rgba(0,0,0,0.1)] backdrop-blur-md",
    "rounded-2xl",
    isHero
      ? "border-white/50 bg-white/78"
      : "border-border/30 bg-background/92 supports-[backdrop-filter]:bg-background/80",
  )

  const desktopNavClass =
    "hidden items-center gap-10 rounded-full bg-transparent px-8 py-3 md:flex lg:gap-20"

  return (
    <Fragment>
      <header className="fixed inset-x-0 top-0 z-[100]">
        {/* ~20% narrower than 1440px cap so the float reads more inset on desktop */}
        <div className="mx-auto w-[calc(100%-1.5rem)] max-w-[min(1152px,calc(100%-2rem))] pt-3 sm:w-[calc(100%-2rem)] md:pt-4">
          <div className={panelClass}>
            <div className="flex h-16 items-center justify-between px-4 md:h-20 md:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/logoconnectpreneur.png"
                  alt="ConnectPreneur Logo"
                  width={220}
                  height={60}
                  className="h-10 w-auto md:h-14"
                />
              </Link>

              <nav className={desktopNavClass}>
                <Link href="/" className={navLinkClass}>
                  Beranda
                </Link>
                <Link href="/katalog" className={navLinkClass}>
                  Katalog
                </Link>
                <Link href="/#tentang" className={navLinkClass}>
                  Tentang Kami
                </Link>
                <Link href="https://docs.connectpreneur.id" className={navLinkClass}>
                  Docs
                </Link>
              </nav>

              <div className="hidden md:block">
                <Link href="/daftar-mitra" className={ctaClass}>
                  Daftar Mitra
                </Link>
              </div>

              <button
                type="button"
                className={cn(
                  "p-2 transition-colors md:hidden",
                  isHero ? "text-[#531b07] hover:text-[#d44612]" : "text-foreground hover:text-primary",
                )}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {isMenuOpen && (
              <nav
                className={cn(
                  "border-t px-4 py-4 md:hidden",
                  isHero ? "border-black/10 bg-white/85" : "border-border/40 bg-background/85",
                )}
              >
                <div className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className={cn("py-2 text-sm font-medium", isHero ? "text-[#531b07]" : "text-foreground")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Beranda
                  </Link>
                  <Link
                    href="/katalog"
                    className={cn("py-2 text-sm font-medium", isHero ? "text-[#531b07]" : "text-foreground")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Katalog
                  </Link>
                  <Link
                    href="/#tentang"
                    className={cn("py-2 text-sm font-medium", isHero ? "text-[#531b07]" : "text-foreground")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tentang Kami
                  </Link>
                  <Link
                    href="https://docs.connectpreneur.id"
                    className={cn("py-2 text-sm font-medium", isHero ? "text-[#531b07]" : "text-foreground")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Docs
                  </Link>
                  <Link
                    href="/daftar-mitra"
                    className={cn(ctaClass, "text-center")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daftar Mitra
                  </Link>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>
      {/* Reserve space so main content is not hidden under the fixed bar (home hero stays full-bleed under the overlay) */}
      {!isHero && (
        <div className="h-[calc(0.75rem+4rem)] shrink-0 md:h-[calc(1rem+5rem)]" aria-hidden />
      )}
    </Fragment>
  )
}
