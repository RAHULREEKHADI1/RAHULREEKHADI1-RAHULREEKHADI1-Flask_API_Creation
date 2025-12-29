export default function Footer(){
    return (
        <footer className="bg-linear-to-r from-[#225061] to-[#27304F] border border-[#789DA9] text-white">
          <div className="border-t border-[#789DA9] w-full"></div>

          <div className="py-12 px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <img src="/images/revolutionize_logo.png" alt="logo" className="h-10" />
                <span className="font-semibold text-lg">REVOLUTIONIZE AI</span>
              </div>
              <p className="text-[#B0C4CC] text-sm md:text-base">
                Visualize product ideas fast and easy with AI. Empowering your digital solutions.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h5 className="font-semibold text-lg mb-2">Quick Links</h5>
              <a href="#" className="text-[#B0C4CC] hover:text-white transition-colors">Home</a>
              <a href="#" className="text-[#B0C4CC] hover:text-white transition-colors">Features</a>
              <a href="#" className="text-[#B0C4CC] hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-[#B0C4CC] hover:text-white transition-colors">Contact</a>
            </div>

            <div className="flex flex-col gap-3">
              <h5 className="font-semibold text-lg mb-2">Contact Us</h5>
              <p className="text-[#B0C4CC] text-sm md:text-base">info@revolutionize.ai</p>
              <p className="text-[#B0C4CC] text-sm md:text-base">+1 234 567 890</p>
              <div className="flex gap-4 mt-2">
                <a href="#" className="text-[#B0C4CC] hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-[#B0C4CC] hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-[#B0C4CC] hover:text-white transition-colors">Facebook</a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#789DA9] mt-8 py-4 text-center text-[#B0C4CC] text-sm">
            &copy; {new Date().getFullYear()} REVOLUTIONIZE AI. All rights reserved.
          </div>
        </footer>
    )
}