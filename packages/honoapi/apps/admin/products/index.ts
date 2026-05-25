import { Hono } from "hono";
import barcodeProducts from "./barcode";
import fruverProducts from "./fruver";

const products = new Hono()

products.route("/barcode", barcodeProducts)
products.route("/fruver", fruverProducts)

export default products