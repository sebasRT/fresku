
// 🚨 Archivo generado automáticamente. No editar manualmente.

import type { ComponentType } from "react";

export interface CheckoutProps {
  domain: string;
}

export type CheckoutKey = "default" | "la_argentina" | "montiara" | "sendero_verde" | "testing";

const validKeys = ["default", "la_argentina", "montiara", "sendero_verde", "testing"] as const;

export function isCheckoutKey(key: string): key is CheckoutKey {
  return (validKeys as readonly string[]).includes(key);
}

export async function getCheckout(key: CheckoutKey): Promise<ComponentType<CheckoutProps> | null> {
  try {
    const module = await import(`./${key}`);
    return module.default;
  } catch (error) {
    console.error(`Error loading checkout component: ${key}`, error);
    return await import("./default").then((m) => m.default);
  }
}
