"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { getDefaultValues } from "../../../_utils";
import useHooks, { useStep } from "../hooks";
import { createOrder } from "../utils/actions";
import { ClientInfo, clientInfoSchema } from "../utils/resolver";
import Address from "./Address";
import OrderResume from "./OrderResume";
import styles from "./styles.module.scss";

const Form = ({ domain }: { domain: string }) => {
  const router = useRouter();
  const { setStep } = useStep();
  const { products, resume } = useHooks();

  const form = useForm({
    resolver: zodResolver(clientInfoSchema),
    reValidateMode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (clientData: ClientInfo) => {
    try {
      const orderId = await createOrder(clientData, products, resume, domain);
      router.replace(`/order/${orderId}`);
      products.clear();
    } catch (error: any) {
      console.error(error);
    }
  });

  useEffect(() => {
    const defaultValues = getDefaultValues();
    if (defaultValues) {
      form.reset(defaultValues);
    }
    if (defaultValues.phone) {
      setStep(4);
    }
  }, []);

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className={styles.form}>
        <Input label="Nombre" name="name" step={0} />
        <Input
          label="Teléfono"
          name="phone"
          type="number"
          inputMode="tel"
          step={1}
        />
        <Address step={2} />
        <OrderResume step={3} />
        <NextButton />
      </form>
    </FormProvider>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: keyof ClientInfo;
  step: number;
}

const Input = ({ label, name, step, ...props }: InputProps) => {
  const [valid, setValid] = useState(false);

  const {
    formState: { errors },
    trigger,
    register,
  } = useFormContext<ClientInfo>();

  const { step: current, nextStep } = useStep();

  const validate = async () => {
    const valid = await trigger(name);
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
            errors[name] && styles.invalid,
            !errors[name] && valid && styles.valid,
          ])}
        >
          <span>{label}</span>
          <input
            id={name}
            {...register(name, { onBlur: validate })}
            {...props}
            autoFocus={current === step}
          />
          {<small>{errors[name]?.message}</small>}
        </label>
      )}
    </>
  );
};

const NextButton = () => {
  const { step } = useStep();

  return (
    <>
      {step >= 3 ? null : (
        <button type="button" className={styles.nextButton}>
          Siguiente
        </button>
      )}
    </>
  );
};
export default Form;
