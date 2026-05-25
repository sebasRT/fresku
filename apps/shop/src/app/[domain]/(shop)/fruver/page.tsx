import { Card } from "@/components/products/fruver/Card";
import { getFruverFeatured } from "@/lib/mongo/products/fruver";
import styles from "./page.module.scss";
const page = async ({ params }: { params: Promise<{ domain: string }> }) => {
  const { domain } = await params;
  const featuredProducts = await getFruverFeatured(domain, 10);

  return (
    <main className={styles.fruverMainPage}>
      <h2>Destacados</h2>
      <section>
        {featuredProducts.map((product, index) => (
          <Card product={product} key={product.sku + index} size="normal" />
        ))}
      </section>
    </main>
  );
};

export default page;
