import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";


const Blog: React.FC = () => {


    const tags = [
        { label: "Revolutionize News", color: "bg-purple-600" },
        { label: "AI design", color: "bg-blue-600" },
        { label: "Wireframing", color: "bg-green-600" },
        { label: "Mockups", color: "bg-pink-600" },
        { label: "UI Design", color: "bg-indigo-600" },
        { label: "UX Design", color: "bg-yellow-500" },
        { label: "Prototyping", color: "bg-red-600" },
        { label: "App Design", color: "bg-teal-600" },
    ];

    const blogPosts = [
        {
            title: "Mastering AI-Powered Wireframes",
            date: "Dec 20, 2025",
            readTime: "5 min read",
            image: "/images/blog_page_image1.png",
            category: "AI Design"
        },
        {
            title: "The Magic of Prototyping",
            date: "Oct 15, 2024",
            readTime: "3 min read",
            image: "/images/blog_page_image2.png",
            category: "Prototyping"
        },
        {
            title: "Color Theory in Modern UI",
            date: "Oct 24, 2023",
            readTime: "8 min read",
            image: "/images/blog_page_image3.png",
            category: "UI Design"
        },
        {
            title: "Future of UX: Voice Interfaces",
            date: "Oct 10, 2023",
            readTime: "6 min read",
            image: "/images/blog_page_image4.png",
            category: "UX Design"
        },
    ];


    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/homepage_background.png')" }}>
            <div className="px-4 md:px-10 lg:px-16 py-10">
                <Header showBlog={false} showHome={true} />
                <div className="flex flex-col gap-10 mt-10">
                    <div className="flex flex-col gap-10">
                        <h3 className="text-white text-4xl lg:text-6xl">Revolutionize AI Blog of Spells 🪄</h3>
                        <p className="text-white text-xl sm:leading-relaxed">Welcome to the official Uizard blog, where you can learn about all things design and read about all the latest magical Uizarding news. Whether you are a seasoned pro or a design newcomer, there is something for everyone in the Uizard Blog of Spells.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 sm:gap-4">
                        {tags.map((tag, i) => (
                            <span
                                key={i}
                                className={` sm:mx-4 px-4 py-2 text-xs sm:text-sm font-medium text-white rounded-full ${tag.color} transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-0.5 active:scale-95`}
                            >
                                {tag.label}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        {blogPosts.map((post, index) => (
                            <div key={index} className="group flex flex-col bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300">

                                <div className="relative h-48 w-full overflow-hidden shrink-0">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md">
                                        {post.date}
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-white/90 text-black text-[10px] font-bold px-2 py-1 rounded-md">
                                        {post.readTime}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">{post.category}</span>

                                    <div className="flex-1">
                                        <h4 className="text-white font-semibold text-lg mt-2 group-hover:text-purple-300 transition-colors">
                                            {post.title}
                                        </h4>
                                    </div>

                                    <button className="text-white/70 text-sm font-medium flex items-center gap-2 group-hover:text-white mt-auto">
                                        Read Spell
                                        <span className="transition-transform group-hover:translate-x-1">→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center items-center gap-2 mt-12 pb-6">
                        <button className="p-2 text-white/50 hover:text-white transition-colors">
                            <span className="sr-only">Previous</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {[1, 2, 3, 4].map((page) => (
                            <button
                                key={page}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all duration-300 
                        ${page === 1
                                        ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button className="p-2 text-white/50 hover:text-white transition-colors">
                            <span className="sr-only">Next</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <hr className="text-gray-200 h-1 my-4"/>
                    <Footer/>

                </div>
            </div>
        </div>
    )
}


export default Blog;