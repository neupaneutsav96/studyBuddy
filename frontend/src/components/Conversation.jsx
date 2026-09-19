import ChatBubble from "./ChatBubble";

function Conversation({ conversation }) {
  return (
    <>
      <ChatBubble sent text={conversation["Prompt"]} />
      <ChatBubble text={conversation["Answer"]} />
    </>
  );
}

export default Conversation;
