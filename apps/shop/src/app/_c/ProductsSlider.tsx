import IllusBebidas from "@/assets/illus/categories/bebidas";
import IllusCanastaFamiliar from "@/assets/illus/categories/canastaF";
import IllusLicor from "@/assets/illus/categories/licor";
import IllusMascotas from "@/assets/illus/categories/mascotas";
import IllusMecato from "@/assets/illus/categories/mecato";
import { Card } from "@/components/products/barcode/Card";
import { getSamplesByCategory } from "@/lib/mongo/products/barcode";
import { CATEGORIES, Category } from "@/utils/consts/barcode";
import { firstToUppercase } from "@/utils/functions/strings";
import Link from "next/link";
import { ReactNode } from "react";
import { IoIosArrowForward } from "react-icons/io";
import styles from "./productSlider.module.scss";

const ProductsSlider = async ({
  category,
  domain,
}: {
  category: Category;
  domain: string;
}) => {
  const products = await getSamplesByCategory(category, domain, 15);
  const Icon: { [k in Category]?: ReactNode } = {
    alimentos_basicos: <IllusCanastaFamiliar />,
    bebidas: <IllusBebidas />,
    mecato: <IllusMecato />,
    mascotas: <IllusMascotas />,
    licor: <IllusLicor />,
  };

  return (
    <section className={styles.productsSlider}>
      <div className={styles.header}>
        <h2>{firstToUppercase(CATEGORIES[category])}</h2>
        <Link href={`/${category}`} scroll className={styles.link}>
          <p>Ver más</p> <IoIosArrowForward />{" "}
        </Link>
      </div>
      <div className={styles.sliderContainer}>
        <div className={styles.sliderGrid}>
          {Icon[category] && (
            <Link href={`/${category}`} className={styles.iconLink}>
              {Icon[category]}
            </Link>
          )}
          {products
            .filter((product) => product.category === category)
            .map((product) => (
              <Card product={product} key={product.barcode} size="normal" />
            ))}

          <Link href={`/${category}`} className={styles.link}>
            <p>Ver más</p> <IoIosArrowForward />{" "}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSlider;
