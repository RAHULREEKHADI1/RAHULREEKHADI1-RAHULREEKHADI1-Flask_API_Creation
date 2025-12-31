import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";



const pricing: React.FC = () => {

    const TESTIMONIALS = [
        {
            name: "Sarah Chen",
            role: "AI Research Lead",
            content: "The Autodesigner 2.0 has completely redefined our rapid prototyping phase. It's like having a senior designer who never sleeps.",
            img: "/images/testimonials_1.jpeg",
            size: "large"
        },
        {
            name: "Marcus Thorne",
            role: "CTO @ Nexus",
            content: "Scaling our AI infrastructure was a nightmare until we integrated Revolutionize. The Pro plan's Turbo engine is unmatched.",
            img: "/images/testimonials_2.jpeg",
            size: "small"
        },
        {
            name: "Elena Rodriguez",
            role: "Product Manager",
            content: "The most intuitive AI platform I've used. Our team was onboarded in less than an hour, and we're already seeing 40% efficiency gains.",
            img: "/images/testimonials_3.jpeg",
            size: "medium"
        },
        {
            name: "David Park",
            role: "Full Stack Developer",
            content: "The API documentation is flawless. Integrating custom LLMs into our existing workflow took days, not weeks. Easy to integrate.",
            img: "/images/testimonials_4.jpeg",
            size: "small"
        },
        {
            name: "Anya Sharma",
            role: "Creative Director",
            content: "I was skeptical about AI-assisted design, but the precision here is incredible. It handles the grunt work so I can focus on the big ideas.",
            img: "/images/testimonials_5.jpeg",
            size: "large"
        },
        {
            name: "Omar Hassan",
            role: "Founder @ EchoSoft",
            content: "Revolutionize AI is the backbone of our startup. The Team plan features like shared libraries are essential for our growth.",
            img: "/images/testimonials_6.jpeg",
            size: "medium"
        }
    ];

    const COMPARISON_DATA = [
        {
            title: "Target Audience",
            desc: "Who is this plan designed for?",
            values: ["Hobbyists", "Professionals", "Startups", "Organizations"]
        },
        {
            title: "Intelligence Level",
            desc: "The core AI engine version",
            values: ["v1.5 Basic", "v2.0 Turbo", "v2.0 Pro", "Custom LLM"]
        },
    ];

    const MODELS = [
        { name: "Free", btn: "Join Free", primary: false },
        { name: "Pro", btn: "Get Pro", primary: true },
        { name: "Team", btn: "Try Team", primary: false },
        { name: "Enterprise", btn: "Contact", primary: false }
    ];
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/homepage_background.png')" }}>
            <div className="px-4 md:px-10 lg:px-16 py-10">
                <Header showPricing={false} showHome={true} />
                <div className="flex flex-col gap-6 mt-10">
                    <div className="flex justify-center">
                        <h2 className="text-4xl lg:text-6xl text-white font-semibold">Pricing</h2>
                    </div>
                    <p className="text-center text-lg text-white">Go from idea to design in minutes with the power of AI!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                    {[
                        {
                            name: "Free",
                            price: "$0",
                            desc: "Free for everyone",
                            sub: "For students and hobbyists",
                            features: ["Unlimited viewers", "3 AI generations", "Autodesigner 1.5", "2 projects", "10 free templates"],
                            highlight: false
                        },
                        {
                            name: "Pro",
                            price: "$19",
                            desc: "Professional use",
                            sub: "For individuals",
                            features: ["Everything in Free", "Unlimited AI", "Autodesigner 2.0", "Unlimited projects", "Priority support"],
                            highlight: true
                        },
                        {
                            name: "Team",
                            price: "$49",
                            desc: "Collaborative power",
                            sub: "For small startups",
                            features: ["Everything in Pro", "Team libraries", "Advanced security", "Admin dashboard", "Custom domain"],
                            highlight: false
                        },
                        {
                            name: "Enterprise",
                            price: "Custom",
                            desc: "Scalable solutions",
                            sub: "For large organizations",
                            features: ["Everything in Team", "24/7 Support", "SSO/SAML", "Custom AI training", "Dedicated Manager"],
                            highlight: false
                        }
                    ].map((plan, index) => (
                        <div
                            key={index}
                            className={`flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 transform hover:scale-[1.03] ${plan.highlight
                                ? "bg-linear-to-b from-[#225061] to-[#27304F] border-orange-500 shadow-xl shadow-orange-500/10"
                                : "bg-slate-900/40 border-[#789DA9]/30 hover:border-[#789DA9]/60"
                                }`}
                        >
                            <div className="space-y-6 text-white text-center lg:text-left">
                                <div>
                                    <p className="text-xl font-medium">{plan.name}</p>
                                    <p className="text-slate-400 text-sm font-light mt-1">{plan.desc}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h3 className="text-6xl font-bold">{plan.price}</h3>
                                    <p className="text-slate-400 text-sm">{plan.sub}</p>
                                </div>

                                <button className={`w-full py-2.5 rounded font-semibold transition-all duration-300 ${plan.highlight
                                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                                    : "border border-[#789DA9] text-white hover:bg-[#225061] hover:shadow-xl hover:shadow-[#225061]"
                                    }`}>
                                    Get started
                                </button>

                                <div className="space-y-3 pt-6 border-t border-slate-800 text-left">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-[2fr_repeat(4,1fr)] items-center pb-8 border-b border-slate-800 text-white mt-20">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-500">
                        Compare Features
                    </h3>
                    {MODELS.map((m) => (
                        <div key={m.name} className={`text-center text-sm font-semibold ${m.primary ? "text-orange-500" : "text-slate-400"}`}>
                            {m.name}
                        </div>
                    ))}
                </div>

                {COMPARISON_DATA.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-[2fr_repeat(4,1fr)] py-6 border-b border-slate-800/40 items-center group hover:bg-white/2 transition-colors">
                        <div className="pl-2">
                            <p className="text-white font-medium group-hover:text-orange-400 transition-colors">{row.title}</p>
                            <p className="text-xs text-slate-500">{row.desc}</p>
                        </div>
                        {row.values.map((val, i) => (
                            <div key={i} className={`text-center text-sm ${MODELS[i].primary ? "text-white font-bold" : "text-slate-400"}`}>
                                {val}
                            </div>
                        ))}
                    </div>
                ))}

                <div className="grid grid-cols-[2fr_repeat(4,1fr)] py-10 items-center">
                    <div className="text-slate-500 text-sm font-light italic pl-2">Ready to revolutionize your workflow?</div>
                    {MODELS.map((m) => (
                        <div key={m.name} className="px-2">
                            <button className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${m.primary
                                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 scale-110"
                                : "border border-slate-700 hover:bg-[#225061] hover:shadow-xl hover:shadow-[#225061] text-slate-300 hover:text-white"
                                }`}>
                                {m.btn}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="text-center my-20">
                    <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Trusted by the best in the industry
                    </h2>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                        From solo founders to enterprise teams, we're powering the next wave of intelligent applications.
                    </p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-20">
                    {TESTIMONIALS.map((t, idx) => (
                        <div
                            key={idx}
                            className="break-inside-avoid relative group p-8 rounded-3xl bg-slate-900/30 border border-slate-800/60 backdrop-blur-sm hover:bg-slate-800/40 hover:border-orange-500/40 transition-all duration-500 shadow-2xl"
                        >
                            <div className="absolute -inset-1 bg-linear-to-r from-orange-500 to-[#225061] rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

                            <div className="relative">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <img
                                            src={t.img}
                                            alt={t.name}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 group-hover:border-orange-500 transition-colors duration-500"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-orange-500 p-1 rounded-full">
                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4-4a1 1 0 00-1.414 1.414L10.586 10l-2.293 2.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414z" /></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{t.name}</h4>
                                        <p className="text-orange-500/80 text-sm font-medium">{t.role}</p>
                                    </div>
                                </div>

                                <p className="text-slate-300 text-lg leading-relaxed font-light italic">
                                    "{t.content}"
                                </p>

                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-slate-600 text-xs font-mono uppercase tracking-widest">Verified User</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Footer/>
            </div>
        </div>
    )
}

export default pricing;