"use client";
import { useParams } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { PiStarFourDuotone } from "react-icons/pi";
import Cart from "../Cart";
import ChatContextProvider from "./chat/chatContext";
import AgentInput from "./inputs/Agent";
import DefaultInput from "./inputs/Default";
import styles from "./searchbar.module.scss";
import { useBarMode } from "./useSearchbar";

const Searchbar = () => {
  const { mode, setMode } = useBarMode();
  const { domain } = useParams<{ domain: string }>();

  return (
    <div className={styles.container}>
      {/* <button
        onClick={() => setMode(barSet[mode])}
        className={cn(styles.searchModeButton, styles[mode])}
        children={barIcon[mode]}
      /> */}

      {barInput[mode]({ domain })}
      <Cart type="nav" />
    </div>
  );
};

const barIcon = {
  default: <PiStarFourDuotone />,
  agent: <IoSearch />,
};

const barSet = {
  default: "agent",
  agent: "default",
} as const;

const barInput = {
  default: () => <DefaultInput />,
  agent: ({ domain }: { domain: string }) => (
    <ChatContextProvider children={<AgentInput />} domain={domain} />
  ),
} as const;

export default Searchbar;
