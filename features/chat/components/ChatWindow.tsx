import { MessageBubble } from "./MessageBubble"

const sampleMessages = [
  {
    user: "ai",
    message: "Hello I am your AI financial Advisor, How Can I help?"
  },
  {
    user: "human",
    message: "I need advice on my budget"
  },
  {
    user: "ai",
    message: "Of course to give you the best advice, could you tell me a bit more about what you would like to achieve, for example are you looking to cut some expenses or save for a specific goal."
  },
]
export default function ChatWindow() {
  return (
    <section className="h-full flex flex-col gap-8 overflow-y-scroll">
      {
        sampleMessages.map((details, idx) => {
          const { user, message } = details
          return (
            <MessageBubble user={user} message={message} key={idx} />
          )
        })
      }
    </section>
  )
}
