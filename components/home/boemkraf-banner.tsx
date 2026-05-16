import Image from "next/image"

export function BoemkrafBanner() {
  return (
    <section className="bg-white px-4 pb-16 pt-5 md:px-8 lg:px-[60px]">
      <div className="container mx-auto max-w-6xl">
        <div className="relative h-[165px] w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-[#f9c8b6] to-[#fdede8] md:h-[180px]">
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
          <div className="relative z-[1] flex h-full flex-col items-center justify-center gap-5 px-4 text-center text-primary">
            <p className="text-3xl font-semibold md:text-4xl">BOEMKraf</p>
            <p className="text-xl tracking-wide md:text-2xl">Kreatif, Kolaboratif, Berdaya!</p>
          </div>
        </div>
      </div>
    </section>
  )
}
