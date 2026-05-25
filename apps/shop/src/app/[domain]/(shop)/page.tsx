import FruverSlider from "@/app/_c/FruverProductsSlider";
import ProductsSlider from "@/app/_c/ProductsSlider";
import { getDomains, getSubdomains } from "@fresku/mongo/tenants/meta";

export const dynamicParams = false;

export async function generateStaticParams() {
  const subdomains = await getSubdomains();
  const domains = await getDomains();
  const allDomains = [...subdomains, ...domains];
  return allDomains.map((domain) => ({ domain: String(domain) }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  return (
    <div className="mt-10 mb-20 flex flex-col gap-10">
      <FruverSlider domain={domain} />
      <ProductsSlider domain={domain} category="alimentos_basicos" />
      <ProductsSlider domain={domain} category="mecato" />
      <ProductsSlider domain={domain} category="bebidas" />
      <ProductsSlider domain={domain} category="mascotas" />
    </div>
  );
}
