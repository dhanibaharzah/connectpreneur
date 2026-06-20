import Image from "next/image"
import Link from "next/link"
import { ArrowRight, AlertTriangle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#ec4e14] to-[#862c0b] px-4 pb-8 pt-14 text-white md:px-8 lg:px-[60px]">
      <div className="container mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-8">
          <div className="flex max-w-sm flex-col gap-5">
            <div className="relative h-10 w-24">
              <Image
                src="/images/logoconnectpreneur.png"
                alt="ConnectPreneur Logo"
                fill
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <p className="text-sm font-medium text-white/95">
              Platform katalog bisnis yang menghubungkan Anda dengan berbagai peluang usaha dan program
              kemitraan terbaik di Indonesia.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium">
            <Link href="/" className="transition hover:text-[#f9c8b6]">
              Beranda
            </Link>
            <Link href="/katalog" className="transition hover:text-[#f9c8b6]">
              Katalog Bisnis
            </Link>
            <Link href="/#tentang" className="transition hover:text-[#f9c8b6]">
              Tentang Kami
            </Link>
            <Link href="https://docs.connectpreneur.id" className="transition hover:text-[#f9c8b6]">
              Docs
            </Link>
          </div>

          <div className="flex max-w-xs flex-col gap-5">
            <div className="space-y-3 text-sm">
              <p className="font-semibold">Hubungi Kami</p>
              <p className="font-normal leading-normal text-white/95">
                Ingin mendaftarkan bisnis Anda? Hubungi tim kami untuk informasi lebih lanjut.
              </p>
            </div>
            <div className="inline-flex max-w-full items-center gap-3 rounded-full bg-[#fdede8] py-1 pl-3 pr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0 text-[#25D366]"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="min-w-0 flex-1 truncate text-sm text-[#1f1f1f]">Karso +6285221223145</span>
              <Link
                href="https://wa.me/6285221223145?text=Halo%20Kak%20Karso,%20saya%20ingin%20mendaftarkan%20bisnis%20di%20ConnectPreneur"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:opacity-95"
                aria-label="Chat WhatsApp"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-[rgba(253,237,232,0.2)] px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-white" aria-hidden />
            <p className="text-xs font-semibold">Disclaimer</p>
          </div>
          <p className="text-xs font-normal leading-snug text-white/95">
            ConnectPreneur hanya berfungsi sebagai platform penghubung antara pemilik bisnis dan calon mitra.
            Segala bentuk transaksi dan kerjasama yang terjadi merupakan tanggung jawab masing-masing pihak.
            ConnectPreneur tidak bertanggung jawab atas wanprestasi atau kerugian yang mungkin timbul dari kerjasama
            bisnis. Selalu berhati-hati dan lakukan verifikasi sebelum melakukan transaksi bisnis.
          </p>
        </div>

        <div className="space-y-6">
          <div className="h-px w-full bg-[#f9c8b6]" />
          <p className="text-center text-sm font-medium text-[#f9c8b6]">
            &copy; {new Date().getFullYear()} ConnectPreneur. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
