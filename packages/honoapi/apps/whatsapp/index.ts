import { Hono } from "hono";
import webhook from "./webhook";

const whatsapp = new Hono();

whatsapp.route("/webhook", webhook);

export default whatsapp;
