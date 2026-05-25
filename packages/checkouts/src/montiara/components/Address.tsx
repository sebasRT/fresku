"use client";
import useStep from "../hooks/useStep";
import styles from "./checkoutForm.module.scss";
import Input from "./Input";

const Address = ({ step }: { step: number }) => {
  const { step: current } = useStep();
  if (current < step) return null;

  return (
    <div className={styles.buildingAndApto}>
      <Input
        label="Torre"
        name="building"
        type="number"
        inputMode="numeric"
        placeholder="Torre"
        step={step}
        required
        autoFocus={current === step}
      />
      <Input
        label="Apto"
        name="apto"
        type="number"
        placeholder="Apto"
        inputMode="numeric"
        step={step + 1}
        required
      />
    </div>
  );
};

export default Address;
