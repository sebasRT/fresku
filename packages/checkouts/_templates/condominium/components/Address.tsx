"use client";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { units } from "../utils/consts";
import useResume from "../hooks/useResume";
import useStep from "../hooks/useStep";
import styles from "./checkoutForm.module.scss";
import { Checkout } from "./checkoutResolver";
import Input from "./Input";

const Address = ({ step }: { step: number }) => {
  const { step: current } = useStep();
  if (current < step) return null;

  return (
    <>
      <UnitSelector step={step} />
      <div className={styles.buildingAndApto}>
        <Input
          label="Torre"
          name="building"
          type="number"
          inputMode="numeric"
          placeholder="Torre"
          step={step + 1}
          required
          autoFocus={current === step}
        />
        <Input
          label="Apto"
          name="apto"
          type="number"
          placeholder="Apto"
          inputMode="numeric"
          step={step + 2}
          required
        />
      </div>
    </>
  );
};

const UnitSelector = ({ step }: { step: number }) => {
  const { step: current, nextStep } = useStep();
  const { setUnit } = useResume();
  const {
    register,
    formState: { errors },
    getFieldState,
    getValues,
    trigger,
  } = useFormContext<Checkout>();

  const name = "unit";
  const valid = getFieldState(name).isDirty && !getFieldState(name).invalid;

  const confirmValidity = async () => {
    const valid = await trigger(name);
    setUnit(getValues(name));

    if (valid) {
      nextStep();
    }
  };

  return (
    <label
      htmlFor=""
      className={clsx([
        styles.input,
        errors[name] && styles.invalid,
        !errors[name] && valid && styles.valid,
      ])}
    >
      <span>Unidad</span>
      <select
        {...register(name, {
          onChange: () => {
            confirmValidity();
          },
        })}
        defaultValue=""
        autoFocus={current === step}
      >
        <option value="" disabled>
          En qué unidad vives?
        </option>
        {units.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
      {errors[name] && <span>{errors[name].message}</span>}
    </label>
  );
};

export default Address;
