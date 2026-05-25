"use client";
import clsx from "clsx";
import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import useStep from "../hooks/useStep";
import styles from "./checkoutForm.module.scss";
import { Checkout } from "./checkoutResolver";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: keyof Checkout;
  step: number;
}
const Input = ({ label, name, hidden, onBlur, step, ...props }: InputProps) => {
  const { step: current, nextStep } = useStep();
  const {
    register,
    formState: { errors },
    getFieldState,
    trigger,
  } = useFormContext<Checkout>();

  const valid = getFieldState(name).isDirty && !getFieldState(name).invalid;

  const confirmValidity = async () => {
    const valid = await trigger(name);
    if (valid && current === step) {
      nextStep();
    }
  };
  if (current < step) return null;
  return (
    <label
      key={name}
      className={clsx([
        styles.input,
        errors[name] && styles.invalid,
        !errors[name] && valid && styles.valid,
      ])}
    >
      <span>{label}</span>
      <input
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        {...register(name, {
          onBlur: confirmValidity,
          valueAsNumber: props.type === "number",
        })}
        required
        onInvalid={(e) => e.preventDefault()}
        autoFocus={current === step}
        {...props}
      />
      <small className={styles.error}>{errors[name]?.message}</small>
    </label>
  );
};

export default Input;
