"use client";
import useConnection from "@fresku/utils/hooks/useConnection";

const Connection = () => {
  const { isConnected } = useConnection();

  return (
    <div>
      <h1>Connection {isConnected? "cone": "none"}</h1>
    </div>
  );
};

export default Connection;
