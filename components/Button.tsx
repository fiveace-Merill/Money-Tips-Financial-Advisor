
export function Button({ children, }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary text-on-primary font-semibold w-full px-3 py-4 rounded-lg text-center lg:px-2 lg:py-3">
      {children}
    </div>
  )
}

export function FAB({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary text-2xl text-on-primary font-semibold w-[48px] h-[48px] rounded-full flex justify-center items-center" >
      {children}
    </div>
  )
}
