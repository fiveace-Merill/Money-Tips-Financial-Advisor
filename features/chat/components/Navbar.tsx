import { Menu } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="fixed z-10 inset-x-0 top-0 bg-background-container shadow-md shadow-background my-auto py-3 px-2 flex justify-start items-center gap-6">
      <Menu size={32} />
      <div className="flex gap-4 items-center">
        <div className="p-3 flex justify-center items-center w-10 h-10 rounded-full bg-black text-white">FO</div>
        <p className="text-2xl font-bold">Money Tips</p>
      </div>
    </nav>
  )
}

