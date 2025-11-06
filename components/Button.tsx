
export function Button({ children, }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary text-on-primary font-semibold w-full px-3 py-4 rounded-lg text-center lg:px-2 lg:py-3">
      {children}
    </div>
  )
}

export function FAB({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[38px] w-[38px] bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-2xl font-semibold rounded-full flex justify-center items-center lg:w-[48px] lg:h-[48px]" >
      {children}
    </div>
  )
}
