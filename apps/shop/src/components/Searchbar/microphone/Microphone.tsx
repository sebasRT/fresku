import { useEffect } from "react";
import { PiMicrophoneFill, PiStopFill } from "react-icons/pi";
import { useQuery } from "../useSearchbar";
import useAudioStore from "./microphoneStore";
const Microphone = () => {
  // const { setMode } = useBarMode();
  const { setQuery } = useQuery();

  const {
    text,
    isInitialized,
    isRecording,
    initializeRecording,
    startRecording,
    stopRecording,
    cleanup,
  } = useAudioStore();

  useEffect(() => {
    if (isInitialized && text) {
      setQuery(text);
    }
    return () => {
      stopRecording();
      cleanup();
    };
  }, [text]);

  const handleRecord = async () => {
    if (!isInitialized) {
      await initializeRecording();
      startRecording();
      return;
    }
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      <button onClick={handleRecord} type="button" className="z-50">
        {isRecording ? <PiStopFill /> : <PiMicrophoneFill />}
      </button>
    </>
  );
};

export default Microphone;
