import CopyToClipboard from "@/components/CopyToClipboard";
import Input from "@/components/inputs/Input";
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
import { WithRequired } from "@fresku/utils/types";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import styles from "./form.module.scss";

const EditForm = ({
  defaultValues,
  onUpdate,
}: {
  defaultValues: WithRequired<BaseBarcodeProduct, "barcode">;
  onUpdate: (updated: BaseBarcodeProduct) => void;
}) => {
  const form = useForm<BaseBarcodeProduct>({
    defaultValues,
    resolver: zodResolver(baseProductSchema),
  });
  const { formState } = form;
  const onSubmit = form.handleSubmit(
    (updated) => onUpdate(updated),
    (updated) => console.log("Form submitted", JSON.stringify(updated))
  );

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <span>Errors: {JSON.stringify(formState.errors.image)}</span>
      <FormProvider {...form}>
        <CopyInfo barcode={defaultValues.barcode} />
        <Input name="name" label="Nombre" required/>
        <Input name="brand" label="Marca" required/>
        <Input name="measure" label="Medida" required/>
        <Selects />
      </FormProvider>
      <button type="submit" className={styles.submitButton}>
        Actualizar
      </button>
    </form>
  );
};

const CopyInfo = ({ barcode }: { barcode: string }) => {
  const { watch } = useFormContext<BaseBarcodeProduct>();
  const text = `${watch("name")} ${watch("brand")} ${watch("measure")}`;

  return (
    <div className={styles.copyInfo}>
      <section>
        <span>{text}</span>
        <CopyToClipboard text={text} />
      </section>
      <section>
        <span>{barcode}</span>
        <CopyToClipboard text={barcode || text} />
      </section>
    </div>
  );
};

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
export default EditForm;
