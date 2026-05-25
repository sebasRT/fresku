import { FruverProduct } from "@fresku/model/products/fruver";
import { UNIT_TO_GRAMS } from "./parsing";

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
            return Math.round(pricePerGram * UNIT_TO_GRAMS[unit] * unitQuantity);
        case "unit":
            return Math.round(pricePerGram * avrWeight);
        default:
            return Math.round(pricePerGram * UNIT_TO_GRAMS[unit] * unitQuantity);
    }
}

const getFruverLabels = (product: FruverProduct) => {
    const price = getLabelPrice(product);
    const measure = getLabelMeasure(product);
    return { price, measure };
}

export { getFruverLabels, getLabelMeasure, getLabelPrice };

