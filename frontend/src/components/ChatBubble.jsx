import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import StudyBuddyAvatarImg from "@/assets/logo.svg";
import Lottie from "react-lottie";
import TypingAnimationFile from "@/assets/typing_animation";
import DefaultAvatarImage from "@/assets/default-avatar-img.jpeg"

function ChatBubble({ className, sent, text }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: TypingAnimationFile,
  };
  return (
    <div
      className={cn(
        "flex gap-2 my-4",
        `${sent ? "flex-row-reverse" : ""}`,
        className
      )}
    >
      <Avatar>
        <AvatarImage src={sent ? DefaultAvatarImage : StudyBuddyAvatarImg } alt="studybuddy" />
        <AvatarFallback>SB</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h2 className={cn("mx-2 font-medium text-lg text-[#ff9839]", sent ? "self-end" : "")}>
          {sent ? "You" : "StudyBuddy"}
        </h2>
        <div className="text-lg mt-1 p-2">
          <ReactMarkdown className="prose lg:prose-lg dark:prose-invert" remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          {!text &&( 
            <div className="flex gap-1 items-center">
              <span>Thinking</span>
              <Lottie options={defaultOptions} height={50} width={50} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
