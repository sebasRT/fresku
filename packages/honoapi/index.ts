import { Hono } from 'hono';
import admin from './apps/admin';
import domis from './apps/domis';

const app = new Hono();

app.route("/admin", admin)
app.route("/domis", domis)
// Example route

export default app;
