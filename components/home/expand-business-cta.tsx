import Image from "next/image"
import Link from "next/link"

export function ExpandBusinessCta() {
  return (
    <section className="bg-white px-4 pb-16 pt-5 md:px-8 lg:px-[60px]">
      <div className="container mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#f9c8b6] to-[#fdede8] px-4 py-10 md:px-8 md:py-12">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.05]">
            <div className="flex scale-[1.65] items-center justify-center">
              <Image
                src="/images/logoconnectpreneur.png"
                alt=""
                width={926}
                height={384}
                className="h-auto max-h-[280px] w-[min(92%,926px)] object-contain md:max-h-[320px]"
              />
            </div>
          </div>
          <div className="relative z-[1] mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-semibold text-primary md:text-[32px]">
              Siap <span className="text-[#8e2f0c]">Memperluas Bisnis</span> Anda?
            </h2>
            <p className="text-lg text-[#531b07] md:text-xl">
              Gabung sekarang dan temukan peluang kolaborasi yang lebih luas bersama BOEMKraf.
            </p>
            <Link
              href="/daftar-mitra"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-b from-[#ec4e14] to-[#bd3e10] px-8 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
            >
              Daftarkan Bisnis Anda
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
