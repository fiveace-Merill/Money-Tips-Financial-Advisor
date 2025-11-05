import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
export default function Hero() {
  return (
    <div className="z-5 flex flex-col items-center lg:gap-0">
      <Avatar className="h-32 w-32">
        <AvatarImage className="h-full w-full" src="https://github.com/shadcn.png" alt="@avatar"></AvatarImage>
        <AvatarFallback>AV</AvatarFallback>
      </Avatar>
      <div className="mt-3 flex flex-col items-center gap-4 lg:w-8/12 lg:mt-0 lg:gap-1">
        <h2 className="text-2xl font-bold text-center text-on-background-container lg:text-xl">Meet your personal AI advisor</h2>
        <p className="text-center text-md text-on-background">I am here to simplify your financial journer. Together we will navigate your money with smart personalized advice to help you reach your goals faster and live the life you want</p>
      </div>
    </div>
  )
}
