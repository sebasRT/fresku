import styles from "@/styles/navigation/goToMain.module.scss";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

const GoToMain = () => {
  return (
    <Link href="/" className={styles.goToMain}>
      <MdArrowBack />
      <span>Inicio</span>
    </Link>
  );
};

export default GoToMain;
