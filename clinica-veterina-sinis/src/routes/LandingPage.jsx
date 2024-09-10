
import Header from "../components/Header";
import Footer from "../components/Footer";

function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {/* Your main content here */}
            </main>
            <Footer />
        </div>
    )
}
export default LandingPage