function formatPrice(value: number) {
    const formattedNumber = Number(value).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
    return formattedNumber;
}

function firstToUppercase(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export { firstToUppercase, formatPrice };

