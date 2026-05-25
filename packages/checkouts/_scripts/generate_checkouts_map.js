const fs = require("fs");
const path = require("path");

const checkoutsDir = path.resolve(__dirname, "../src");

function isValidCheckoutDir(dir) {
  const fullPath = path.join(checkoutsDir, dir);
  return (
    fs.statSync(fullPath).isDirectory() &&
    fs.existsSync(path.join(fullPath, "index.tsx"))
  );
}

const folders = fs.readdirSync(checkoutsDir).filter(isValidCheckoutDir);
const checkoutKeys = folders.map((folder) => `"${folder}"`).join(" | ");
const keyArray = folders.map((f) => `"${f}"`).join(", ");

const content = `
// 🚨 Archivo generado automáticamente. No editar manualmente.

import type { ComponentType } from "react";

export type CheckoutKey = ${checkoutKeys};

const validKeys = [${keyArray}] as const;

export function isCheckoutKey(key: string): key is CheckoutKey {
  return (validKeys as readonly string[]).includes(key);
}

export async function getCheckout(key: CheckoutKey): Promise<ComponentType<any> | null> {
  try {
    const module = await import(\`./\${key}\`);
    return module.default;
  } catch (error) {
    console.error(\`Error loading checkout component: \${key}\`, error);
    return await import("./default").then((m) => m.default);
  }
}
`;

fs.writeFileSync(path.join(checkoutsDir, "index.ts"), content);
console.log("✅ Generated checkoutsMap.ts dynamically.");
