import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { History, Settings, ReceiptText, TrendingUp, X, EllipsisVertical } from "lucide-react"

export default function SidebarMenu({ closeSideBar = () => { } }: { closeSideBar?: (state: boolean) => void }) {
  return (
    <div className="w-full morph h-full fixed inset-x-0 inset-y-0 px-3 py-4 z-20 flex flex-col gap-4 transition-transform duration-300 lg:static lg:bg-inherit lg:gap-6">
      <X className="self-end lg:hidden" size={32} onClick={() => closeSideBar(false)} />
      <button className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container w-4/6 font-semibold px-3 py-4 rounded-lg text-center lg:w-full lg:px-2 lg:py-3">New Chat</button>
      <div className="flex flex-col gap-4 lg:gap-1">
        {[
          { icon: <History size={22} />, label: "Chat History", route: "/chat" },
          { icon: <ReceiptText size={22} />, label: "Budget Options", route: "/chat" },
          { icon: <TrendingUp size={22} />, label: "Investment Options", route: "/chat" },
          { icon: <Settings size={22} />, label: "Settings", route: "/chat" },
        ].map(({ icon, label, route }) => (
          <Link key={label} href={route}>
            <div key={label} className="hover:bg-secondary hover:text-on-secondary flex gap-3 py-3 items-center cursor-pointer focus:bg-secondary-container/50 focus:text-on-secondary-container rounded-lg px-2 transition">
              {icon}
              <p className="text-xl lg:text-sm">{label}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-auto border-t-2 border-background-container justify-self-end flex items-center justify-between w-4/6 lg:w-full">
        <div className="flex gap-3 py-3 items-center cursor-pointer focus:bg-secondary-container/50 focus:text-on-secondary-container rounded-lg px-2 transition">
          <Avatar>
            <AvatarImage src="https://github.com/evilrabbit.png" alt="evilrabbit" />
            <AvatarFallback>F0</AvatarFallback>
          </Avatar>
          <p className="text-xl text-secondary/80 hover:text-secondary font-bold lg:text-lg">Fredrick Ogutu</p>
        </div>
        <EllipsisVertical />
      </div>
    </div>
  )
}

