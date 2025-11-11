import { useEffect, useState } from "react";
import Dialog from "../common/Dialog.jsx";
import { listFamilles } from "../../api"; // <-- import

export default function ArticleDialog({ open, initial, onClose, onSubmit }) {
    const isEdit = Boolean(initial?.id);

    const [form, setForm] = useState({
        nom: "",
        prix_ht: "",
        prix_achat: "",
        taux_tgc: 3,
        famille_id: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // --- familles state ---
    const [familles, setFamilles] = useState([]);
    const [famillesLoading, setFamillesLoading] = useState(false);
    const [famillesError, setFamillesError] = useState(null);

    const loadFamilles = async () => {
        setFamillesLoading(true);
        setFamillesError(null);
        try {
            const { data } = await listFamilles();
            setFamilles(Array.isArray(data) ? data : []);
        } catch (e) {
            setFamillesError(e.response?.data || e.message);
            setFamilles([]);
        } finally {
            setFamillesLoading(false);
        }
    };

    useEffect(() => {
        if (!open) return;
        // précharge la liste des familles quand on ouvre le dialog
        loadFamilles();

        if (isEdit) {
            setForm({
                nom: initial.nom ?? "",
                prix_ht: String(initial.prix_ht ?? ""),
                prix_achat: String(initial.prix_achat ?? ""),
                taux_tgc: Number(initial.taux_tgc ?? 3),
                famille_id: String(initial.famille_id ?? ""),
            });
        } else {
            setForm({ nom: "", prix_ht: "", prix_achat: "", taux_tgc: 3, famille_id: "" });
        }
        setError(null);
    }, [open, isEdit, initial]);

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const toNum = (v) => {
        if (v === "" || v == null) return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            nom: form.nom.trim(),
            prix_ht: toNum(form.prix_ht),
            prix_achat: toNum(form.prix_achat),
            taux_tgc: toNum(form.taux_tgc),
            famille_id: form.famille_id ? parseInt(form.famille_id, 10) : null,
        };

        if (!payload.nom) return setError({ message: "Le nom est requis." });
        if (payload.prix_ht == null) return setError({ message: "Prix HT invalide." });
        if (payload.prix_achat == null) return setError({ message: "Prix d'achat invalide." });
        if (payload.taux_tgc == null) return setError({ message: "Taux TGC invalide." });

        try {
            setSaving(true);
            await onSubmit(payload);
        } catch (e) {
            setError(e.response?.data || e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={isEdit ? "Modifier l'article" : "Créer un article"}
            footer={
                <>
                    <button
                        className="px-3 py-2 rounded-lg border"
                        onClick={onClose}
                        disabled={saving}
                        type="button"
                    >
                        Annuler
                    </button>
                    <button
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={saving}
                        type="button"
                    >
                        {saving ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer"}
                    </button>
                </>
            }
        >
            {error && (
                <pre className="mb-3 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs overflow-auto">
          {typeof error === "string" ? error : JSON.stringify(error, null, 2)}
        </pre>
            )}

            <form onSubmit={handleSubmit} className="grid gap-3">
                <label className="grid gap-1">
                    <span>Nom</span>
                    <input
                        name="nom"
                        value={form.nom}
                        onChange={onChange}
                        className="border rounded-lg px-3 py-2"
                        required
                    />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="grid gap-1">
                        <span>Prix HT</span>
                        <input
                            name="prix_ht"
                            type="number"
                            step="0.01"
                            value={form.prix_ht}
                            onChange={onChange}
                            className="border rounded-lg px-3 py-2"
                            required
                        />
                    </label>

                    <label className="grid gap-1">
                        <span>Prix d'achat</span>
                        <input
                            name="prix_achat"
                            type="number"
                            step="0.01"
                            value={form.prix_achat}
                            onChange={onChange}
                            className="border rounded-lg px-3 py-2"
                            required
                        />
                    </label>

                    <label className="grid gap-1">
                        <span>Taux TGC</span>
                        <select
                            name="taux_tgc"
                            value={form.taux_tgc}
                            onChange={onChange}
                            className="border rounded-lg px-3 py-2"
                            required
                        >
                            {[3, 6, 11, 22].map((v) => (
                                <option key={v} value={v}>
                                    {v}%
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* --- Famille (liste déroulante) --- */}
                <div className="grid gap-1">
                    <div className="flex items-center justify-between">
                        <span>Famille</span>
                        <button
                            type="button"
                            className="text-xs text-blue-600"
                            onClick={loadFamilles}
                            disabled={famillesLoading}
                            title="Recharger la liste"
                        >
                            {famillesLoading ? "Chargement…" : "↻ Actualiser"}
                        </button>
                    </div>

                    {famillesError && (
                        <div className="text-xs text-rose-600 mb-1">
                            Impossible de charger les familles.
                        </div>
                    )}

                    <select
                        name="famille_id"
                        value={form.famille_id}
                        onChange={onChange}
                        className="border rounded-lg px-3 py-2"
                        required
                    >
                        <option value="" disabled>
                            {famillesLoading ? "Chargement…" : "— choisir —"}
                        </option>
                        {familles.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.nom}
                            </option>
                        ))}
                    </select>

                    {(!famillesLoading && familles.length === 0) && (
                        <div className="text-xs text-gray-500">
                            Aucune famille disponible. Créez des familles côté backend (ou via un seeder) puis actualisez.
                        </div>
                    )}
                </div>
            </form>
        </Dialog>
    );
}
