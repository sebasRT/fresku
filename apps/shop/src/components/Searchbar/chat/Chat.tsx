"use client";
import ReactMarkdown from "react-markdown";
import styles from "./chat.module.scss";
import { useShopChat } from "./chatContext";
import Parts from "./parts/Parts";

const Chat = () => {
  const { messages } = useShopChat();
  if (!messages.length) return null;

  return (
    <div className={styles.container} id="shop-chat">
      {messages.map((message) => (
        <div key={message.id} className={styles.messageContainer}>
          {message.role === "user" ? (
            <UserMessage content={message.content} />
          ) : (
            <AgentMessage content={message.content} />
          )}
          <Parts parts={message.parts} />
        </div>
      ))}
    </div>
  );
};

const UserMessage = ({ content }: { content: string }) => (
  <div className="text-xl text-gray-500 mb-2 text-right">{content}</div>
);

const AgentMessage = ({ content }: { content: string }) => (
  <div className="text-xl">
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
);
export default Chat;
