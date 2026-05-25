"use client"
import { formatPrice } from "@fresku/utils/functions/strings";
import { useEffect, useRef } from "react";
import useResume from "../hooks/useResume";
import useStep from "../hooks/useStep";
import styles from "./orderResume.module.scss";

const Resume = ({ step }: { step: number }) => {
  const scrollBottom = useRef<HTMLDivElement>(null);

  const { subtotal, deliveryFee } = useResume();
  const { step: current } = useStep();

  useEffect(() => {
    scrollBottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  if (current < step) return null;
  return (
    <div className={styles.resume}>
      {/* <p className={styles.sum}>
        <span>
          Subtotal: <strong>{formatPrice(subtotal)}</strong>
        </span>
        <strong>+</strong>
        <span>
          Domicilio: <strong>{formatPrice(deliveryFee)}</strong>
        </span>
      </p> */}

      <span className={styles.total}>
        <span>Subtotal</span>
        <strong>{formatPrice(subtotal
          // + deliveryFee
        )}</strong>
      </span>

      <p className={styles.note}>
        <strong>Nota:</strong> El precio del domicilio será informado a tu Whatsapp.
      </p>

      <button
        type="submit"
        className={styles.confirmButton}
        disabled={subtotal === 0}
      >
        Confirmar pedido
      </button>
      <div ref={scrollBottom} />
    </div>
  );
};

export default Resume;
