import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <span
      style={{
        marginTop: "1rem",
        textAlign: "center",
        opacity: 0.8,
      }}
    >
      <span>
        Tus datos personales serán utilizados unicamente para coordinar y
        gestionar tu orden.
      </span>
      <span style={{ color: "#0070f3" }}>
        Ver{" "}
        <Link href="/politica_de_privacidad">
          política y tratamiento de datos.
        </Link>
      </span>
    </span>
  );
};

export default PrivacyPolicy;
