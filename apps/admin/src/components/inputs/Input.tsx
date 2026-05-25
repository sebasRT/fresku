import { InputHTMLAttributes } from "react";
import {
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

interface InputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  label?: string;
  options?: RegisterOptions<T>;
}

function Input<T extends FieldValues>({
  name,
  label,
  options,
  ...props
}: InputProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label htmlFor={name} style={{ display: "block", marginBottom: 4 }}>
          {label}
        </label>
      )}
      <input
        id={name}
        autoComplete="off"
        {...register(name, options)}
        {...props}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: errors[name] ? "1px solid red" : "1px solid #ccc",
          borderRadius: 4,
          ...props.style,
        }}
      />
      {errors[name] && (
        <span style={{ color: "red", fontSize: 12 }}>
          {String(errors[name]?.message)}
        </span>
      )}
    </div>
  );
}

export default Input;
