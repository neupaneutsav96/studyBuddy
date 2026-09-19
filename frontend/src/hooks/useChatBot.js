import { useEffect, useState } from "react";
import { socket } from "@/socket";

function useChatBot(setSources) {
  const [conversations, setConversations] = useState([]);

  const sendPrompt = (prompt) => {
    if (prompt) {
      socket.emit("prompt", prompt);
      setConversations((prevConversations) => [
        ...prevConversations,
        { Prompt: prompt },
      ]);
    }
  };

  useEffect(() => {
    const onAnswer = (answer) => {
      setConversations((prevConversations) => {
        const lastConversation =
          prevConversations[prevConversations.length - 1];
        lastConversation["Answer"] = answer;
        return [...prevConversations];
      });
    };

    const onFinalAnswer = (ansJSON) => {
      setConversations((prevConversations) => {
        prevConversations[prevConversations.length - 1] = ansJSON;
        return [...prevConversations];
      });
      setSources(ansJSON['Sources'])
    };
    socket.on("answer", onAnswer);
    socket.on("final-answer", onFinalAnswer);

    return () => {
      socket.off("answer");
      socket.off("final-answer");
    };
  }, [setSources]);
  return { conversations, sendPrompt };
}

export default useChatBot;
