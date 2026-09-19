import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdSend } from "react-icons/md";
import ChatBubble from "./ChatBubble";
import { useEffect, useRef, useState } from "react";
import useChatBot from "@/hooks/useChatBot";
import StudyBuddyFull from "@/assets/logo-horizontal.svg";
import Conversation from "./Conversation";

function ChatInterface({ setSources }) {
  const chatsContainerRef = useRef();
  const { conversations, sendPrompt } = useChatBot(setSources);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    chatsContainerRef.current?.scrollTo(
      0,
      chatsContainerRef.current.scrollHeight
    );
  }, [conversations]);

  useEffect(() => {
    const welcomeText =
      "Hi there! I'm StudyBuddy, your friendly AI assistant for study. How may I help you today?";
    const interval = setInterval(() => {
      setWelcomeMessage((prevMsg) => {
        if (prevMsg.length != welcomeText.length)
          return prevMsg + welcomeText[prevMsg.length];
        clearInterval(interval);
        return prevMsg;
      });
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-full flex flex-col flex-1 border-2 border-l-gray-800">
      <img src={StudyBuddyFull} className="h-20" />
      <div
        className="flex-1 p-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-600 active:scrollbar-thumb-gray-600"
        ref={chatsContainerRef}
      >
        <ChatBubble text={welcomeMessage} />
        {conversations.map((conversation) => (
          <Conversation conversation={conversation} />
        ))}
      </div>
      <div className="max-w-3xl w-full mx-auto p-5 my-4 flex items-center gap-4">
        <Input
          className="flex-1 text-base h-20 border-2 border-gray-800 rounded-xl"
          placeholder="Ask buddy..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={() => {
            sendPrompt(inputValue);
            setInputValue("");
          }}
        />
        <Button
          className="h-[4.5rem] w-[4.5rem] border-2 text-[#ff9839]"
          variant="outline"
          size="icon"
          onClick={() => {
            sendPrompt(inputValue);
            setInputValue("");
          }}
        >
          <MdSend className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}

export default ChatInterface;
