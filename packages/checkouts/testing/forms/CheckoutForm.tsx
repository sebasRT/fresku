"use client";
// import styles from "./page.module.css";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import "./checkoutForm.module.scss";
import { InputHTMLAttributes, Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, Checkout } from "./checkoutResolver";
import { set } from "zod";
import { camelCaseToTitleCase, formatPrice } from "../utils/functions";
import Link from "next/link";
import { Order, OrderProduct } from "../model/order";
import styles from "./checkoutForm.module.scss";
const CheckoutForm = () => {

  const [stage, setStage] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(1500);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      console.log("Total:", parsedCart.total);
      console.log("Items:", parsedCart.products);
      setSubtotal(parsedCart.total);
      setCartProducts(parsedCart.products);
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(checkoutSchema),

  });

  const { formState, handleSubmit, getValues } = form;
  const formContainer = useRef<HTMLDivElement>(null);
  

  const validateAndUpload = async () => {
    if (!formState.isValid) return;
    const form: Checkout = getValues();
    const { name, phone, building, apto, unit } = form;
    setDeliveryFee(1500);
    const products: OrderProduct[] = convertCartToOrder(cartProducts);

    const order = {
      customerName: camelCaseToTitleCase(name),
      customerPhone: phone,
      deliveryAddress: {
        building: building,
        apartment: apto,
        unit: unit,
      },
      subtotal,
      deliveryFee: deliveryFee,
      status: "pending",
    };

    // const upload = await uploadOrder(order);

    // if (!upload) return;

    // const res = JSON.parse(upload);
    // setOrderConfirmed(order);
    // dispatch(resetCart());
    // dispatch(addOrder({ ...order, _id: res.insertedId }));
  };

  // useEffect(() => {
  //   if (itemsCount !== 0 || orderConfirmed) return;
  //   setTimeout(() => {
  //     router.replace("/");
  //   }, 3000);
  // }, [itemsCount]);

  // useEffect(() => {
  //   setSessionId();
  // }, []);




  return (
    <form
      className={styles.form} 
      onSubmit={handleSubmit((data) => {
        console.log(data);
      })}
    >
      <h1 className={styles.h1}>
        Datos de tu pedido
      </h1>
      <FormProvider {...form}>
        <div
          className={styles.formContainer}
          ref={formContainer}>

          <div className={styles.inputContainer}>
            <div>
              <Input
                label="Nombre"
                name="name"
                placeholder="Quién recibe el pedido?"
                autoCapitalize="words"
                required
                autoFocus
                setStage={setStage}
              />
              {stage >= 1 && <UnitSelector setStage={setStage} />}
              <div className={styles.location}>
                <Input
                  label="Torre"
                  name="building"
                  type="number"
                  inputMode="numeric"
                  required
                  hidden={stage < 2}
                  autoFocus
                />
                <Input
                  label="Apto"
                  name="apto"
                  type="number"
                  inputMode="numeric"
                  required
                  hidden={stage < 2}
                  setStage={setStage}
                />
              </div>
              <Input
                label="Whatsapp"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                hidden={stage < 3}
                autoFocus
                setStage={setStage}
              />
            </div>
            {stage >= 4 && (
              <div className={styles.orderSummary}>
                <div className={styles.subtotal}>
                  <span>
                    Subtotal: <b>{formatPrice(subtotal)}</b>
                  </span>
                  <b>+</b>
                  <span>
                    Domicilio: <b>{formatPrice(deliveryFee)}</b>
                  </span>
                </div>
                  <label className={styles.totalLabel}>Total:</label>
                <div className={styles.total}>
                  <b>{formatPrice(subtotal + deliveryFee)}</b>
                </div>
              </div>
            )}
          </div>
          {stage < 4 && (
            <button
              className={styles.buttonRounded}
              type="button"
            >
              Siguiente
            </button>
          )}
          <button
            type="submit"
            style={stage >= 4 ? { opacity: 100 } : { opacity: 0 }}
            className={styles.buttonSubmit}
            disabled={!formState.isValid || formState.isSubmitting}
            autoFocus
          >
            Hacer pedido
          </button>
          <span className={styles.privacy}>
            <span>
              Tus datos personales serán utilizados unicamente para coordinar
              y gestionar tu orden.
            </span>
            <span>
              Ver {" "}
              <Link href="/politica-de-privacidad" className={styles.linkPolicy}>
                política y tratamiento de datos.
              </Link>
            </span>
          </span>

        </div>
      </FormProvider>
    </form>


  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: keyof Checkout;
  setStage?: Dispatch<SetStateAction<number>>;
}

const Input = ({
  label,
  name,
  hidden,
  setStage,
  onBlur,
  ...props
}: InputProps) => {

  const {
    register,
    formState: { errors },
    getFieldState,
    trigger,
  } = useFormContext<Checkout>();

  const valid = getFieldState(name).isDirty && !getFieldState(name).invalid;

  const confirmValidity = async () => {
    const valid = await trigger(name);
    if (valid && setStage) setStage((prev) => prev + 1);
  };

  return (
    <>
      {!hidden && (
        <label className={styles.label}>
          <input
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            {...register(name, {
              onBlur: () => {
                confirmValidity();
              },
              valueAsNumber: props.type === "number",
            })}
            {...props}
            className={`${errors[name] && styles.inputInvalid} ${valid && styles.inputValid} ${styles.input}`}
          />
          <div className={styles.validation}>
            <span className={styles.inputLabel}>{label}</span>
            {errors[name] && (
              <span className={styles.inputLabelEmpty}>
                {errors[name].message}
              </span>
            )}
          </div>
        </label>
      )}
    </>
  );
};

const UnitSelector = ({
  setStage,
}: {
  setStage: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    formState: { errors },
    getFieldState,
    trigger,
  } = useFormContext<Checkout>();
  const name = "unit";
  const valid = getFieldState(name).isDirty && !getFieldState(name).invalid;

  const confirmValidity = async () => {
    const valid = await trigger(name);
    if (valid && setStage) setStage((prev) => prev + 1);
  };

  return (
    <label htmlFor="" className={styles.unitSelectorLabel}>
      <select
        {...register(name, {
          onChange: () => {
            confirmValidity();
          },
        })}
        className={`${errors[name] && styles.inputInvalid} ${valid && styles.inputValid} ${styles.input}`}
        autoFocus
        defaultValue=""
      >
        <option value="" disabled>
          En qué unidad vives?
        </option>
        <option value="sendero">Sendero Verde</option>
        <option value="villa">Villa Verde</option>
        <option value="bulevar">Bulevar Verde</option>
      </select>
      <div className={styles.validation}>
        <span className={styles.unit}>Unidad</span>
        {errors[name] && (
          <span className={styles.unitEmpty}>
            {errors[name].message}
          </span>
        )}
      </div>
    </label>
  );
};

function convertCartToOrder(items:any[]): OrderProduct[] {
  return items.map((item) => {
    return {
      barcode: Number(item.barcode),
      image: item.image,
      quantity: Number(item.quantity),
      totalPrice: Number(item.price * item.quantity),
      unitPrice: item.price,
      name: `${item.name} ${item.measure} - ${item.brand}`,
      measure: item.measure,
      category: item.category,
    };
  });
}

export default CheckoutForm;