import { Category, Subcategory } from "./types";

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

const SUBCATEGORIES: Record<Subcategory, string> = {
    // 🥖 alimentos_basicos
    parva: "Parva",
    arepas: "Arepas",
    granos: "Granos",
    lacteos: "Lácteos",
    enlatados: "Enlatados",
    harinas_y_cereales: "Harinas y cereales",
    aceites_y_untables: "Aceites y untables",
    condimentos: "Condimentos",
    cafe_y_chocolate: "Café y chocolate",
    pulverizados: "Pulverizados",
    otros: "Otros",

    // 🥩 carnicos
    carnes_rojas: "Carnes rojas",
    carnes_blancas: "Carnes blancas",
    embutidos: "Embutidos",
    procesados: "Procesados",

    // 🍎 frutas_y_verduras
    frutas: "Frutas",
    verduras: "Verduras",
    legumbres: "Legumbres",
    frutos_secos: "Frutas secos",
    refrigeradas: "Refrigeradas",

    // 🧼 cuidado_e_higiene
    crema_dental: "Crema dental",
    jabon: "Jabón",
    shampoo_y_acondicionador: "Shampoo y acondicionador",
    desodorante: "Desodorante",
    toallas_higienicas: "Toallas higiénicas",
    cepillo_de_dientes: "Cepillo de dientes",
    papel_higienico: "Papel higiénico",
    afeitado_y_rasuradoras: "Afeitado y rasuradoras",
    cuidado_bucal: "Cuidado bucal",
    cuidado_del_cabello: "Cuidado del cabello",

    // 🍪 mecato
    lonchera: "Lonchera",
    paquetes: "Paquetes",
    helados: "Helados",
    gomitas: "Gomitas",
    chocolates: "Chocolates",
    galletas: "Galletas",
    snacks: "Snacks",
    dulces: "Dulces",
    ponques: "Ponqués",

    // 🍾 licor
    cerveza: "Cerveza",
    ron: "Ron",
    aguardiente: "Aguardiente",
    vino: "Vino",
    whisky: "Whisky",
    tequila: "Tequila",
    vodka: "Vodka",
    champana: "Champaña",

    // 🧹 aseo
    productos_de_limpieza: "Productos de limpieza",
    utensilios_de_limpieza: "Utensilios de limpieza",
    ambientadores: "Ambientadores",
    cuidado_de_ropa: "Cuidado de ropa",
    bolsas_de_basura: "Bolsas de basura",

    // 🥤 bebidas
    gaseosas: "Gaseosas",
    jugos: "Jugos",
    energeticas: "Energéticas",
    hidratantes: "Hidratantes",
    refrescos_instantaneos: "Refrescos instantáneos",
    lacteas: "Lácteas",

    // 🐶 mascotas
    juguetes: "Juguetes",
    alimento: "Alimento",
    accesorios: "Accesorios",
    ropa: "Ropa",
    higiene_y_cuidado: "Higiene y cuidado",

    // 🎁 otra
    tecnologia: "Tecnología",
    papeleria: "Papelería",
    farmacia: "Farmacia",
    decoracion: "Decoración",
    iluminacion: "Iluminación",
    herramientas: "Herramientas",
    desechables: "Desechables",
    deportes: "Deportes",
    reposteria: "Repostería",
};

export { CATEGORIES, SUBCATEGORIES };

