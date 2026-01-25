import Image from "next/image"
import { Target, Users, Lightbulb, Handshake } from "lucide-react"

export function AboutSection() {
  const values = [
    {
      icon: Target,
      title: "Kreatif",
      description: "Mengembangkan ide-ide inovatif untuk pertumbuhan bisnis anggota",
    },
    {
      icon: Users,
      title: "Kolaboratif",
      description: "Membangun jaringan kemitraan yang saling menguntungkan",
    },
    {
      icon: Lightbulb,
      title: "Berdaya",
      description: "Memberdayakan UMKM untuk mandiri dan berkembang",
    },
    {
      icon: Handshake,
      title: "Business Matching",
      description: "Menghubungkan mitra strategis untuk percepatan bisnis",
    },
  ]

  return (
    <section id="tentang" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tentang ConnectPreneur</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Program Business Matching dari BOEMKraf
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
                <Image
                  src="/images/logoconnectpreneur.png"
                  alt="ConnectPreneur Logo"
                  width={300}
                  height={150}
                  className="w-full h-auto max-w-xs mx-auto"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Apa itu ConnectPreneur?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  ConnectPreneur adalah program Digital Ecosystem yang diinisiasi oleh BOEMKraf (Bidang Pemberdayaan 
                  UMKM, Ekonomi Kreatif & Korporasi). Program ini bertujuan untuk menghubungkan para
                  pelaku UMKM dengan berbagai peluang kemitraan bisnis.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Tujuan Program</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Melalui program Business Matching internal, kami membantu memperluas jangkauan bisnis anggota dengan
                  menghubungkan mereka dengan puluhan ribu anggota BOEMKraf untuk menemukan mitra
                  strategis dan mempercepat pertumbuhan bisnis.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 text-center border border-border hover:border-primary/50 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-foreground mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <p className="text-foreground font-bold text-xl mb-2">BOEMKraf</p>
            <p className="text-primary font-semibold text-lg">Kreatif, Kolaboratif, Berdaya!</p>
          </div>
        </div>
      </div>
    </section>
  )
}
