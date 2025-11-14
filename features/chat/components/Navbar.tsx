"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from "react"
import { Menu } from "lucide-react"
import SidebarMenu from "@/features/chat/components/SidebarMenu"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative w-full h-full bg-inherit md:h-auto">
      <nav className="sticky z-10 inset-x-0 top-0 py-3 px-2 flex justify-start items-center gap-3 lg:gap-6 lg:w-full lg:static">
        <Menu
          size={28}
          className="cursor-pointer md:hidden"
          onClick={() => setIsOpen(true)}
        />
        <div className="flex gap-[5px] items-center">
          <Image
            src="/brand_logo.png"
            width={42}
            height={42}
            className=""
            alt="brand_logo"
          />
          <Link href="/" className="text-lg text-secondary hover:text-on-primary-container font-bold lg:text-2xl">Money Tips</Link>
        </div>
      </nav>
      {
        isOpen && <SidebarMenu closeSideBar={setIsOpen} />
      }
    </div>
  )
}

