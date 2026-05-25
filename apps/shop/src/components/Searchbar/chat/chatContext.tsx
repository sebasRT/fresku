import { useChat, UseChatHelpers } from "@ai-sdk/react";
import { createContext, ReactNode, use } from "react";

const ChatContext = createContext<UseChatHelpers | undefined>(undefined);

const ChatContextProvider = ({
  children,
  domain,
}: {
  children: ReactNode;
  domain: string;
}) => {
  const chat = useChat({
    api: "/api/ai/shop",
    body: { domain },
    onError: (error) => {
      console.error(error);
    },
  });
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

export const useShopChat = () => {
  const context = use(ChatContext);
  if (!context) {
    throw new Error("useShopChat must be used within a ChatContextProvider");
  }
  return context;
};

export default ChatContextProvider;
