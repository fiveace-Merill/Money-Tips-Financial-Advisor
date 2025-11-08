"use client"
import Image from 'next/image'
import { useState } from "react"
import { Menu } from "lucide-react"
import SidebarMenu from "@/features/chat/components/SidebarMenu"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative w-full h-full bg-inherit md:h-auto">
      <nav className="sticky z-10 inset-x-0 top-0 py-3 px-2 flex justify-start items-center gap-6 lg:w-full lg:static">
        <Menu
          size={32}
          className="cursor-pointer md:hidden"
          onClick={() => setIsOpen(true)}
        />
        <div className="flex gap-4 items-center">
          <Image
            src="/brand_logo.png"
            width={42}
            height={42}
            className=""
            alt="brand_logo"
          />
          <p className="text-lg font-bold lg:text-2xl">Money Tips</p>
        </div>
      </nav>
      {
        isOpen && <SidebarMenu closeSideBar={setIsOpen} />
      }
    </div>
  )
}

