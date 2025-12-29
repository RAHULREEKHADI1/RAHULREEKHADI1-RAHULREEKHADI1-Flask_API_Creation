"use client"
import Home from "@/app/page";
import { useRouter } from "next/navigation";

interface HeaderProps {
    showSignUp?: boolean,
    showPricing?:boolean,
    showHome?:boolean
}

export default function Header({ showSignUp = true,showPricing=true,showHome=false }: HeaderProps) {

    const router = useRouter();
    const handleSignup = () => {
        router.push("/signup")
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center sm:justify-between">
                <div className="flex items-center gap-2 pb-4 sm:pb-0">
                    <img src="/images/revolutionize_logo.png" alt="company_logo" className="h-8 md:h-10 lg:h-12 cursor-pointer" />
                    <h3 className="text-white font-medium md:font-semibold text-md md:text-xl lg:text-2xl cursor-pointer ">REVOLUTIONIZE AI</h3>
                </div>
                <div>
                    <div className="flex text-[#789DA9] text-md md:text-lg font-medium gap-6 lg:gap-14">
                        {showHome && <p className="py-1 px-2 hover:scale-110 transform transition-transform duration-300  cursor-pointer" onClick={() => router.push('/')}>Home</p>}
                        <p className="py-1 px-2 hover:scale-110 transform transition-transform duration-300  cursor-pointer">Feature</p>
                        {showPricing && <p className="py-1 px-2 hover:scale-110 transform transition-transform duration-300  cursor-pointer" onClick={()=>{router.push('/pricing')}}>Pricing</p>}
                        <p className="py-1 px-2 hover:scale-110 transform transition-transform duration-300  cursor-pointer">Blog</p>
                        {showSignUp && <button className="py-1 px-4 bg-[#F47C3E] text-white rounded-md hover:shadow-lg hover:shadow-orange-500 hover:bg-orange-500 hover:scale-105 transform transition duration-300" onClick={handleSignup}>Sign up</button>}
                    </div>
                </div>
            </div>
            <div className={`hidden sm:flex items-center ${showSignUp ? "py-10":"py-4"}`}>
                <div className="h-1 bg-[#538B8F]" style={{ width: "fit-content" }}>
                    <div className="flex items-center gap-2 opacity-0">
                        <img src="/images/revolutionize_logo.png" className="h-8 md:h-10 lg:h-12" />
                        <h3 className="text-md md:text-xl lg:text-2xl">REVOLUTIONIZE AI</h3>
                    </div>
                </div>
                <div className="flex-1 h-1 bg-[#262A35]" />
            </div>
        </div>
    )
}