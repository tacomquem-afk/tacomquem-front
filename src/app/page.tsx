import {
  Bell,
  Camera,
  Check,
  Clock,
  History,
  Link as LinkIcon,
  Lock,
  Shield,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nunca mais esqueça seus empréstimos",
  description:
    "Gerencie empréstimos entre amigos, familiares ou colegas. Simples, rápido e seguro.",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#101922] text-white overflow-x-hidden font-sans selection:bg-[#2b8cee] selection:text-white">
      {/* Navbar */}
      <header className="absolute top-0 w-full z-50">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
          <Link
            href="#"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="size-7 md:size-8">
              <Image
                src="/logo.png"
                alt="TáComQuem logo"
                width={128}
                height={128}
                className="size-full object-contain"
                priority
              />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap">
              TáComQuem
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link
              href="#como-funciona"
              className="hover:text-white transition-colors"
            >
              Como funciona
            </Link>
            <Link
              href="#beneficios"
              className="hover:text-white transition-colors"
            >
              Benefícios
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Entrar
            </Link>
          </nav>
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/login"
              className="md:hidden text-xs md:text-sm font-medium text-slate-300 hover:text-white whitespace-nowrap"
            >
              Entrar
            </Link>
            <Button
              asChild
              className="rounded-full bg-[#2b8cee] hover:bg-[#2b8cee]/90 text-white font-bold px-4 md:px-6 py-1 md:py-2 text-[10px] sm:text-xs md:text-base shadow-lg shadow-blue-500/20 transition-all hover:scale-105 h-9 md:h-10"
            >
              <Link href="/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#2b8cee]/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2b8cee]/10 border border-[#2b8cee]/20 text-[#2b8cee] text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2b8cee] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2b8cee]"></span>
            </span>
            Novo Jeito de Emprestar
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-5xl mx-auto leading-[1.2] md:leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            TáComQuem: Nunca mais perca o controle dos seus{" "}
            <span className="text-[#2b8cee]">empréstimos</span>
          </h1>
          <p className="text-base md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Saiba exatamente quem está com seus itens — e quando eles voltam.
            Simples, rápido e sem constrangimentos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-full bg-[#2b8cee] hover:bg-[#2b8cee]/90 text-white font-bold h-12 md:h-14 px-8 text-base md:text-lg shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-1"
            >
              <Link href="/register">👉 Começar agora</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white font-medium h-12 md:h-14 px-8 text-base md:text-lg transition-all"
            >
              <Link href="#como-funciona">Ver como funciona</Link>
            </Button>
          </div>

          {/* Mockup Replication */}
          <div className="relative mx-auto max-w-5xl [perspective:1000px] animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="relative z-10 bg-[#1b2531] rounded-3xl border border-slate-700/50 shadow-2xl shadow-black/50 overflow-hidden [transform:rotateX(5deg)] hover:[transform:rotateX(0deg)] transition-transform duration-700 ease-out border-t-white/10">
              <div className="h-12 border-b border-slate-700/50 bg-[#101922]/50 backdrop-blur flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto w-1/3 h-6 bg-[#101922] rounded-md border border-slate-700/50 opacity-50 text-[10px] flex items-center justify-center text-slate-500 font-mono">
                  tacomquem.app
                </div>
              </div>

              <div className="p-6 md:p-10 bg-[#101922] text-left">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">
                      Central de Empréstimos
                    </h3>
                    <div className="flex -space-x-2">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-[#101922] bg-slate-700 bg-cover"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7EKa89F9B-IO51XcXAVNELaZmaeUgqzqEnN3m-B_vVI4SO19yGLTPV6Q_tS3wTGhhEbWoi1OuNsifnxihIE6CTzdF8tl1pqFVt_zjSMw1ikBp11XdDzyQ1Q1OsKCD5gQxH6Q_xRkUXmgORRdH-ve30xLKAMS8UmvYt4SbBo_L7X9_75ytNLzQDClJFHASdaSCBbg5jxPLpApwk8cszT4-AfGQJq4bebwyjJZhMd7JRGy_9t1DgwrgTqTH6gE1xVU74Om3Nc14iw8")',
                        }}
                      ></div>
                      <div
                        className="w-8 h-8 rounded-full border-2 border-[#101922] bg-slate-700 bg-cover"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuNIsm2Xsq3RSgXjTxYZI3dVXFCYnTs32q4HaZyC_7jXzbzrXPGxHCsBtKtLHaQ43InHtqkN7cHyB_FbQ435Qo11PTtB4_5lB4l6hohtTGH71IN1DEzQ-DBSdJ89BlbFVcijLu46n6t-_jy3XymPfdnOIyTwXbOG04MnGb1szKAY-PzOZo2JkcOywSI7YkRrtSVS6Lb1ULQ1cis6_TC8foAe7QSMR1os9Y-lbUIJD1_W_Y9aOrq2EQPyAaIyfhDav0QPgiNzPe0JM")',
                        }}
                      ></div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#101922] flex items-center justify-center bg-slate-800 text-[10px] text-white font-bold">
                        +5
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400">
                    Gerencie seus itens compartilhados.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="group relative flex flex-col bg-[#1b2531] rounded-2xl overflow-hidden border border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative h-40 w-full overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 bg-[#F59E0B]/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Emprestado
                      </div>
                      <div
                        className="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5uloJ9fKowaudmENP-QxnHkSEFyzixCmCxUSlB63m309hS-ULRN_igOHlTXv4pBFGBtcaz4kM_ltneGnDS6ci-zlNUOREIbjcSQHScv9KZfw3eXrNX9RkLyYstJ9vZWG-tFeyfoWI_ADKVoNttTGIWnBeRRniyifRqbvDlUFBShEtjTDb7_i9hlTGR0tEOO9NWLDRxFgcuvz9BOtR_Vf48xeFawqud88mF6nWF-Av8vwwJqobDIndwlvEbTvXYk8dCZQ4IVD1JTo")',
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <p className="text-[10px] font-medium opacity-90">
                          Devolução: 15 Out
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white">
                        Câmera DSLR Sony
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className="w-5 h-5 rounded-full bg-cover bg-center border border-slate-600"
                          style={{
                            backgroundImage:
                              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7EKa89F9B-IO51XcXAVNELaZmaeUgqzqEnN3m-B_vVI4SO19yGLTPV6Q_tS3wTGhhEbWoi1OuNsifnxihIE6CTzdF8tl1pqFVt_zjSMw1ikBp11XdDzyQ1Q1OsKCD5gQxH6Q_xRkUXmgORRdH-ve30xLKAMS8UmvYt4SbBo_L7X9_75ytNLzQDClJFHASdaSCBbg5jxPLpApwk8cszT4-AfGQJq4bebwyjJZhMd7JRGy_9t1DgwrgTqTH6gE1xVU74Om3Nc14iw8")',
                          }}
                        ></div>
                        <span className="text-xs text-slate-400">
                          Com{" "}
                          <span className="font-medium text-white">Lucas</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="group relative flex flex-col bg-[#1b2531] rounded-2xl overflow-hidden border border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative h-40 w-full overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 bg-[#10B981]/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Check className="w-3 h-3" /> Devolvido
                      </div>
                      <div
                        className="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDs9Ygs9nba68oMcCd6_EyPZec9OgeJ2RR6mfghLE3SKVP_pKnlCwbTAUsvaJPEhje0X1f11Gqpp0c1bK33e1XrGU70K3En2Ozkr4UECoDZ8bKWHMicUG3yHXNYIhi3f8wbZlMXSDqIFe3dKqhkp91b5bV7IkUfJcZ-wUPZFn8w47lUa4kKt2Z0DCiCR9WP_xTQWQnwhOWxm9hNcd8a2HK74rcDjoALLZfYi8t0YsT3lTVGxuqJ32HBbhc8tUlbWYiH5rouR5u3Zzg")',
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white">
                        Furadeira Bosch
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className="w-5 h-5 rounded-full bg-cover bg-center border border-slate-600"
                          style={{
                            backgroundImage:
                              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCFMPbvs2ZiCnV5J9NZr2lWlaeYocEoWEh_1uJyeixd8F7pOi3s_vcO8zZ88yECoteIQNu6nwwMUREM46VLfmpKrol0fTPrAEe6hssCtCuienFyElkI6PuZAR38O7I9g8KyDbq8_i-SgSWBRzj4BS6s0bR2iCt0ErRjQrPln_hrs_-P0MhI997uq5FNxwlGfnnmO4mjuMxyy2SVux7eF-TTCGMXqFaPQQ9LN6V-6AgetPGw2UfwGXuNTwzzeAxVHS8Nbd42QMFSeew")',
                          }}
                        ></div>
                        <span className="text-xs text-slate-400">
                          Estava com{" "}
                          <span className="font-medium text-white">Pedro</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="group relative flex flex-col bg-[#1b2531] rounded-2xl overflow-hidden border border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative h-40 w-full overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 bg-[#F59E0B]/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Emprestado
                      </div>
                      <div
                        className="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaECVuqueNa6kr1vPgIfoEv3m6pLxxIoUaFKKGGI4OVJhwewPHEDkzdwh8PnMp2PkcGo40sFoVV22rq-pcERr6v1rW9rnoD5m1zbqELVedP_PutyflwuPLwxE80bIsubGJryDM-7UemQ4K8mhIwfVYLvvFggRb2dpW3kzi1MIdLWB6vLAvCPlBb99E46Li0TEw-kbLHTnNOyHKsnW1ok0azKAyG8zCs67dcyrwSJ8sleiHaxrJXW56fnN86AICHlZ3nthzAbNZvzE")',
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <p className="text-[10px] font-medium opacity-90">
                          Devolução: 20 Out
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white">
                        Barraca de Camping
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className="w-5 h-5 rounded-full bg-cover bg-center border border-slate-600"
                          style={{
                            backgroundImage:
                              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuNIsm2Xsq3RSgXjTxYZI3dVXFCYnTs32q4HaZyC_7jXzbzrXPGxHCsBtKtLHaQ43InHtqkN7cHyB_FbQ435Qo11PTtB4_5lB4l6hohtTGH71IN1DEzQ-DBSdJ89BlbFVcijLu46n6t-_jy3XymPfdnOIyTwXbOG04MnGb1szKAY-PzOZo2JkcOywSI7YkRrtSVS6Lb1ULQ1cis6_TC8foAe7QSMR1os9Y-lbUIJD1_W_Y9aOrq2EQPyAaIyfhDav0QPgiNzPe0JM")',
                          }}
                        ></div>
                        <span className="text-xs text-slate-400">
                          Com{" "}
                          <span className="font-medium text-white">
                            Mariana
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 left-10 md:left-20 right-10 md:right-20 h-20 bg-[#2b8cee] blur-[80px] opacity-40 -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-[#1b2531]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Já esqueceu com quem ficou aquela sua{" "}
                <span className="text-[#2b8cee]">furadeira?</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Ou pior: já teve vergonha de cobrar a devolução de um livro que
                emprestou há meses? A gente sabe como é. Emprestar para amigos
                deveria ser um ato de generosidade, não de dor de cabeça.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Esquecimentos frequentes",
                  "Constrangimento ao cobrar",
                  "Falta de controle",
                  "Perda de itens valiosos",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="size-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                      <span className="text-xs">✕</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-[#101922] p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl relative z-10">
                <div className="flex gap-3 md:gap-4 items-start mb-6">
                  <div className="size-8 md:size-10 rounded-full bg-slate-700 flex-shrink-0"></div>
                  <div className="space-y-2 flex-grow">
                    <div className="h-3 md:h-4 bg-slate-700 rounded w-1/3"></div>
                    <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 md:p-4 text-slate-400 italic text-xs md:text-sm leading-relaxed">
                      &ldquo;Cara, você lembra se eu te devolvi aquele controle
                      de PS5? Tô procurando aqui e não acho...&rdquo;
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4 items-start flex-row-reverse">
                  <div className="size-8 md:size-10 rounded-full bg-[#2b8cee] flex-shrink-0"></div>
                  <div className="space-y-2 flex-grow flex flex-col items-end">
                    <div className="h-3 md:h-4 bg-slate-700 rounded w-1/3"></div>
                    <div className="bg-[#2b8cee]/20 border border-[#2b8cee]/30 text-[#2b8cee] rounded-2xl rounded-tr-none p-3 flex items-center gap-2 text-xs md:text-sm font-medium w-fit max-w-[90%] md:max-w-full">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      <span>Com TáComQuem isso não acontece.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-10 right-10 w-full h-full bg-[#2b8cee]/5 rounded-2xl border-2 border-dashed border-[#2b8cee]/20 -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="como-funciona" className="py-24 bg-[#101922]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simples como deve ser
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Sem burocracia. Empreste em segundos e mantenha a amizade intacta.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-[#2b8cee]" />,
                title: "1. Registre em segundos",
                desc: "Tire uma foto, diga o que é e para quem vai. Pronto.",
              },
              {
                icon: <LinkIcon className="w-8 h-8 text-[#2b8cee]" />,
                title: "2. Envie o link",
                desc: "Seu amigo recebe um link de confirmação no WhatsApp. Tudo transparente.",
              },
              {
                icon: <Clock className="w-8 h-8 text-[#2b8cee]" />,
                title: "3. Acompanhe",
                desc: "Receba lembretes automáticos e saiba quando o item vai voltar.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="bg-[#1b2531] p-8 rounded-2xl border border-slate-700/50 hover:border-[#2b8cee]/50 transition-colors group"
              >
                <div className="size-16 rounded-2xl bg-[#101922] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="beneficios" className="py-24 bg-[#1b2531]">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Tudo o que você precisa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:max-w-5xl lg:mx-auto gap-6">
            {[
              {
                icon: <Camera className="w-10 h-10 text-[#2b8cee]" />,
                label: "Fotos do Item",
              },
              {
                icon: <LinkIcon className="w-10 h-10 text-[#2b8cee]" />,
                label: "Link Seguro",
              },
              {
                icon: <Clock className="w-10 h-10 text-[#2b8cee]" />,
                label: "Prazos",
              },
              {
                icon: <Bell className="w-10 h-10 text-[#2b8cee]" />,
                label: "Lembretes",
              },
              {
                icon: <History className="w-10 h-10 text-[#2b8cee]" />,
                label: "Histórico",
              },
              {
                icon: <Lock className="w-10 h-10 text-[#2b8cee]" />,
                label: "Privacidade",
              },
            ].map((feature) => (
              <div
                key={feature.label}
                className="bg-[#101922] p-6 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center gap-3 hover:bg-[#2b8cee]/10 transition-colors cursor-default"
              >
                <div className="flex items-center justify-center h-14 w-14">
                  {feature.icon}
                </div>
                <span className="font-semibold text-sm md:text-base text-slate-200">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-[#101922] relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1b2531] to-[#101922] p-12 rounded-3xl border border-slate-700 relative">
            <div className="text-[#2b8cee] absolute top-8 left-8">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.8765 16 15.9811 16H19.9902L19.9902 11.9545H14.1509L14.1509 3H22.9902L22.9902 12C22.9902 16.9706 18.9734 21 14.017 21ZM5.00693 21L5.00693 18C5.00693 16.8954 5.86641 16 6.97095 16H10.9902L10.9902 11.9545H5.15093L5.15093 3H13.9902L13.9902 12C13.9902 16.9706 9.97345 21 5.00693 21Z"></path>
              </svg>
            </div>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-center mb-8 relative z-10 pt-6">
              &ldquo;Sempre tive problemas em emprestar meus equipamentos de
              fotografia. Com o <strong>TáComQuem</strong>, eu tenho o controle
              total e meus amigos até acham o sistema profissional.
              Genial.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4">
              <div
                className="size-12 rounded-full bg-slate-700 bg-cover"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7EKa89F9B-IO51XcXAVNELaZmaeUgqzqEnN3m-B_vVI4SO19yGLTPV6Q_tS3wTGhhEbWoi1OuNsifnxihIE6CTzdF8tl1pqFVt_zjSMw1ikBp11XdDzyQ1Q1OsKCD5gQxH6Q_xRkUXmgORRdH-ve30xLKAMS8UmvYt4SbBo_L7X9_75ytNLzQDClJFHASdaSCBbg5jxPLpApwk8cszT4-AfGQJq4bebwyjJZhMd7JRGy_9t1DgwrgTqTH6gE1xVU74Om3Nc14iw8")',
                }}
              ></div>
              <div className="text-left">
                <p className="font-bold text-white">Lucas Silva</p>
                <p className="text-sm text-[#2b8cee]">Fotógrafo Profissional</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Call & CTA */}
      <section className="py-32 bg-[#1b2531] text-center px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Emprestar não precisa ser um problema.
          </h2>
          <p className="text-xl text-slate-400">
            Resgate a confiança nas suas relações e mantenha suas coisas
            seguras.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button
              asChild
              size="lg"
              className="w-full md:w-auto rounded-full bg-[#2b8cee] hover:bg-[#2b8cee]/90 text-white font-bold h-16 px-10 text-xl shadow-2xl shadow-blue-500/40 transition-all hover:scale-105"
            >
              <Link href="/register">Começar Agora Gratuitamente</Link>
            </Button>
            <p className="text-sm text-slate-500">
              Sem cartão de crédito necessário
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101922] border-t border-slate-800 py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="size-6">
              <Image
                src="/logo.png"
                alt="TáComQuem logo"
                width={96}
                height={96}
                className="size-full object-contain"
              />
            </div>
            <span className="font-bold text-lg text-white">TáComQuem</span>
          </Link>
          <p className="text-slate-500 text-sm">
            © 2026 TáComQuem. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Termos
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
