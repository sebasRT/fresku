import { Category } from "./types";

const categories = ["alimentos_basicos", "cuidado_e_higiene", "mecato", "licor", "aseo", "bebidas", "carnicos", "frutas_y_verduras", "mascotas", "otra"] as const;
const subcategories: { [K in Category]: readonly string[]; } = {
    alimentos_basicos: [
        'parva',
        'arepas',
        'granos',
        'lacteos',
        'enlatados',
        'harinas_y_cereales',
        'aceites_y_untables',
        'condimentos',
        'cafe_y_chocolate',
        'pulverizados',
        'otros'
    ] as const,

    carnicos: [
        "carnes_rojas",
        "carnes_blancas",
        "embutidos",
        "procesados",
        "otros"
    ],
    frutas_y_verduras: [
        'frutas',
        'verduras',
        'legumbres',
        'frutos_secos',
        'refrigeradas',
        'otros'
    ],
    cuidado_e_higiene: [
        'crema_dental',
        'jabon',
        'shampoo_y_acondicionador',
        'desodorante',
        'toallas_higienicas',
        'cepillo_de_dientes',
        'papel_higienico',
        'afeitado_y_rasuradoras',
        'cuidado_bucal', // Incluye enjuague bucal e hilo dental
        'cuidado_del_cabello', // Incluye gel, cera y lociones
        'otros'
    ] as const,

    mecato: [
        'lonchera',
        'paquetes',
        'helados',
        'gomitas',
        'chocolates',
        'galletas',
        'snacks',
        'dulces',
        'ponques',
        'otros'
    ] as const,

    licor: [
        'cerveza',
        'ron',
        'aguardiente',
        'vino',
        'whisky',
        'tequila',
        'vodka',
        'champana',
        'otros'
    ] as const,

    aseo: [
        'productos_de_limpieza', // Incluye jabones, lavaloza, cloro, detergente, desinfectantes, etc.
        'utensilios_de_limpieza', // Incluye trapeadores, escobas, recogedores, guantes, esponjas
        'ambientadores',
        'cuidado_de_ropa',
        'bolsas_de_basura',
        'otros'
    ] as const,

    bebidas: [
        'gaseosas',
        'jugos',
        'energeticas',
        'hidratantes',
        'refrescos_instantaneos',
        'lacteas',
        'otros'
    ] as const,

    mascotas: [
        'juguetes',
        'alimento',
        'accesorios',
        'ropa',
        'higiene_y_cuidado',
        'otros'
    ] as const,

    otra: [
        'tecnologia',
        'papeleria',
        'farmacia',
        'decoracion',
        'iluminacion',
        'herramientas',
        'desechables',
        'deportes',
        'reposteria',
        'otros'
    ] as const
} as const;


export { categories, subcategories };

