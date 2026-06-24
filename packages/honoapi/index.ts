import { Hono } from 'hono';
import admin from './apps/admin';
import domis from './apps/domis';
import whatsapp from './apps/whatsapp';

const app = new Hono();

app.route("/admin", admin)
app.route("/domis", domis)
app.route("/whatsapp", whatsapp)
// Example route

export default app;
