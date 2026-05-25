import { FruverProduct, fruverProduct } from "@/model/products/fruver";
import { FruverCategory, FruverSubcategory } from "./types";

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

const FRUVER_SUBCATEGORIES: Record<FruverSubcategory, string> = {
    tropicales: "Tropicales",
    citricas: "Cítricas",
    de_estacion: "De estación",
    exoticas: "Exóticas",
    de_hueso: "De hueso",
    de_pepita: "De pepita",
    de_bosque: "De bosque",
    de_hoja_verde: "De hoja verde",
    tuberculos: "Tubérculos",
    cruciferas: "Crucíferas",
    de_fruto: "De fruto",
    de_flor: "De flor",
    bulbos: "Bulbos",
    raiz_comestible: "Raíz comestible",
    frescas: "Frescas",
    cocidas_o_asadas: "Cocidas o asadas",
    rellenables: "Rellenables",
    aromaticas_frescas: "Aromáticas frescas",
    especias_secas: "Especias secas",
    mezclas_o_infusiones: "Mezclas o infusiones",
    secas: "Secas",
    procesadas: "Procesadas",
    frutos_secos: "Frutos secos",
    semillas: "Semillas",
    aceites_y_derivados: "Aceites y derivados",
    jugos_naturales: "Jugos naturales",
    mermeladas: "Mermeladas",
    frutas_deshidratadas: "Frutas deshidratadas",
    pulpas_congeladas: "Pulpas congeladas",
    "": "Otros",
}

const MEASURE_TO_GRAM = {
    "kg": 1000,
    "g": 1,
    "libra": 453.592,
}

function safeParseFruverProducts(rawProducts: any[]) {
    return rawProducts
        .map((product) => ({
            ...product,
            type: "barcode",
        }))
        .filter((product) => {
            const result = fruverProduct.safeParse(product);
            if (!result.success) {
                console.log("Failed to parse product:", product, "Error:", result.error.errors);
            }
            return result.success;
        }) as FruverProduct[];
}

export { FRUVER_CATEGORIES, FRUVER_SUBCATEGORIES, MEASURE_TO_GRAM, safeParseFruverProducts };

