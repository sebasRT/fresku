
const fruverCategories = ["frutas", "verduras", "hortalizas", "aromaticas_y_especias", "legumbres", "frutos_secos_y_semillas", "procesados_y_derivados", "otros"] as const;
const fruverTags = {
    frutas: [
        "tropicales",
        "citricas",
        "de_estacion",
        "exoticas",
        "de_hueso",
        "de_pepita",
        "de_bosque",
    ] as const,
    verduras: [
        "de_hoja_verde",
        "tuberculos",
        "cruciferas",
        "de_fruto",
        "de_flor",
        "bulbos",
        "raiz_comestible",
    ] as const,
    hortalizas: [
        "frescas",
        "cocidas_o_asadas",
        "rellenables",
    ] as const,
    aromaticas_y_especias: [
        "aromaticas_frescas",
        "especias_secas",
        "mezclas_o_infusiones"
    ] as const,
    legumbres: [
        "secas",
        "frescas",
        "procesadas",
    ] as const,
    frutos_secos_y_semillas: [
        "frutos_secos",
        "semillas",
        "aceites_y_derivados",
    ] as const,
    procesados_y_derivados: [
        "jugos_naturales",
        "mermeladas",
        "frutas_deshidratadas",
        "pulpas_congeladas"
    ] as const,
    otros: [
        ""
    ] as const,
} as const;

const measureUnits = ["kg", "g", "libra"] as const;

export { fruverCategories, fruverTags, measureUnits };

