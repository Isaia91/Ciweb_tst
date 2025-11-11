import { useEffect } from "react";


export default function Dialog({ open, onClose, title, children, footer }) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose?.();
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);


    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 grid place-items-center">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-[95vw] max-w-lg">
                <div className="px-4 py-3 border-b flex items-center justify-between">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
                </div>
                <div className="p-4">{children}</div>
                {footer && <div className="px-4 py-3 border-t bg-gray-50 flex justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
}
