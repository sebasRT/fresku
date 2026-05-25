import { FruverProduct } from "@fresku/model/products/fruver";
import { measureConversionsToGrams } from "../consts/fruver";

const getLabelMeasure = (product: FruverProduct) => {
    const { sellingFormat, unit, unitQuantity, avrWeight } = product
    switch (sellingFormat) {
        case "weight":
            return `${unitQuantity} ${unit + (unitQuantity > 1 && unit === "libra" ? "s" : "")}`;
        case "unit":
            return `${avrWeight} g / 1`;
        default:
            return `${unitQuantity} ${unit + (unitQuantity > 1 ? "s" : "")}`;
    }
};

const getLabelPrice = (product: FruverProduct) => {
    const { sellingFormat, pricePerGram, unit, unitQuantity, avrWeight } = product

    switch (sellingFormat) {
        case "weight":
            return pricePerGram * measureConversionsToGrams[unit] * unitQuantity;
        case "unit":
            return pricePerGram * (avrWeight || 1);
        default:
            return pricePerGram * measureConversionsToGrams[unit] * unitQuantity;
    }
}

const getFruverLabels = (product: FruverProduct) => {
    const price = getLabelPrice(product);
    const measure = getLabelMeasure(product);
    return { price, measure };
}

export { getFruverLabels, getLabelMeasure, getLabelPrice };

