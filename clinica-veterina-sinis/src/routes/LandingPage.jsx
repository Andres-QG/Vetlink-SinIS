
import Header from "../components/Header";
import Footer from "../components/Footer";

function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <h1 className="text-text2">
                    Bienvenido al landing
                </h1>
            </main>
            <Footer />
        </div>
    )
}
export default LandingPage