import { EllipsisVertical } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 bg-inherit text-on-secondary-container shadow-md shadow-background my-auto py-3 px-2 flex justify-between items-centerlg lg:bg-surface lg:static lg:shadow-none lg:flex-start">
      <div className="flex gap-2 items-center">
        <div className="p-3 flex justify-center items-center w-10 h-10 rounded-full bg-black text-white">FO</div>
        <p className="text-2xl font-bold">Money Tips</p>
      </div>
      <EllipsisVertical size={32} className="lg:hidden" />
    </nav>
  )
}
