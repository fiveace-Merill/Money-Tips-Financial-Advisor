import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import "clsx"
interface Props {
  user: string,
  message: string
}
export function MessageBubble({ user, message }: Props) {
  const url = user == "ai" ? "https://www.github.com/shadcn.png" : "https://github.com/evilrabbit.png"
  return (
    <div className="flex items-start gap-4">
      <div className="h-9 w-9 mt-2 grow-0 bg-primary aspect-square rounded-full flex justify-center items-center">
        <Avatar >
          <AvatarImage src={url} className="rounded-full" />
          <AvatarFallback>{user == "ai" ? "AI" : "HU"}</AvatarFallback>
        </Avatar>
      </div>
      <div className="basis-11/12 p-2 bg-surface text-on-surface shadow-sm shadow-background/40 rounded-lg">
        <p className="p-3 text-md lg:text-lg">{message}</p>
      </div>
    </div>
  )
}
