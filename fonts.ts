import { Rubik, Poppins, Roboto, Lexend, Sriracha } from "next/font/google";

export const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
})

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "900"],
  subsets: ["latin"]
})

export const roboto = Roboto({
  weight: ["100", "200", "500", "600", "700"],
  subsets: ["latin"]
})

export const lexend = Lexend({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
})

export const sriracha = Sriracha({
  weight: ["400"],
  subsets: ["latin"]
})
