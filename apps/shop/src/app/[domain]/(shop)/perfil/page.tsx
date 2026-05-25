import { cookies } from "next/headers";

const Perfil = async () => {
  const cookiesStore = await cookies();
  const sessionId = cookiesStore.get("sessionId");

  return (
    <div>
      <h1>{sessionId?.value}</h1>
    </div>
  );
};

export default Perfil;
