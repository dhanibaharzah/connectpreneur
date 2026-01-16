"use client"

import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary to-accent py-24 md:py-36">
      <div className="absolute inset-0 bg-[url('/busy-indonesian-market-street-food-vendors-small-b.jpg')] opacity-20 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/15 to-accent/30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logoconnectpreneur.png"
              alt="ConnectPreneur Logo"
              width={280}
              height={140}
              className="h-24 md:h-32 w-auto drop-shadow-lg"
              priority
            />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
            Temukan Peluang Kemitraan Bisnis Terbaik
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 text-pretty">
            Platform katalog bisnis yang menghubungkan Anda dengan berbagai peluang usaha dan program kemitraan di
            Indonesia
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-16 md:h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,120 600,0 900,60 C1050,90 1150,75 1200,60 L1200,120 L0,120 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
