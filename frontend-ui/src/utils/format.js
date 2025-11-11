export const toMoney = (value, currency = "XPF") => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "-";
// XPF sans décimales, sinon change minimumFractionDigits
    return n.toLocaleString("fr-FR", {
        style: "currency",
        currency,
        minimumFractionDigits: currency === "XPF" ? 0 : 2,
    });
};
