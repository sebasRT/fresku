import Form from "@/components/Signup/Form";
import { Coiny } from "next/font/google";
import styles from "./noSession.module.scss";

const coiny = Coiny({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

function NoSession() {
  return (
    <section className={styles.noHistoryPage}>
      <h1>
        Sin <i className={coiny.className}>Domis</i> guardados
      </h1>
      <p>
        <label htmlFor="name">Crea cuenta</label> para guardar y ver tu
        historial
      </p>
      <Form />
    </section>
  );
}

export default NoSession;
