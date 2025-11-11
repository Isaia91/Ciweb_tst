import { NavLink } from "react-router-dom";


export default function Navbar() {
    const link = (to, label) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            {label}
        </NavLink>
    );


    return (
        <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">ArticlesApp</span>
                </div>
                <nav className="flex items-center gap-1">
                    {link("/", "Accueil")}
                    {link("/articles", "Articles")}
                </nav>
            </div>
        </header>
    );
}
