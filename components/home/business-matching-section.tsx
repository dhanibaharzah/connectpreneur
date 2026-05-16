import Image from "next/image"
import { Building2, Package, ShoppingBag, Store, Truck } from "lucide-react"

const BUSINESS_MATCHING_ILLUSTRATION = "/images/business-matching-illustration.png"

const roles = [
  { icon: Truck, label: "Dropshipper" },
  { icon: Store, label: "Agen" },
  { icon: ShoppingBag, label: "Reseller" },
  { icon: Package, label: "Supplier Bahan Baku" },
  { icon: Building2, label: "Franchise / Waralaba" },
] as const

export function BusinessMatchingSection() {
  return (
    <section className="bg-white px-4 py-10 md:px-8 lg:px-[60px] lg:pb-20 lg:pt-10">
      <div className="container mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex max-w-xl flex-1 flex-col gap-9">
          <div className="space-y-5">
            <h2 className="text-3xl font-medium text-[#1f1f1f] md:text-[32px]">
              Apa itu <span className="text-primary">Business Matching</span>?
            </h2>
            <p className="text-lg leading-8 text-[#4d4d4d] md:text-xl">
              Program ini membantu pelaku usaha menemukan peluang kerja sama seperti reseller, agen,
              supplier, hingga franchise dalam satu ekosistem bisnis.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-base font-medium text-[#8e2f0c]">Pilih Peluang Kemitraan Anda</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                {roles.slice(0, 3).map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex w-[calc(50%-0.5rem)] min-w-[140px] flex-1 flex-col gap-2 rounded-xl border border-primary p-4 sm:w-[148px] sm:flex-initial"
                  >
                    <Icon className="h-6 w-6 text-primary" aria-hidden />
                    <p className="text-sm font-medium text-[#1f1f1f]">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                {roles.slice(3).map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex min-h-[88px] flex-1 flex-col gap-2 rounded-xl border border-primary p-4 sm:min-w-[200px]"
                  >
                    <Icon className="h-6 w-6 text-primary" aria-hidden />
                    <p className="text-sm font-medium text-[#1f1f1f]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden rounded-3xl bg-white p-4 shadow-[0_0_12px_rgba(0,0,0,0.06)] sm:p-6 lg:min-h-[440px]">
          <Image
            src={BUSINESS_MATCHING_ILLUSTRATION}
            alt="Ilustrasi kemitraan bisnis: jabat tangan, globe, dan pertumbuhan"
            width={1024}
            height={866}
            className="h-auto w-full max-h-[280px] object-contain lg:max-h-[400px]"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
        </div>
      </div>
    </section>
  )
}
