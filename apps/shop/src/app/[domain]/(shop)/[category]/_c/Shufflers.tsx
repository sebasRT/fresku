"use client";
import { categories, CATEGORIES, Category } from "@/utils/consts/barcode";
import { firstToUppercase } from "@/utils/functions/strings";
import { subcategories } from "@fresku/utils/products/barcode/consts";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import styles from "./shufflers.module.scss";
import { useFilters } from "./useFilters";
const Shufflers = () => {
  const category = useParams<{
    category: Category;
  }>().category;

  return (
    <nav className={styles.shufflers} key={category}>
      <div className={styles.selector}>
        <button>
          <span>{firstToUppercase(CATEGORIES[category])}</span>
          <MdArrowDropDown />
        </button>
        <ul className={styles.options}>
          {categories.map((cat, i) => (
            <li key={cat + i}>
              <Link href={`/${cat}`} replace>
                {firstToUppercase(CATEGORIES[cat])}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <SubcategorySelector category={category} />
    </nav>
  );
};

const SubcategorySelector = ({ category }: { category: Category }) => {
  const [hiddenDropdown, setHidden] = useState(false);

  const { setFilter, filters, resetFilters } = useFilters();
  useEffect(() => {
    if (filters?.subcategory) {
      resetFilters();
    }
  }, [category]);

  const handleSetSubcategory = (subcategory: string | null) => {
    if (subcategory === filters?.subcategory) {
      resetFilters();
    }
    setFilter("subcategory", subcategory);
    setHidden(true);
  };

  return (
    <div className={styles.selector}>
      <button onClick={() => setHidden(false)} className={styles.button}>
        <span>{firstToUppercase(filters?.subcategory || "filtrar")}</span>
        <MdArrowDropDown />
      </button>
      <ul
        className={clsx(styles.options, styles.subOptions)}
        hidden={hiddenDropdown}
      >
        <li>
          <button onClick={() => resetFilters()}>Mostrar todos</button>
        </li>
        {subcategories[category].map((sub, i) => (
          <li key={sub + i}>
            <button
              onClick={() => {
                handleSetSubcategory(sub);
              }}
            >
              {firstToUppercase(sub)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shufflers;
