import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import "clsx"
interface Props {
  user: string,
  message: string
}
export function MessageBubble({ user, message }: Props) {
  const url = user == "ai" ? "https://www.github.com/shadcn.png" : "https://www.github.com/fiveace-Merill/Fredrick-Ogutu/linkedin-headshot-image.png"
  return (
    <div className="flex items-start gap-4">
      <div className="basis-1/12 grow-0 bg-primary aspect-square rounded-full flex justify-center items-center">
        <Avatar>
          <AvatarImage src={url} />
          <AvatarFallback>{user == "ai" ? "AI" : "HU"}</AvatarFallback>
        </Avatar>
      </div>
      <div className="basis-11/12 p-2 bg-tertiary-container/20 text-on-tertiary-container shadow-sm shadow-background/40 rounded-lg">
        <p className="p-3 text-md">{message}</p>
      </div>
    </div>
  )
}
