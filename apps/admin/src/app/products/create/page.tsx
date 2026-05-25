"use client";
import GenericInput from "@/components/inputs/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BaseBarcodeProduct,
  baseProductSchema,
} from "@fresku/model/products/barcode";
import {
  CATEGORIES,
  categories,
  subcategories,
} from "@fresku/utils/products/barcode/consts";
import { Category } from "@fresku/utils/products/barcode/types";
import { ComponentProps, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import ImageInput from "../ImageInput";

const page = () => {
  const form = useForm({
    resolver: zodResolver(baseProductSchema),
  });

  const { handleSubmit, setValue } = form;

  const submit = async () => {
    const data = form.getValues() as BaseBarcodeProduct;
    const prompt = `Nombre: ${data.name}, Medida: ${data.measure}, Marca: ${data.brand || "N/A"}`;
    const result = await fetch("/api/ai/products", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const newValues = (await result.json()) as Partial<BaseBarcodeProduct>;
    console.log(newValues);
    Object.entries(newValues).forEach(([key, value]) => {
      setValue(key as keyof BaseBarcodeProduct, value);
    });
  };

  return (
    <FormProvider {...form}>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <Input name="barcode" label="Código de barras" />
        <ImageInput />  
        <Input name="name" label="Nombre del producto" />
        <Input name="measure" label="Medida del producto" />
        <Input name="brand" label="Marca del producto" />
        <Selects />
        <button onClick={submit}>enviar y probar</button>
      </div>
    </FormProvider>
  );
};

// Helper to avoid repeating the generic type
const Input = (
  props: ComponentProps<typeof GenericInput<BaseBarcodeProduct>>
) => <GenericInput {...props} autoComplete="off" />;

const Selects = () => {
  const [category, setCategory] = useState<Category>("alimentos_basicos");
  const { register } = useFormContext<BaseBarcodeProduct>();
  return (
    <div>
      <select
        {...register("category", {
          onChange: (e) => setCategory(e.target.value as Category),
        })}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORIES[cat]}
          </option>
        ))}
      </select>
      <select {...register("subcategory")}>
        {subcategories[category].map((subcat) => (
          <option key={subcat} value={subcat}>
            {subcat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default page;
