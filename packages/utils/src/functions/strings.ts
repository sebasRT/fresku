function formatPrice(value: number) {
    const formattedNumber = Number(value).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
    return formattedNumber;
}

function firstToUppercase(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function toTitleCase(value: string) {
    return value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
        .trim();
}

function toTenantDB(dbName: string): string {
    return dbName.startsWith('t_') ? dbName : `t_${dbName}`;
}

export { firstToUppercase, formatPrice, toTenantDB, toTitleCase };

