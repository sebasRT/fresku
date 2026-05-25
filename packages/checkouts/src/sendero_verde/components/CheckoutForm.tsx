"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getDefaultValues } from "../../../_utils";
import useProducts from "../hooks/useProducts";
import useResume from "../hooks/useResume";
import useStep from "../hooks/useStep";
import { createOrder } from "../utils/actions";
import Address from "./Address";
import styles from "./checkoutForm.module.scss";
import { Checkout, checkoutSchema } from "./checkoutResolver";
import Input from "./Input";
import PrivacyPolicy from "./PrivacyPolicy";
import Resume from "./Resume";
const CheckoutForm = ({ domain }: { domain: string }) => {
  const router = useRouter();
  const products = useProducts();
  const resume = useResume();
  const [error, setError] = useState("");
  const { step, setStep } = useStep();
  const { subtotal, setUnit } = resume;
  const scrollBottom = useRef<HTMLDivElement>(null);
  const form = useForm<Checkout>({
    resolver: zodResolver(checkoutSchema),
  });

  const { handleSubmit } = form;

  const submit = async (clientData: Checkout) => {
    if (subtotal <= 0) {
      setError("Sin articulos en el carrito , serás redirigido al inicio");
      setTimeout(() => router.replace("/"));
    }

    try {
      const orderId = await createOrder(products, clientData, resume, domain);
      if (!orderId) {
        setError("Hubo un error al crear el pedido");
        return;
      }
      router.replace(`/order/${orderId}`);
      products.clear();
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const defaultValues = getDefaultValues();
    if (defaultValues) {
      setUnit(defaultValues.unit);
      form.reset(defaultValues);
    }
    if (defaultValues.phone) {
      setStep(4);
    }
  }, []);

  useEffect(() => {
    scrollBottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  return (
    <FormProvider {...form}>
      <form className={styles.form} onSubmit={handleSubmit(submit)}>
        <span className={clsx([styles.error, error && styles.errorActive])}>
          Error: {error}
        </span>
        <Input
          label="Nombre"
          name="name"
          placeholder="Quién recibe el pedido?"
          autoCapitalize="words"
          step={0}
        />
        <Address step={1} />
        <Input
          label="Whatsapp"
          name="phone"
          type="tel"
          inputMode="tel"
          step={4}
        />
        <NextButton />
        <Resume step={5} />
        <PrivacyPolicy />
        <div ref={scrollBottom} />
      </form>
    </FormProvider>
  );
};

const NextButton = () => {
  const { step, nextStep } = useStep();

  return (
    <>
      {step >= 5 ? null : (
        <button type="button" className={styles.nextButton} onClick={nextStep}>
          Siguiente
        </button>
      )}
    </>
  );
};

export default CheckoutForm;
