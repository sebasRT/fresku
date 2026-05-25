import { formatPrice } from "@fresku/utils/functions/strings";
import useResume from "../hooks/useResume";
import useStep from "../hooks/useStep";
import styles from "./orderResume.module.scss";

const Resume = ({ step }: { step: number }) => {
  const { subtotal, deliveryFee } = useResume();
  const { step: current } = useStep();

  if (current < step) return null;
  return (
    <div className={styles.resume}>
      <p className={styles.sum}>
        <span>
          Subtotal: <strong>{formatPrice(subtotal)}</strong>
        </span>
        <strong>+</strong>
        <span>
          Domicilio: <strong>{formatPrice(deliveryFee)}</strong>
        </span>
      </p>

      <span className={styles.total}>
        <span>Total</span>
        <strong>{formatPrice(subtotal + deliveryFee)}</strong>
      </span>

      <p className={styles.note}>
        <strong>Nota:</strong> El precio puede variar dependiendo de la
        disponibilidad de los productos.
      </p>

      <button
        type="submit"
        className={styles.confirmButton}
        disabled={subtotal === 0}
      >
        Confirmar pedido
      </button>
    </div>
  );
};

export default Resume;
