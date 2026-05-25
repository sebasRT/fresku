"use client";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import useStep from "../hooks/useStep";
import { neighborhoods } from "../utils/consts";
import styles from "./checkoutForm.module.scss";
import { Checkout } from "./checkoutResolver";
import Input from "./Input";

const Address = ({ step }: { step: number }) => {
  const { step: current } = useStep();
  if (current < step) return null;

  return (
    <>
      <Neighborhood step={step} />
      <Input
        label="Direccion"
        name="address"
        placeholder="Cll o Cra y numero"
        step={step + 1}
        required
        autoFocus={current === step}
      />
    </>
  );
};

const Neighborhood = ({ step }: { step: number }) => {
  const name = "neighborhood";

  const {
    formState: { errors },
    getFieldState,
    register,
  } = useFormContext<Checkout>();

  const valid = getFieldState(name).isDirty && !getFieldState(name).invalid;

  return (
    <label
      htmlFor=""
      className={clsx([
        styles.input,
        errors[name] && styles.invalid,
        !errors[name] && valid && styles.valid,
      ])}
    >
      <span>Barrio</span>
      <input type="text" list="neighborhoods" {...register(name)} />
      <datalist id="neighborhoods">
        {neighborhoods.map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      {errors[name] && <span>{errors[name].message}</span>}
    </label>
  );
};

export default Address;
