"use client"

import Link from "next/link"
import { HOME_HERO_BACKGROUND } from "@/lib/home-hero"

/** Height follows 21:9 from viewport width, with floors so copy + floating header fit on small screens. */
const HERO_HEIGHT = "clamp(300px, calc(100vw * 9 / 21), min(72vh, 720px))" as const

export function HeroSection() {
  return (
    <section
      className="relative flex w-full flex-col overflow-x-hidden bg-white"
      style={{ minHeight: HERO_HEIGHT }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("${HOME_HERO_BACKGROUND}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            /* 21:9 art: copy-safe left; slight left bias keeps warung + handshake readable */
            backgroundPosition: "24% center",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[min(78%,860px)] max-sm:w-[min(96%,480px)]"
          style={{
            background:
              "linear-gradient(95deg, rgba(255,255,255,0.99) 0%, rgba(255,255,255,0.97) 16%, rgba(255,255,255,0.93) 30%, rgba(255,255,255,0.84) 46%, rgba(255,255,255,0.68) 60%, rgba(255,255,255,0.38) 78%, rgba(255,255,255,0.12) 92%, transparent 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-white/[0.97] via-white/45 to-transparent" />
        <div
          className="absolute inset-y-0 right-0 w-[22%]"
          style={{
            background: "linear-gradient(270deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-[1] mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col justify-start px-4 pb-14 pt-[calc(0.75rem+4rem+0.75rem)] md:justify-end md:px-8 md:pb-14 md:pt-24 lg:px-[60px] lg:pb-16 lg:pt-28">
        <div className="flex max-w-[660px] flex-col gap-5 rounded-2xl px-1 py-2 sm:gap-7 sm:px-2">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold leading-[1.25] text-primary md:text-4xl md:leading-[52px]">
              <span className="block">Temukan Peluang</span>
              <span className="block">Kemitraan Bisnis Terbaik</span>
            </h1>
            <p className="text-lg leading-8 text-[#4d4d4d] md:text-2xl md:leading-9">
              Platform katalog bisnis yang menghubungkan Anda dengan berbagai peluang usaha dan program
              kemitraan di Indonesia.
            </p>
          </div>
          <Link
            href="/daftar-mitra"
            className="inline-flex h-12 w-[160px] items-center justify-center rounded-full bg-primary text-sm font-medium text-white transition hover:bg-[#d44612]"
          >
            Daftar Mitra
          </Link>
        </div>
      </div>
    </section>
  )
}
