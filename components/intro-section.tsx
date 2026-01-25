import Image from "next/image"
import { CheckCircle, Users, Handshake, TrendingUp } from "lucide-react"
import Link from "next/link"

export function IntroSection() {
  const peluangKemitraan = [
    { icon: Users, label: "Reseller" },
    { icon: Handshake, label: "Agen" },
    { icon: TrendingUp, label: "Dropshipper" },
    { icon: CheckCircle, label: "Franchise / Waralaba" },
    { icon: CheckCircle, label: "Supplier Bahan Baku" },
  ]

  return (
    <section className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Halo Sobat Preneur!</h2>
            <p className="text-lg text-muted-foreground">
              BOEMKraf saat ini tengah melakukan pendataan khusus bagi bisnis anggota yang membuka peluang
              kemitraan.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-10 border border-border">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              <div className="flex-shrink-0">
                <Image
                  src="/images/logoconnectpreneur.png"
                  alt="ConnectPreneur Logo"
                  width={200}
                  height={100}
                  className="h-20 md:h-24 w-auto"
                />
              </div>
              <div>
                <p className="text-foreground leading-relaxed">
                  Kami ingin membantu memperluas jangkauan bisnis Anda melalui program{" "}
                  <span className="font-bold text-primary">BUSINESS MATCHING</span> di internal.
                </p>
              </div>
            </div>

            {/* Peluang Kemitraan */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Apakah bisnis Anda saat ini membuka peluang untuk:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {peluangKemitraan.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-secondary/30 rounded-xl p-6 mb-8">
              <p className="text-foreground leading-relaxed">
                Informasi peluang kemitraan ini nantinya akan kami informasikan dan sebarluaskan kepada{" "}
                <span className="font-bold text-primary">puluhan ribu anggota BOEMKraf</span>.
              </p>
              <p className="text-foreground mt-3 font-semibold">
                Ini adalah kesempatan emas untuk menemukan mitra strategis dan mempercepat pertumbuhan bisnis Anda!
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Bagi Anda yang memiliki peluang kemitraan tersebut, yuk segera daftarkan bisnis Anda:
              </p>
              <Link
                href="/daftar-mitra"
                className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Daftarkan Bisnis Anda
              </Link>
            </div>

            {/* Tagline */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground italic">
                Mari berkolaborasi dan tumbuh bersama dalam Digital Ecosystem;{" "}
                <span className="text-primary font-semibold">Connectpreneur</span>
              </p>
              <p className="mt-4 text-foreground font-bold">BOEMKraf</p>
              <p className="text-primary font-medium">Kreatif, Kolaboratif, Berdaya!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
