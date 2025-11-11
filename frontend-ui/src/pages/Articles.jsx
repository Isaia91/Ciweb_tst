import { useEffect, useMemo, useState } from "react";
import { listArticles, deleteArticle, exportCsvUrl, createArticle, updateArticle } from "../api";
import ArticleTable from "../components/article/ArticleTable.jsx";
import ArticleDialog from "../components/article/ArticleDialog.jsx";
import Button from "../components/common/Button.jsx";


export default function Articles() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [q, setQ] = useState("");


    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null); // article ou null


    const load = async () => {
        setLoading(true); setError(null);
        try {
            const { data } = await listArticles();
            setRows(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.response?.data || e.message);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => { load(); }, []);


    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase();
        if (!kw) return rows;
        return rows.filter((a) => [a.nom, a.famille?.nom, a.id?.toString()].some((v) => (v ?? "").toLowerCase().includes(kw)));
    }, [rows, q]);


    const onCreate = () => { setEditing(null); setDialogOpen(true); };
    const onEdit = (article) => { setEditing(article); setDialogOpen(true); };


    const onDelete = async (id) => {
        if (!confirm("Supprimer cet article ?")) return;
        await deleteArticle(id);
        await load();
    };


    const onSubmit = async (payload) => {
        if (editing) await updateArticle(editing.id, payload);
        else await createArticle(payload);
        setDialogOpen(false);
        await load();
    };


    return (
        <section className="grid gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative w-full sm:w-72">
                    <input
                        className="w-full border rounded-lg px-3 py-2 pl-9"
                        placeholder="Recherche (id, nom, famille)"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 ml-auto">
                    <a className="px-3 py-2 rounded-lg border hover:bg-gray-50" href={exportCsvUrl()} target="_blank" rel="noreferrer">Export CSV</a>
                    <Button onClick={load} disabled={loading}>Actualiser</Button>
                    <Button onClick={onCreate}>Nouvel article</Button>
                </div>
            </div>


            <ArticleTable rows={filtered} loading={loading} onEdit={onEdit} onDelete={onDelete} />


            <ArticleDialog open={dialogOpen} initial={editing} onClose={() => setDialogOpen(false)} onSubmit={onSubmit} />


            {error && (
                <pre className="p-3 rounded-lg bg-rose-50 text-rose-700 text-sm overflow-auto">{typeof error === "string" ? error : JSON.stringify(error, null, 2)}</pre>
            )}
        </section>
    );
}
