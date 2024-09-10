import Header from "../components/Header";
import Footer from "../components/Footer";

function Login() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                Bienvenido al Login
            </main>
            <Footer />
        </div>
    )
}
export default Login