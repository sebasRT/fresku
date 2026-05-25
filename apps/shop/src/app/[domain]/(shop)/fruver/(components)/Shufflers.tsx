import {
  FRUVER_CATEGORIES,
  fruverCategories,
  FruverCategory,
  FruverSubcategory,
} from "@/utils/consts/fruver";
import { firstToUppercase } from "@/utils/functions/strings";
import Link from "next/link";
import { MdArrowDropDown } from "react-icons/md";
import styles from "./(styles)/shufflers.module.scss";

const Shufflers = ({
  category
}: {
  category: FruverCategory;
  subcategory?: FruverSubcategory;
}) => {
  return (
    <nav className={styles.shufflers}>
      <div className={styles.selector}>
        <button>
          <span>{firstToUppercase(FRUVER_CATEGORIES[category])}</span>
          <MdArrowDropDown />
        </button>
        <ul className={styles.options}>
          {fruverCategories.map((cat, i) => (
            <li key={cat + i}>
              <Link href={`/fruver/${cat}`} replace>
                {firstToUppercase(FRUVER_CATEGORIES[cat])}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Shufflers;
