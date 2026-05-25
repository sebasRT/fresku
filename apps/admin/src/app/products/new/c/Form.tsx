import CopyToClipboard from "@/components/CopyToClipboard";
import GenericInput from "@/components/inputs/Input";
import { addNewToGlobalAndUpdateTenants } from "@/lib/products/barcode";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BaseBarcodeProduct,
  baseProductSchema,
  NewBarcode,
} from "@fresku/model/products/barcode";
import { cn } from "@fresku/utils/functions/styles";
import {
  categories,
  CATEGORIES,
  subcategories,
} from "@fresku/utils/products/barcode/consts";
import { ComponentProps, useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import ImageInput from "../../ImageInput";
import { useEditorContext } from "./Editor";
import styles from "./products.module.scss";

type FormProduct = Omit<BaseBarcodeProduct & NewBarcode, "searchString">;

const Form = () => {
  const [toReview, setToReview] = useState(false);
  const { activeProduct, editProduct, goToNext } = useEditorContext();

  const form = useForm<FormProduct>({
    defaultValues: activeProduct,
    resolver: zodResolver(baseProductSchema.omit({ searchString: true })),
  });
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = form;

  const submit = handleSubmit(
    async (data) => {
      const product = { ...data, tenants: activeProduct.tenants };
      const result = await addNewToGlobalAndUpdateTenants(product);

      if (!result.success) {
        console.log("Error adding new product:", result);
        return;
      }
      setToReview(false);
      editProduct({ ...data, done: true });
      goToNext();
    },
    (error) => {
      console.log(error);
    }
  );

  const sendToReview = async () => {
    const product = { ...form.getValues() };
    const result = await addNewToGlobalAndUpdateTenants(product, true);

    if (!result.success) {
      console.log("Error adding new product:", result);
      return;
    }

    setToReview(false);
    editProduct({ ...product, toReview: true });
    goToNext();
  };

  const image = watch("image");
  useEffect(() => {
    editProduct({ barcode: activeProduct.barcode, image });
  }, [image]);

  useEffect(() => {
    console.log(activeProduct.image);

    form.reset(activeProduct);
  }, [activeProduct]);

  useEffect(() => {
    console.log(image);

    if (!image || !activeProduct.image) {
      return;
    }
    (async () => {
      const data = form.getValues() as BaseBarcodeProduct;
      if (data.category && data.subcategory) {
        return;
      }
      const prompt = `Nombre: ${data.name}`;
      const result = await fetch("/api/ai/products", {
        method: "POST",
        body: JSON.stringify({ prompt, categorization: true }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newValues = (await result.json()) as Partial<BaseBarcodeProduct>;
      Object.entries(newValues).forEach(([key, value]) => {
        setValue(key as keyof FormProduct, value);
      });
    })();
  }, [activeProduct, image]);

  return (
    <FormProvider {...form}>
      <section className={styles.form}>
        <CopyInfo />
        <div className="grid gap-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <Input name="name" label="Nombre" />
          <Input name="brand" label="Marca" />
          <Input name="measure" label="Medida" />
          <Selects />
          {/* <label htmlFor="review" className="flex gap-4">
            <input
              type="checkbox"
              id="review"
              checked={toReview}
              value={toReview ? "review" : "on"}
              onChange={() => setToReview((prev) => !prev)}
            />
            <p>{toReview ? "revisar" : "no revisar"}</p>
          </label> */}
          <GenericInput name="message" label="mensaje de revisión" />
          <button
            onClick={submit}
            className={cn(styles.button, isValid && styles.valid)}
          >
            Subir
          </button>
          <button
            onClick={sendToReview}
            className={cn(styles.button, isValid && styles.valid)}
          >
            A revisar
          </button>
        </div>
      </section>
    </FormProvider>
  );
};

const CopyInfo = () => {
  const {
    activeProduct: { barcode },
  } = useEditorContext();
  const { watch } = useFormContext<BaseBarcodeProduct>();
  const text = `${watch("name")} ${watch("brand")} ${watch("measure")}`;
  return (
    <div className={styles.copyInfo}>
      <div className={styles.texts}>
        <div className="flex gap-4 font-semibold">
          <span>{text}</span>
          <CopyToClipboard text={text} />
        </div>
        <div className="flex gap-4 font-semibold">
          <span>{barcode}</span>
          <CopyToClipboard text={barcode || text} />
        </div>
      </div>
      <ImageInput />
    </div>
  );
};

const Input = (
  props: ComponentProps<typeof GenericInput<BaseBarcodeProduct>>
) => <GenericInput {...props} autoComplete="off" />;

const Selects = () => {
  const { register, watch } = useFormContext<BaseBarcodeProduct>();
  const category = watch("category");
  const subcategory = watch("subcategory");
  return (
    <div className={styles.selects}>
      <label>
        <p>Categoria</p>
        <select {...register("category")} defaultValue={category}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORIES[cat]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <p>Subcategoria</p>
        <select {...register("subcategory")} defaultValue={subcategory}>
          <option value={subcategory}>{subcategory}</option>
          {category &&
            subcategories[category].map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
        </select>
      </label>
    </div>
  );
};

export default Form;
