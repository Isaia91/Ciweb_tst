import Navbar from "./Navbar.jsx";


export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
            <footer className="text-center text-xs text-gray-500 py-6">
                © {new Date().getFullYear()} ArticlesApp
            </footer>
        </div>
    );
}
