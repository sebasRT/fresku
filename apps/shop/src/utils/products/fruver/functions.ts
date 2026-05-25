import { FruverProduct } from "@fresku/model/products/fruver";
import { MEASURE_TO_GRAM } from "./parsing";

const getLabelMeasure = (product: FruverProduct) => {
    const { sellingFormat, unit, unitQuantity, avrWeight } = product
    switch (sellingFormat) {
        case "weight":
            return `${unitQuantity} ${unit + (unitQuantity > 1 && unit === "libra" ? "s" : "")}`;
        case "unit":
            return `Unidad ${avrWeight} g`;
        default:
            return `${unitQuantity} ${unit + (unitQuantity > 1 ? "s" : "")}`;
    }
};

const getLabelPrice = (product: FruverProduct) => {
    const { sellingFormat, pricePerGram, unit, unitQuantity, avrWeight } = product

    switch (sellingFormat) {
        case "weight":
            return pricePerGram * MEASURE_TO_GRAM[unit] * unitQuantity;
        case "unit":
            return pricePerGram * avrWeight;
        default:
            return pricePerGram * MEASURE_TO_GRAM[unit] * unitQuantity;
    }
}

const getFruverLabels = (product: FruverProduct) => {
    const price = getLabelPrice(product);
    const measure = getLabelMeasure(product);
    return { price, measure };
}

export { getFruverLabels, getLabelMeasure, getLabelPrice };

