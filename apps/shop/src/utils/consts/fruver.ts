const fruverCategories = ["frutas", "verduras", "hortalizas", "aromaticas_y_especias", "legumbres", "frutos_secos_y_semillas", "procesados_y_derivados", "otros"] as const;
type FruverCategory = typeof fruverCategories[number];

const FRUVER_CATEGORIES: Record<FruverCategory, string> = {
    "frutas": "Frutas",
    "verduras": "Verduras",
    "hortalizas": "Hortalizas",
    "aromaticas_y_especias": "Aromáticas y especias",
    "legumbres": "Legumbres",
    "frutos_secos_y_semillas": "Frutos secos y semillas",
    "procesados_y_derivados": "Procesados y derivados",
    "otros": "Otros"
}

const fruverTags = {
    "frutas": [
        "tropicales",
        "cítricas",
        "de estación",
        "exóticas",
        "de hueso",
        "de pepita",
        "de bosque",
    ] as const,
    "verduras": [
        "de hoja verde",
        "tubérculos",
        "crucíferas",
        "de fruto",
        "de flor",
        "bulbos",
        "raíz comestible",
    ] as const,
    "hortalizas": [
        "frescas",
        "cocidas o asadas",
        "rellenables",
    ] as const,
    "aromaticas_y_especias": [
        "aromáticas frescas",
        "especias secas",
        "mezclas o infusiones"
    ] as const,
    "legumbres": [
        "secas",
        "frescas",
        "procesadas",
    ] as const,
    "frutos_secos_y_semillas": [
        "frutos secos",
        "semillas",
        "aceites y derivados",
    ] as const,
    "procesados_y_derivados": [
        "jugos naturales",
        "mermeladas",
        "frutas deshidratadas",
        "pulpas congeladas"
    ] as const,
    "otros": [
        ""
    ] as const,
} as const;

type FruverSubcategory = typeof fruverTags[keyof typeof fruverTags][number];
const measureUnits = ["kg", "g", "libra"] as const;

type MeasureUnit = typeof measureUnits[number];

const measureConversionsToGrams = {
    "kg": 1000,
    "g": 1,
    "libra": 453.592,
}

export { FRUVER_CATEGORIES, fruverCategories, fruverTags, measureConversionsToGrams, measureUnits, type FruverCategory, type FruverSubcategory, type MeasureUnit };

