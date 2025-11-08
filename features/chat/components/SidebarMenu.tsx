import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { History, Settings, ReceiptText, TrendingUp, X, EllipsisVertical } from "lucide-react"

export default function SidebarMenu({ closeSideBar = () => { } }: { closeSideBar?: (state: boolean) => void }) {
  return (
    <div className="w-full morph h-full fixed inset-x-0 inset-y-0 px-3 py-4 z-20 flex flex-col gap-4 transition-transform duration-300 md:px-1 md:py-2 md:flex-row md:static md:items-center lg:px-3 lg:py-4 lg:h-auto lg:flex lg:static lg:flex-col lg:items-start lg:gap-6">
      <X className="self-end md:hidden lg:hidden" size={32} onClick={() => closeSideBar(false)} />
      <button className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container w-4/6 font-semibold px-2 py-3 rounded-lg text-center md:mr-2 md:order-2 md:w-1/6 md:px-1 md:py-2 md:text-sm lg:mr-0 lg:order-1 lg:w-full lg:px-2 lg:py-3">New Chat</button>
      <div className="flex flex-col gap-4 md:mx-auto md:gap-12 md:flex-row md:order-1 lg:w-full lg:ml-0 lg:order-2 lg:flex-col lg:gap-1">
        {[
          { icon: <History size={22} />, label: "Chat History", route: "/chat" },
          { icon: <ReceiptText size={22} />, label: "Budget Options", route: "/chat" },
          { icon: <TrendingUp size={22} />, label: "Investment Options", route: "/chat" },
          { icon: <Settings size={22} />, label: "Settings", route: "/chat" },
        ].map(({ icon, label, route }) => (
          <Link key={label} href={route}>
            <div key={label} className="hover:bg-secondary hover:text-on-secondary flex gap-3 py-3 items-center cursor-pointer focus:bg-secondary-container/50 focus:text-on-secondary-container rounded-lg px-2 transition md:h-5/6 md:aspect-square md:text-on-primary-container md:bg-primary-container lg:h-auto lg:text-on-background-container lg:bg-inherit lg:w-full lg:aspect-auto">
              {icon}
              <p className="text-xl md:hidden lg:block lg:text-sm">{label}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="h-[100px] px-2 py-3 mt-auto border-t-2 border-background-container justify-self-end flex items-end justify-between w-4/6 md:hidden lg:flex lg:w-full lg:order-3">
        <div className="flex gap-3 items-center cursor-pointer focus:bg-secondary-container/50 focus:text-on-secondary-container rounded-lg transition">
          <Avatar>
            <AvatarImage src="https://github.com/evilrabbit.png" alt="evilrabbit" />
            <AvatarFallback>F0</AvatarFallback>
          </Avatar>
          <p className="text-md text-secondary/80 hover:text-secondary font-bold lg:text-lg">Fredrick Ogutu</p>
        </div>
        <EllipsisVertical size={28} />
      </div>
    </div>
  )
}

