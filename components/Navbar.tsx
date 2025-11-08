import { poppins } from '@/fonts'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { EllipsisVertical } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 bg-background text-on-secondary-container shadow-md shadow-background my-auto py-3 px-2 flex justify-between items-center lg:justify-start lg:w-11/12 lg:mx-auto lg:bg-surface lg:static lg:shadow-none lg:flex-start">
      <div className="flex gap-2 items-center">
        <Image
          src="/brand_logo.png"
          width={42}
          height={42}
          className=""
          alt="brand_logo"
        />
        <p className={`${poppins.className} text-2xl font-bold`}>Money Tips</p>
      </div>
      <ul className="hidden gap-8 justify-start mx-auto lg:flex">
        <li className="text-xl font-semibold hover:text-secondary-container">Features</li>
        <li className="text-xl font-semibold hover:text-secondary-container">Pricing</li>
        <li className="text-xl font-semibold hover:text-secondary-container">About</li>
      </ul>
      <Button className="hidden lg:block bg-primary text-on-primary text-md rounded-full">Get Started</Button>
      <EllipsisVertical size={32} className="lg:hidden" />
    </nav>
  )
}
