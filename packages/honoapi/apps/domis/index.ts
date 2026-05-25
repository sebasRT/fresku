import { Hono } from "hono";
import auth from "./auth";
import notifications from "./notifications";
import orders from "./orders";

const domis = new Hono()

domis.route("/auth", auth)
domis.route("/orders", orders)
domis.route("/notifications", notifications)

export default domis