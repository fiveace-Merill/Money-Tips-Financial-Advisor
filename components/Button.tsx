
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary text-on-primary font-semibold w-full px-3 py-4 rounded-lg text-center">
      {children}
    </div>
  )
}
