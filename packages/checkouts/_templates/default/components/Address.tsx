"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useStep } from "../hooks";
import { ClientInfo } from "../utils/resolver";
import styles from "./styles.module.scss";

const Address = ({ step }: { step: number }) => {
  const [valid, setValid] = useState(false);
  const { step: current, nextStep } = useStep();
  const [addressLabel, setAddressLabel] = useState("");
  const {
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext<ClientInfo>();

  useEffect(() => {
    setValue("address.label", addressLabel);
  }, [addressLabel]);

  const validate = async () => {
    const valid = await trigger("address.label");
    if (valid && current === step) {
      setValid(true);
      nextStep();
    }
  };
  return (
    <>
      {current < step ? null : (
        <label
          className={clsx([
            styles.input,
            errors["address"] && styles.invalid,
            !errors["address"] && valid && styles.valid,
          ])}
        >
          <span>Dirección</span>
          <input
            id="address"
            value={addressLabel}
            onChange={(e) => setAddressLabel(e.target.value)}
            onBlur={validate}
            autoFocus={current === step}
          />
          {errors["address"]?.label && (
            <small>{errors["address"]?.label?.message}</small>
          )}
        </label>
      )}
    </>
  );
};

export default Address;
