import { lexend } from "@/fonts"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { clsx } from "clsx"

interface Props {
  user: string,
  message: string
}

export function MessageBubble({ user, message }: Props) {
  const url = user == "ai" ? "https://www.github.com/shadcn.png" : "https://github.com/evilrabbit.png"
  return (
    <div className="flex items-start gap-4">
      <div className={clsx('h-9 w-9 mt-2 grow-0 bg-inherit border-background-container aspect-square rounded-full flex justify-center items-center', { 'order-2': user === 'human' })}>
        <Avatar >
          <AvatarImage src={url} className="rounded-full" />
          <AvatarFallback>{user == "ai" ? "AI" : "HU"}</AvatarFallback>
        </Avatar>
      </div>
      <div className={clsx('basis-11/12 p-2 shadow-sm shadow-background/40 rounded-lg', { 'bg-primary text-on-primary order-1': user === 'human', 'bg-surface text-on-surface': user === 'ai' })}>
        <p className={`${lexend.className} font-light text-sm p-3 text-md text-pretty lg:text-lg lg:text-justify`}>{message}</p>
      </div>
    </div>
  )
}
