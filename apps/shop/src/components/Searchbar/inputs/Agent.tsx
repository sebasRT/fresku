import { cn } from "@/utils/functions/styles";
import { LuSendHorizontal } from "react-icons/lu";
import Chat from "../chat/Chat";
import { useShopChat } from "../chat/chatContext";
import Microphone from "../microphone/Microphone";
import { useBarMode, useQuery } from "../useSearchbar";
import styles from "./inputs.module.scss";
const AgentInput = () => {
  const { query, setQuery } = useQuery();
  const { mode } = useBarMode();
  if (mode !== "agent") return null;
  const { append } = useShopChat();

  const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  const onSubmit = async () => {
    setQuery("");
    try {
      await append({ role: "user", content: query });
    } catch (error) {
      console.error("Error sending chat message", error);
    }
  };

  return (
    <>
      <form
        action={onSubmit}
        className={cn(styles.container, styles.agentInput)}
      >
        <textarea
          id="query"
          value={query}
          onChange={onInputChange}
          placeholder="Como puedo ayudarte?"
        />

        {!query.length ? (
          <Microphone />
        ) : (
          <button
            className="text-[2em]"
            type="submit"
            children={<LuSendHorizontal />}
          />
        )}
        <label htmlFor="query" className="absolute inset-0 -z-10" />
      </form>
      <Chat />
    </>
  );
};

export default AgentInput;
