import Image from "next/image"

const HALO_ILLUSTRATION = "/images/halo-sobat-preneur.png"

export function HaloSobatBanner() {
  return (
    <section className="bg-white px-4 py-16 md:px-8 lg:px-[60px] lg:py-[120px]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 rounded-[20px] bg-white p-6 shadow-[0_0_16px_rgba(236,78,20,0.1)] md:flex-row md:items-center md:gap-10 md:p-8">
          <div className="flex shrink-0 justify-center md:justify-start md:w-[280px] lg:w-[320px]">
            <div className="relative w-full max-w-[300px] md:max-w-[320px]">
              <Image
                src={HALO_ILLUSTRATION}
                alt="Ilustrasi kolaborasi: menyusun potongan puzzle bersama"
                width={698}
                height={472}
                className="h-auto w-full object-contain"
                sizes="(max-width: 768px) 280px, 320px"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-primary md:text-[32px]">Halo Sobat Preneur!</h2>
            <p className="flex flex-wrap items-center justify-center gap-2 text-base text-primary md:justify-start md:text-lg">
              <span>Perluas peluang bisnis Anda melalui program</span>
              <span className="rounded bg-[#b13b0f] px-3 py-1.5 text-lg font-semibold text-[#fdede8]">
                Business Matching
              </span>
              <span>melalui platform</span>
              <span className="rounded bg-[#b13b0f] px-3 py-1.5 text-lg font-semibold text-[#fdede8]">
                ConnectPreneur
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
