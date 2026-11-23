import type { Message } from "@/types/message"

/**
 * Temporary local stand-in for the future AI service.
 * The API route calls this until a real model/backend is connected.
 */
export function generateMockReply(messages: Message[]): string {
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")?.content.toLowerCase() ?? ""

  if (/budget|spending|expense|track|plan/.test(lastUserMessage)) {
    return "Let's start by mapping your monthly income against fixed costs like rent and utilities, then look at what's left for flexible spending. A simple 50/30/20 split is a great starting point — I can help you tailor it to your numbers."
  }

  if (/save|saving|emergency|goal/.test(lastUserMessage)) {
    return "A strong first step is building an emergency fund of three to six months of essential expenses. Automating a transfer on payday makes saving feel effortless. What goal are you saving toward?"
  }

  if (/invest|stock|portfolio|risk|fund/.test(lastUserMessage)) {
    return "Investing depends on your time horizon and risk tolerance. For long-term goals, diversified index funds are often a sensible foundation. Before we go deeper, how long do you plan to stay invested?"
  }

  if (/debt|loan|credit|owe/.test(lastUserMessage)) {
    return "Tackling high-interest debt first usually saves the most money. List your balances and interest rates, and we can compare the avalanche and snowball approaches for your situation."
  }

  if (/hello|hi|hey/.test(lastUserMessage)) {
    return "Hi there! I'm ready to help. You can ask me about budgeting, saving for a goal, investing, or paying down debt."
  }

  return "Thanks for sharing that. To give you guidance that actually fits your life, tell me a little about your monthly income, your main expenses, and the goal you're working toward."
}
