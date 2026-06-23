import { Card } from "@/components/products/fruver/Card";
import { getFruverByCategory } from "@/lib/mongo/products/fruver";
import { FruverCategory } from "@/utils/consts/fruver";
import styles from "./page.module.scss";

const page = async ({
  params,
}: {
  params: Promise<{ domain: string; fruver_category: string[] }>;
}) => {
  const { domain, fruver_category } = await params;
  const [category] = fruver_category as [FruverCategory];

  const products = await getFruverByCategory(domain, category);

  return (
    <section className={styles.productsList}>
      {products.map((product, index) => (
        <Card product={product} key={product.sku + index} size="normal" />
      ))}
    </section>
  );
};

export default page;
