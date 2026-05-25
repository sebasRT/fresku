const categories = ["alimentos_basicos", "cuidado_e_higiene", "mecato", "licor", "aseo", "bebidas", "carnicos", "frutas_y_verduras", "mascotas", "otra"] as const;
type Category = (typeof categories)[number];

const CATEGORIES: Record<Category, string> = {
    "alimentos_basicos": "alimentos básicos",
    "cuidado_e_higiene": "cuidado e higiene",
    "mecato": "mecato",
    "licor": "licor",
    "aseo": "aseo",
    "bebidas": "bebidas",
    "carnicos": "cárnicos",
    "frutas_y_verduras": "frutas y verduras",
    "mascotas": "mascotas",
    "otra": "otra"
} as const;

const subcategories: { [K in Category]: readonly string[]; } = {
    "alimentos_basicos": [
        'parva',
        'arepas',
        'granos',
        'lácteos',
        'enlatados',
        'harinas y cereales',
        'aceites y untables',
        'condimentos',
        'café y chocolate',
        'pulverizados',
        'otros'
    ] as const,

    "carnicos": [
        "carnes rojas",
        "carnes blancas",
        "embutidos",
        "procesados",
        "otros"
    ],
    "frutas_y_verduras": [
        'frutas',
        'verduras',
        'legumbres',
        'frutas secos',
        'refrigeradas',
        'otros'
    ],
    "cuidado_e_higiene": [
        'crema dental',
        'jabón',
        'shampoo y acondicionador',
        'desodorante',
        'toallas higiénicas',
        'cepillo de dientes',
        'papel higiénico',
        'afeitado y rasuradoras',
        'cuidado bucal', // Incluye enjuague bucal e hilo dental
        'cuidado del cabello', // Incluye gel, cera y lociones
        'otros'
    ] as const,

    "mecato": [
        'lonchera',
        'paquetes',
        'helados',
        'gomitas',
        'chocolates',
        'galletas',
        'snacks',
        'dulces',
        'ponqués',
        'otros'
    ] as const,

    "licor": [
        'cerveza',
        'ron',
        'aguardiente',
        'vino',
        'whisky',
        'tequila',
        'vodka',
        'champaña',
        'otros'
    ] as const,

    "aseo": [
        'productos de limpieza', // Incluye jabones, lavaloza, cloro, detergente, desinfectantes, etc.
        'utensilios de limpieza', // Incluye trapeadores, escobas, recogedores, guantes, esponjas
        'ambientadores',
        'cuidado de ropa',
        'bolsas de basura',
        'otros'
    ] as const,

    "bebidas": [
        'gaseosas',
        'jugos',
        'energéticas',
        'hidratantes',
        'refrescos instantáneos',
        'lácteas',
        'otros'
    ] as const,

    "mascotas": [
        'juguetes',
        'alimento',
        'accesorios',
        'ropa',
        'higiene y cuidado',
        'otros'
    ] as const,

    "otra": [
        'tecnología',
        'papelería',
        'farmacia',
        'decoración',
        'iluminación',
        'herramientas',
        'desechables',
        'deportes',
        'repostería',
        'otros'
    ] as const
} as const;

type Subcategory = typeof subcategories[Category][number];
export {
    CATEGORIES,
    categories,
    subcategories, type Category, type Subcategory
};

