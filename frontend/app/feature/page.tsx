"use client"
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Feature: React.FC = () => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const router = useRouter();
    const handleSignup = () => {
        router.push("/signup")
    }

    const handleDashboard = () => {
        router.push("/dashboard")
    }

    useEffect(() => {
        const jwt = localStorage.getItem("access_token");
        setIsLoggedIn(!!jwt);
    }, [isLoggedIn]);


    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/homepage_background.png')" }}>
            <div className="px-4 md:px-10 lg:px-16 py-10">
                <Header showFeature={false} showHome={true} />
                <div className="mt-10 flex flex-col gap-20">
                    <div className="flex flex-col gap-10 justify-center items-center">
                        <h4 className="text-4xl lg:text-6xl text-white font-semibold">Features</h4>
                        <p className="text-white text-center text-xl">Welcome to the official Revolutionize AI blog, where you can learn about all things design and read about all the latest magical Revolutionize AIing news. Whether you are a seasoned pro or a design newcomer, there is something for everyone in the Revolutionize AI Blog of Spells.</p>
                        <button className="py-2 px-6 bg-[#F47C3E] text-white rounded-md font-semibold hover:shadow-lg hover:shadow-orange-500 hover:bg-orange-500 hover:scale-105 transform transition duration-300"
                            onClick={!isLoggedIn ? handleSignup : handleDashboard}>
                            {!isLoggedIn ? "Sign Up For Free" : "Go to dashboard"}
                        </button>
                    </div>

                    <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20 my-10 mt-20 px-6 py-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl lg:text-7xl text-white font-bold leading-[1.1] tracking-tight">
                                Product Managers <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
                                    & Product Teams
                                </span>
                            </h2>

                            <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
                                <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light">
                                    Bring your ideas to life and move your projects forward <span className="text-white font-medium">faster than ever before</span> with the power of AI.
                                </p>
                                <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                                    Make design bottlenecks a thing of the past and work with your team in real-time, no design experience required!
                                </p>
                            </div>

                            <div className="pt-4">
                                <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95">
                                    Start Creating 🪄
                                </button>
                            </div>
                        </div>

                        <div className="relative group flex-1 w-full max-w-md lg:max-w-xl">
                            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                            <div className="relative overflow-hidden rounded-2xl border border-white/20">
                                <img
                                    src="/images/AI_Product_Manager.jpg"
                                    alt="Product Manager UI"
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse lg:flex-row-reverse items-center justify-between gap-12 lg:gap-20 my-10 px-6 py-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl lg:text-7xl text-white font-bold leading-[1.1] tracking-tight">
                                Consultants <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">
                                    & Agencies
                                </span>
                            </h2>

                            <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
                                <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light">
                                    Create stunning visuals in seconds and spin out design deliverables at speed to <span className="text-white font-medium">beat deadlines and impress your clients.</span>
                                </p>
                                <p className="text-base md:text-lg text-gray-400 leading-relaxed italic">
                                    "Revolutionize AI makes ideation and iteration a breeze with the magic of AI-powered UI design."
                                </p>
                            </div>

                            <div className="pt-4">
                                <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95">
                                    Scale Your Agency 🚀
                                </button>
                            </div>
                        </div>
                        <div className="relative group flex-1 w-full max-w-md lg:max-w-xl">
                            <div className="absolute -inset-1 bg-linear-to-r from-teal-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                            <div className="relative overflow-hidden rounded-2xl border border-white/20">
                                <img
                                    src="/images/Consultancy_and_Agenices.jpg"
                                    alt="Agency Design Deliverables"
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20 my-10 px-6 py-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">

                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl lg:text-7xl text-white font-bold leading-[1.1] tracking-tight">
                                Professional <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-500">
                                    Designers
                                </span>
                            </h2>

                            <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
                                <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light">
                                    Test ideas, iterate on concepts, and <span className="text-white font-medium">collaborate with your team faster than ever.</span>
                                </p>
                                <p className="text-base md:text-lg text-gray-400 leading-relaxed border-l-2 border-indigo-500 pl-4">
                                    Revolutionize AI streamlines your workflow making stakeholder management easier than ever before.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                    Design Faster ⚡
                                </button>
                            </div>
                        </div>

                        <div className="relative group flex-1 w-full max-w-md lg:max-w-xl">
                            <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>

                            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/20">
                                <img
                                    src="/images/designers_image.jpg"
                                    alt="Designer collaborating on UI"
                                    className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    </div>

                    <div className="py-10 px-4 overflow-hidden">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h3 className="text-pink-200/40 text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-4">
                                    Used by individuals and teams at the world's boldest companies
                                </h3>
                                <div className="h-0.5 w-24 bg-linear-to-r from-transparent via-pink-500 to-transparent mx-auto shadow-[0_0_15px_#ec4899]"></div>
                            </div>

                            <div className="relative flex group cursor-default">
                                <div className="flex animate-marquee whitespace-nowrap gap-4 md:gap-10 py-4">
                                    {["Google", "Amazon", "Meta", "Microsoft", "Netflix", "Tesla", "SpaceX", "Adobe", "Spotify", "Airbnb"].map((company, i) => (
                                        <div
                                            key={i}
                                            className="px-6 py-3 md:px-12 md:py-6 rounded-2xl bg-pink-500/5 backdrop-blur-xl border border-pink-500/20 text-pink-50/80 text-lg md:text-3xl font-extrabold transition-all duration-500 hover:bg-pink-500/10 hover:border-pink-400 hover:text-white hover:shadow-[0_0_40px_rgba(236,72,153,0.15)] hover:-translate-y-2"
                                        >
                                            {company}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap gap-4 md:gap-10 py-4" aria-hidden="true">
                                    {["Google", "Amazon", "Meta", "Microsoft", "Netflix", "Tesla", "SpaceX", "Adobe", "Spotify", "Airbnb"].map((company, i) => (
                                        <div
                                            key={`loop-${i}`}
                                            className="px-6 py-3 md:px-12 md:py-6 rounded-2xl bg-pink-500/5 backdrop-blur-xl border border-pink-500/20 text-pink-50/80 text-lg md:text-3xl font-extrabold transition-all duration-500 hover:bg-pink-500/10 hover:border-pink-400 hover:text-white hover:shadow-[0_0_40px_rgba(236,72,153,0.15)] hover:-translate-y-2"
                                        >
                                            {company}
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute inset-y-0 left-0 w-20 md:w-48 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10 pointer-events-none"></div>
                                <div className="absolute inset-y-0 right-0 w-20 md:w-48 bg-linear-to-l from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                            <img src="/images/revolutionize_logo.png" alt="company_logo" className="h-10 md:h-12" />
                            <div className="flex flex-col gap-1 text-center md:text-left">
                                <p className="text-white text-lg md:text-xl font-semibold">REVOLUTIONIZE AI</p>
                                <p className="text-[#B0C4CC] text-sm md:text-base">
                                    Visualize product ideas fast and easy with AI
                                </p>
                            </div>
                        </div>

                        <div>
                            <button className="py-2 px-6 bg-[#F47C3E] text-white rounded-md font-semibold hover:shadow-lg hover:shadow-orange-500 hover:bg-orange-500 hover:scale-105 transform transition duration-300"
                                onClick={!isLoggedIn ? handleSignup : handleDashboard}>
                                {!isLoggedIn ? "Sign Up For Free" : "Go to dashboard"}
                            </button>
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
        </div>
    )
}


export default Feature;