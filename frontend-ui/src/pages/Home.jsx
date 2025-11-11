import { Link } from "react-router-dom";
import pdf from "../assets/docs/Test_Technique_Laravel.pdf";

export default function Home() {
    return (
        <section className="grid gap-6">
            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-2">Bienvenue</h1>
                <p className="text-gray-600">
                    Gérer vos articles simplement : liste, création, modification, suppression et export CSV.
                </p>
                <div className="mt-4 flex gap-3">
                    <Link to="/articles" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                        Voir les articles
                    </Link>
                    <a
                        href="https://laravel.com/docs"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                    >
                        Docs Laravel ↗
                    </a>

                    <a href={pdf} target="_blank" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Voir l’énoncé</a>

                </div>
            </div>


            <div className="grid sm:grid-cols-3 gap-4">
                {["CRUD API", "Export CSV", "Front React"].map((t) => (
                    <div key={t} className="bg-white rounded-2xl border shadow-sm p-5">
                        <div className="text-sm text-gray-500">Module</div>
                        <div className="text-lg font-semibold">{t}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
