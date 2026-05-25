"use client"
import Link from "next/link";
import styles from "./signup.module.scss";

const page = () => {
  // const params = useSearchParams();

  // useEffect(() => {
  //   params.forEach((p) => console.log(p.toString()));
  // }, [params]);

  return (
    <section className={styles.signUpPage}>
      <label>
        <span>Nombre</span>
        <input type="text" />
      </label>
      <label>
        <span>Email</span>
        <input type="email" />
      </label>

      <button type="submit">Registrarse</button>
      <p>
        ¿Ya tienes una cuenta? <Link href={"/login"}>Inicia sesión</Link> aquí.
      </p>
      <Link href={"/"}>home</Link>
    </section>
  );
};

export default page;
