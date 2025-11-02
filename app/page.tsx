import Header from '@/components/Header'
import { Button } from "@/components/Button";
import { ChartNoAxesCombined, PiggyBank, SwatchBook } from "lucide-react";
import Hero from "@/components/Hero";

const products = [
  {
    icon: ChartNoAxesCombined,
    title: "Discover Effortless Savings",
    description: "Unlock your potential to save more. I'll help you set realistic goals. find opportunities to cut uneccessary expenses, and automatically track your progress. Watch your savings grow without stress",
  },
  {
    icon: PiggyBank,
    title: "Navigate Investments with confidence",
    description: "Step into the world of investment with clarity. Whether you are a beginner or experienced, I'll provide insights and guidance tailored to your risk tolerance and financial aspirations, helping your make decisions for your future",
  },
  {
    icon: SwatchBook,
    title: "Simplify Your Budgeting Journey",
    description: "Take control of your spending habits effortlesly. I'll hellp you visualize where your money goes, identify areas of improvement, and create a budget that works for you, giving you peace of mind and financial freedom",
  }
]

export default function Home() {
  return (
    <section className="bg-surface mt-8 flex flex-col gap-3 items-center justify-center font-sans">
      <Header />
      <main className="flex w-full max-w-3xl flex-col items-center justify-between py-16 px-8 sm:items-start">
        <Hero />
      </main>
      <div className="h-auto px-3 flex flex-col gap-8">
        {
          products.map((product, idx) => {
            const Icon = product.icon
            return (
              <div className="p-3 flex flex-col gap-1 rounded-lg bg-background-container/40 shadow-md shadow-tertiary/40" key={idx}>
                <div className="flex gap-2 items-center align-middle">
                  <div className="h-[48px] w-[48px] flex justify-center items-center rounded-full bg-secondary text-on-secondary">
                    <Icon className="" />
                  </div>
                  <h3 className="basis-9/12 font-semibold text-on-background-container">{product.title}</h3>
                </div>
                <p className="py-3 text-on-background">{product.description}</p>
              </div>
            )
          }
          )
        }
      </div>
      <footer className="mt-6 px-3 pb-6 w-full">
        <Button>
          Start Your Financial Journey
        </Button>
      </footer>
    </section>
  );
}
