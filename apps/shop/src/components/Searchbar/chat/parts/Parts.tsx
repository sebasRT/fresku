import { ToolInvocation as ToolInvocationType, UIMessage } from "ai";
import SearchBarcodeTool from "./tools/SearchBarcodeTool";
import SearchFruverTool from "./tools/SearchFruverTool";

const Parts = ({ parts }: { parts: UIMessage["parts"] }) => {
  const isSearchinProducts = parts.some(
    (part) =>
      part.type === "tool-invocation" &&
      (part.toolInvocation.toolName === "buscarProductos" ||
        part.toolInvocation.toolName === "buscarProductoFruver") &&
      part.toolInvocation.state === "call"
  );

  return (
    <>
      {isSearchinProducts && <p>Buscando productos...</p>}
      {parts.map((part) => {
        switch (part.type) {
          case "tool-invocation":
            return (
              <ToolInvocation
                key={part.toolInvocation.toolCallId}
                toolInvocation={part.toolInvocation}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

const ToolInvocation = ({
  toolInvocation,
}: {
  toolInvocation: ToolInvocationType;
}) => {
  const callId = toolInvocation.toolCallId;

  switch (toolInvocation.toolName) {
    case "buscarProductos":
      return <SearchBarcodeTool key={callId} tool={toolInvocation} />;
    case "buscarProductoFruver":
      return <SearchFruverTool key={callId} tool={toolInvocation} />;
    default:
      return null;
  }
};

export default Parts;
