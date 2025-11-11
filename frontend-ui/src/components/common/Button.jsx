export default function Button({ children, className = "", ...props }) {
    return (
        <button
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
