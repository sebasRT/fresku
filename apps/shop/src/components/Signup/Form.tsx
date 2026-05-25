"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "@fresku/mongo/users/meta";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { SignupSchema, signupSchema } from "./resolver";
import styles from "./signup.module.scss";

const Form = () => {
  const [error, setError] = useState("");
  const control = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const { isDirty, isLoading, isValid } = control.formState;
  const submit = async (data: SignupSchema) => {
    const result = await createUser(data);
    if (!result.success) {
      setError(result.message);
      return;
    }
    result.success && alert("Cuenta creada exitosamente!");
  };

  return (
    <form
      className={styles.signupForm}
      id="#signup"
      onSubmit={control.handleSubmit(submit)}
    >
      <FormProvider {...control}>
        <ErrorMessage message={error} />
        <Input name="name" />
        <Input name="email" />
      </FormProvider>

      <button type="submit" disabled={(isDirty && !isValid) || isLoading}>
        Crear cuenta
      </button>
      <p>
        ¿Ya tienes una cuenta? <Link href={"/login"}>Inicia sesión</Link> aquí.
      </p>
    </form>
  );
};
const ErrorMessage = ({ message }: { message: string }) => {
  if (!message) return null;

  switch (message) {
    case "already exists":
      return (
        <strong className="font-medium">
          Este correo ya tiene un usuario{" "}
          <Link className="m-0" href={"/login"}>
            Inicia Sesion
          </Link>
        </strong>
      );

    default:
      return <strong>{message}</strong>;
  }
};

const Input = ({ name }: { name: keyof SignupSchema }) => {
  const {
    register,
    formState: { errors },
    getFieldState,
  } = useFormContext<SignupSchema>();

  const valid = getFieldState(name).isDirty && !getFieldState(name).invalid;

  return (
    <label
      className={clsx([
        styles.label,
        errors[name] && styles.invalid,
        !errors[name] && valid && styles.valid,
      ])}
    >
      <span>{LABELS[name]}</span>
      <input type="text" id={name} {...register(name)} />

      <span className={styles.error}>
        {errors[name] ? errors[name].message : ""}
      </span>
    </label>
  );
};

const LABELS = {
  name: "Nombre",
  email: "Correo electrónico",
};
export default Form;
