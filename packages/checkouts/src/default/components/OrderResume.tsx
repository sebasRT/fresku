import { useBarcodeSubtotal } from "@fresku/stores/cart/barcode";
import { useFruverSubtotal } from "@fresku/stores/cart/fruver";
import { formatPrice } from "@fresku/utils/functions/strings";
import { useStep } from "../hooks";
import styles from "./orderResume.module.scss";

const OrderResume = ({ step }: { step: number }) => {
  const { step: current } = useStep();
  const barcodeSubtotal = useBarcodeSubtotal();
  const fruverSubtotal = useFruverSubtotal();
  const deliveryFee = 1500;
  const subtotal = barcodeSubtotal + fruverSubtotal;
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

      <button className={styles.confirmButton}>Confirmar pedido</button>
    </div>
  );
};

export default OrderResume;
