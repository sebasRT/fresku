const reglasDeMedidaProductos = {
    reglasGenerales: [
        "Usa espacio entre el número y la unidad. Ejemplo: '300 g', '3 ud'",
        "Usa abreviaciones estándar y sin punto final: 'g', 'kg', 'ud', 'uds'",
        "Evita pluralizar mal: ❌ 'kgs', 'grs', 'und.'",
        "Combina unidades de medida y cantidad de forma clara.",
        "Usa minúsculas en todas las unidades, excepto 'L' si se usan líquidos",
    ],
    unidadesPermitidas: {
        cantidad: ["ud", "uds", "pqt", "cj", "dz"],
        peso: ["g", "kg", "mg", "L", "ml", "cl"],
    },
    formatosCombinados: {
        porUnidad: [
            "3 ud × 50 g",
            "12 uds × 100 g",
            "1 ud × 250 g"
        ],
        pesoTotalPorUnidad: [
            "150 g / 3 ud",
            "1 kg / 2 uds"
        ]
    },
    ejemplos: [
        { producto: "Azúcar en bolsa", formato: "1 kg" },
        { producto: "Yogures individuales", formato: "4 ud × 125 g" },
        { producto: "Galletas", formato: "150 g / 3 ud" },
        { producto: "Queso por pieza", formato: "1 ud × 250 g" },
        { producto: "Frutos secos en pack", formato: "3 uds × 50 g" },
        { producto: "Harina paquete grande", formato: "5 kg" }
    ]
};

const reglasNombresProductos = {
    reglasGenerales: [
        "Usa nombres simples, claros y sin abreviaturas innecesarias.",
        "Mayúsculas para palabras clave del nombre y la primer letra.",
        "Evita caracteres especiales (#, /, %, etc.), a menos que sean parte del nombre oficial.",
        "No repitas información como cantidad o peso en el nombre (eso va en el campo de unidades).",
        "No incluyas la marca en el nombre del producto, salvo que sea parte esencial del nombre comercial.",
        "Evita términos ambiguos o genéricos como 'producto', 'cosa', 'varios'.",
        "No uses descripciones largas o frases completas. Ejemplo: ❌ 'Un paquete de arroz de buena calidad'."
    ],
    estructuraSugerida: [
        "Nombre base + Variante o tipo",
        "Ejemplo: 'Yogur Natural', 'Arroz largo fino', 'Pan integral molde'"
    ],
    ejemplosCorrectos: [
        "Pan Blanco",
        "Leche Entera",
        "Yogur Natural",
        "Galletas de Avena",
        "Arroz Largo fino",
        "Harina de Trigo"
    ],
    marcas: [
        "No incluyas la marca en el nombre del producto, salvo que sea parte esencial del nombre comercial.",
        "Si la marca es esencial, colócala al final: 'Galletas María - Marca X'.",
        "Evita marcas genéricas o poco conocidas a menos que sean relevantes para el producto."
    ]
};

const reglasMarcaDelProducto = {
    reglasGenerales: [
        "Puedes encontrar la marca en nombre del producto.",
        "Evita abreviaturas o versiones cortas del nombre de la marca.",
        "No uses caracteres especiales o puntuación innecesaria.",
        "Siempre utiliza Title Case (Primera letra en mayúscula) para la marca.",
    ],
};

const reglasSearchString = {
    reglasGenerales: [
        "Usa un formato simple y directo, sin caracteres especiales.",
        "Evita redundancias o información innecesaria.",
        "Usa minúsculas para todo el texto, excepto en nombres propios.",
        "Utiliza palabras clave y/o descripciones",
    ],
    ejemplos: [
        "leche entera 1L",
        "pan integral 500g",
        "yogur natural marca X 125g",
        "arroz largo fino 1kg"
    ]
}

export { reglasDeMedidaProductos, reglasMarcaDelProducto, reglasNombresProductos, reglasSearchString };

