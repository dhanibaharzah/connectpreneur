import Image from "next/image"
import { Lightbulb, Users, TrendingUp, Handshake } from "lucide-react"

const values = [
  {
    icon: Lightbulb,
    title: "Kreatif",
    description: "Mengembangkan solusi digital inovatif untuk pertumbuhan bisnis UMKM",
  },
  {
    icon: Users,
    title: "Kolaboratif",
    description: "Membangun jaringan kemitraan yang saling menguntungkan",
  },
  {
    icon: TrendingUp,
    title: "Berdaya",
    description: "Memberdayakan UMKM untuk mandiri dan berkembang",
  },
  {
    icon: Handshake,
    title: "Business Matching",
    description: "Menghubungkan mitra strategis untuk percepatan bisnis",
  },
] as const

export function AboutSection() {
  return (
    <section id="tentang" className="bg-white px-4 py-16 md:px-8 lg:px-[60px] lg:py-20">
      <div className="container mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
        <div className="flex w-full max-w-[540px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[32px] bg-white p-12 shadow-[0_0_12px_rgba(0,0,0,0.1)] lg:aspect-square lg:max-h-[540px] lg:p-16">
          <div className="relative h-36 w-full max-w-[430px] md:h-44">
            <Image
              src="/images/logoconnectpreneur.png"
              alt="ConnectPreneur Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#636363]">Tentang ConnectPreneur</p>
            <h2 className="text-2xl font-medium text-[#1f1f1f] md:text-2xl">
              Apa itu <span className="text-primary">ConnectPreneur</span>?
            </h2>
            <p className="text-sm leading-6 text-[#838383] md:text-sm">
              ConnectPreneur adalah startup digital yang diinisiasi Perkumpulan Anak Muda Bandung. Kami
              percaya bahwa berwirausaha dapat memajukan ekonomi Indonesia, dan hadir untuk menghubungkan
              para pelaku UMKM dengan berbagai peluang kemitraan bisnis melalui platform katalog dan
              business matching.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-[#f9c8b6] bg-[#fdede8] p-3 text-xs">
            <p className="font-semibold text-primary">Tujuan Kami</p>
            <p className="leading-5 text-[#1f1f1f]">
              Membantu memperluas jangkauan bisnis UMKM dengan menghubungkan mitra bisnis dan calon mitra
              untuk menemukan kolaborasi strategis dan mempercepat pertumbuhan usaha.
            </p>
          </div>

          <div className="flex flex-col gap-7 pt-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {values.slice(0, 2).map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-5">
                  <div className="w-1 shrink-0 rounded-sm bg-gradient-to-b from-[#fdede8] to-[#f9c8b6]" />
                  <div className="flex flex-col gap-2">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#fdede8]">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <p className="text-sm font-semibold text-[#b13b0f]">{title}</p>
                    <p className="text-xs font-medium text-[#838383]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {values.slice(2).map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-5">
                  <div className="w-1 shrink-0 rounded-sm bg-gradient-to-b from-[#fdede8] to-[#f9c8b6]" />
                  <div className="flex flex-col gap-2">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#fdede8]">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <p className="text-sm font-semibold text-[#b13b0f]">{title}</p>
                    <p className="text-xs font-medium text-[#838383]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
