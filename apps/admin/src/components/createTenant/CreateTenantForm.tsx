"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTenant } from "@fresku/mongo/tenants/index";
import { toTenantDB } from "@fresku/utils/functions/strings";
import {
  FormProvider,
  RegisterOptions,
  useForm,
  useFormContext,
} from "react-hook-form";
import Connection from "./Connection";
import TenantDomain from "./TenantDomain";
import styles from "./createTenant.module.scss";
import { resolver, TenantToCreate } from "./resolver";

const CreateTenantForm = () => {
  const form = useForm<TenantToCreate>({
    resolver: zodResolver(resolver),
    mode: "onBlur",
    defaultValues: {
      domainType: "subdomain",
    },
  });

  const { handleSubmit } = form;

  const submitTenant = async (data: TenantToCreate) => {
    const result = await createTenant(data);
    console.log(result);
  };

  const handleError = (data: any) => {
    // Handle form submission errors here
    console.error("Form submission error:", data);
  };

  return (
    <div>
      <Connection/>
      <form
        onSubmit={handleSubmit(submitTenant, handleError)}
        className={styles.form}
      >
        <FormProvider {...form}>
          <Input
            label="Nombre del tenant"
            type="text"
            name="name"
            placeholder="Enter tenant ID"
          />
          <Input
            label="Base de datos"
            type="text"
            name="database"
            placeholder="Enter database name"
            options={{ setValueAs: (value) => toTenantDB(value) }}
          />
          <TenantDomain />
          <button
            type="submit"
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Tenant
          </button>
        </FormProvider>
      </form>
    </div>
  );
};

const Input = ({
  label,
  name,
  options,
  ...props
}: {
  label: string;
  name: keyof TenantToCreate;
  options?: RegisterOptions<TenantToCreate, keyof TenantToCreate>;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TenantToCreate>();

  return (
    <div>
      <input
        {...register(name, {
          setValueAs: (value) => (value === "" ? undefined : value),
          ...options,
        })}
        {...props}
        placeholder={label}
        className={styles.input}
        autoComplete="off"
      />
      <span className="text-red-500 text-sm">{errors[name]?.message}</span>
    </div>
  );
};

export default CreateTenantForm;
