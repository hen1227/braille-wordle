export const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
export const fmtLocalYMD = (d: Date) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const STORAGE_PREFIX = "brailleWordle";
export const keyFor = (d: Date, field: "userInput" | "pastInputs" | "word") =>
    `${STORAGE_PREFIX}:${fmtLocalYMD(d)}:${field}`;

export const safeParse = <T,>(raw: string | null, fallback: T): T => {
    if (!raw) return fallback;
    try { return JSON.parse(raw) as T; } catch { return fallback; }
};
