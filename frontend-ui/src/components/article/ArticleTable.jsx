import { toMoney } from "../../utils/format.js";
import { Pencil, Trash2 } from "lucide-react";

export default function ArticleTable({ rows, loading, onEdit, onDelete }) {
    const SkeletonRow = () => (
        <tr className="border-b animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
                <td key={i} className="py-3 px-6">
                    <div className="h-3 bg-gray-200 rounded w-24" />
                </td>
            ))}
        </tr>
    );

    return (
        <div className="overflow-x-auto bg-white rounded-2xl border shadow-sm">
            <table className="min-w-full text-sm">
                <thead>
                <tr className="text-left border-b bg-gray-50">
                    {[
                        "Nom",
                        "Famille",
                        "HT",
                        "Achat",
                        "TGC %",
                        "TTC (calc)",
                        "Marge (calc)",
                        "Actions",
                    ].map((h) => (
                        <th key={h} className="py-3 px-6 text-gray-700 font-medium">
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                ) : rows.length === 0 ? (
                    <tr>
                        <td className="py-6 text-center text-gray-500" colSpan={8}>
                            Aucun article.
                        </td>
                    </tr>
                ) : (
                    rows.map((a) => {
                        const ht = Number(a.prix_ht) || 0;
                        const achat = Number(a.prix_achat) || 0;
                        const tgc = Number(a.taux_tgc) || 0;
                        const ttc = +(ht * (1 + tgc / 100)).toFixed(2);
                        const marge = +(ht - achat).toFixed(2);

                        return (
                            <tr
                                key={a.id}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-6 font-medium text-gray-800">
                                    {a.nom}
                                </td>
                                <td className="py-3 px-6 text-gray-600">
                                    {a.famille?.nom ?? "-"}
                                </td>
                                <td className="py-3 px-6">{toMoney(ht)}</td>
                                <td className="py-3 px-6">{toMoney(achat)}</td>
                                <td className="py-3 px-6">
                    <span className="inline-block min-w-12 text-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                      {tgc.toFixed(2)}%
                    </span>
                                </td>
                                <td className="py-3 px-6">{toMoney(ttc)}</td>
                                <td className="py-3 px-6">
                    <span
                        className={`px-2 py-0.5 rounded-md text-xs ${
                            marge >= 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                        }`}
                    >
                      {toMoney(marge)}
                    </span>
                                </td>
                                <td className="py-3 px-6">
                                    <div className="flex gap-3">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => onEdit(a)}
                                            title="Modifier"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            className="text-rose-600 hover:text-rose-800"
                                            onClick={() => onDelete(a.id)}
                                            title="Supprimer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
}
