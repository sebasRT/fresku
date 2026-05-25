import { Hono } from "hono";
import auth from "./auth";
import domers from "./domers";
import metadata from "./metadata";
import products from "./products/";

const admin = new Hono()

admin.route("/auth", auth)
admin.route("/domers", domers)
admin.route("/products", products)
admin.route("/metadata", metadata)

export default admin