import Header from "@/components/ui/Header";



const dashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/homepage_background.png')" }}>
            <div className="px-4 md:px-10 lg:px-16 py-10">
                <Header />
            </div>
            <div className="flex flex-col items-center justify-center">
                <div className="text-3xl text-white">
                    You are logged in as a user
                </div>
            </div>
        </div>
    )
}
export default dashboard;