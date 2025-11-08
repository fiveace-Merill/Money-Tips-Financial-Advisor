import Link from 'next/link'
import { Button } from "@/components/Button"

export default function Footer() {
  return (
    <footer className="mt-6 px-3 pb-6 w-full md:w-9/12 md:mx-auto lg:hidden lg:w-4/12 lg:mt-2.5 lg:px-2">
      <Link key="chat route" href="/chat">
        <Button>
          Start Your Financial Journey
        </Button>
      </Link>
    </footer>
  )
}
