import { FiCopy } from "react-icons/fi";
import { useCopyToClipboard } from "usehooks-ts";

const CopyToClipboard = ({ text }: { text: string }) => {
  const [copiedText, copy] = useCopyToClipboard();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className="text-[1.5em] cursor-copy"
    >
      <FiCopy color={copiedText === text ? "#15a440" : ""} />
    </button>
  );
};

export default CopyToClipboard;
