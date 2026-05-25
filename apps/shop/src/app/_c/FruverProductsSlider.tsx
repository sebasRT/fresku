import { Card } from "@/components/products/fruver/Card";
import { getFruverSamples } from "@/lib/mongo/products/fruver";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import styles from "./productSlider.module.scss";

const ProductsSlider = async ({ domain }: { domain: string }) => {
  const products = await getFruverSamples(domain, 15);

  if (products.length < 1) {
    return null;
  }
  
  return (
    <section className={styles.productsSlider}>
      <div className={styles.header}>
        <h2>Fruver</h2>
        <Link href={"/fruver"} className={styles.link}>
          <p>Ver más</p> <IoIosArrowForward />{" "}
        </Link>
      </div>
      <div className={styles.sliderContainer}>
        <div className={styles.sliderGrid}>
          {products.map((product, index) => (
            <Card product={product} key={product.name + index} size="normal" />
          ))}
          <Link href={"/fruver"} className={styles.link}>
          <p>Ver más</p> <IoIosArrowForward />{" "}
        </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSlider;
