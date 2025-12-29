"use client"
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  const handleSignup = ()=>{
    router.push("/signup")
  }
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/homepage_background.png')" }}>
      <div className="px-4 md:px-10 lg:px-16 py-10">
        <Header/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-16 items-center py-8 sm:py-6">
          <div>
            <h3 className="text-white font-semibold text-4xl md:text-6xl">Unleash Intelligent Design</h3>
            <p className="text-[#789DA9] mt-4 text-lg md:text-xl">
              Transform your website with AI-powered insights and automation.
            </p>
            <div className="mt-6 flex gap-4">
              <button className="bg-[#F47C3E] text-white rounded px-6 py-2 font-semibold hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500 hover:scale-105 transform transition duration-300"
              onClick={handleSignup}>
                START FREE TRIAL
              </button>
              <button className="border border-[#789DA9] text-white rounded hover:shadow-xl hover:shadow-[#225061] px-6 py-2 font-semibold hover:scale-105 transform transition duration-300">
                LEARN MORE
              </button>
            </div>
          </div>
          <div>
            <img
              src="/images/ai_image_home.jpeg"
              alt="AI illustration"
              className="w-full h-auto object-cover rounded-lg hover:shadow-xl hover:shadow-[#225061] hover:scale-105 transform transition duration-300"
            />
          </div>
        </div>
        <div>
          <div className="py-20 px-6 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="bg-linear-to-r from-[#225061] to-[#27304F] border border-[#789DA9] rounded-xl p-6 flex flex-col items-center text-center text-white hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:shadow-[#225061]">
              <img
                src="/images/smart_content_generation.png"
                alt="smart_content_generation"
                className="h-20 mb-4"
              />
              <h5 className="font-semibold text-xl md:text-2xl leading-snug mb-2">
                SMART CONTENT GENERATION
              </h5>
              <p className="text-[#B0C4CC] text-sm md:text-base">
                AI driven text and image creation
              </p>
            </div>

            <div className="bg-linear-to-r from-[#225061] to-[#27304F] border border-[#789DA9] rounded-xl p-6 flex flex-col items-center text-center text-white hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:shadow-[#225061]">
              <img
                src="/images/personalized_user_experience.png"
                alt="personalized_user_experience"
                className="h-20 mb-4"
              />
              <h5 className="font-semibold text-xl md:text-2xl leading-snug mb-2 wrap-break-words">
                PERSONALIZED USER EXPERIENCE
              </h5>
              <p className="text-[#B0C4CC] text-sm md:text-base">
                Tailor content for every visitor
              </p>
            </div>

            <div className="bg-linear-to-r from-[#225061] to-[#27304F] border border-[#789DA9] rounded-xl p-6 flex flex-col items-center text-center text-white hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:shadow-[#225061]">
              <img
                src="/images/automated_optimization.png"
                alt="automated_optimization"
                className="h-20 mb-4"
              />
              <h5 className="font-semibold text-xl md:text-2xl leading-snug mb-2">
                AUTOMATED OPTIMIZATION
              </h5>
              <p className="text-[#B0C4CC] text-sm md:text-base">
                Boost performance effortlessly
              </p>
            </div>
          </div>

        </div>
        <div className="py-16 px-6 md:px-16 text-center">

          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-snug md:leading-tight mb-6">
            Your digital twin solution <br className="hidden md:block" /> with AI model
          </h2>

          <p className="text-[#B0C4CC] text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Grow smarter, grow faster. Find the right solutions at the right place. At Smarttrak, we empower your digital needs efficiently.
          </p>

          <button className="bg-linear-to-r from-[#225061] to-[#27304F] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:scale-105 transform transition duration-300 cursor-pointer"
          onClick={handleSignup}>
            Get Started &rarr;
          </button>
        </div>
        <div className="py-16 px-6 md:px-16 bg-linear-to-r from-[#225061] to-[#27304F] border border-[#789DA9] rounded-xl text-center">
          <div className="mb-12 text-white">
            <p className="text-[#789DA9] uppercase tracking-wider mb-2">Testimonials</p>
            <h4 className="text-3xl md:text-4xl font-bold">Our Client Review</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1E2A3A] p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300">
              <img
                src="/images/testimonials_1.jpeg"
                alt="Client 1"
                className="h-20 w-20 rounded-full mb-4 object-cover"
              />
              <h5 className="text-white font-semibold mb-2">John Doe</h5>
              <p className="text-[#B0C4CC] text-sm md:text-base">
                "Smarttrak transformed our digital presence. Highly recommend their AI solutions!"
              </p>
            </div>

            <div className="bg-[#1E2A3A] p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300">
              <img
                src="/images/testimonials_2.jpeg"
                alt="Client 2"
                className="h-20 w-20 rounded-full mb-4 object-cover"
              />
              <h5 className="text-white font-semibold mb-2">Jane Smith</h5>
              <p className="text-[#B0C4CC] text-sm md:text-base">
                "The AI tools boosted our efficiency and personalized our user experience brilliantly."
              </p>
            </div>

            <div className="bg-[#1E2A3A] p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300">
              <img
                src="/images/testimonials_3.jpeg"
                alt="Client 3"
                className="h-20 w-20 rounded-full mb-4 object-cover"
              />
              <h5 className="text-white font-semibold mb-2">Michael Lee</h5>
              <p className="text-[#B0C4CC] text-sm md:text-base">
                "Incredible digital twin solutions. The team at Smarttrak is very professional."
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between py-8 md:py-12 px-6 md:px-16 gap-6 md:gap-0">
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
            onClick={handleSignup}>
              Sign Up For Free
            </button>
          </div>
        </div>

        <Footer/>

      </div>
    </div>
  );
}
