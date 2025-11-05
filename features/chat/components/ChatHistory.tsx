import { ChevronsLeft, Plus, WheatOff } from "lucide-react"
export default function ChatHistory({ onHideHistory = f => f }) {
  return (
    <div className="morph flex flex-col bg-background text-on-background">
      <div className="flex">
        <WheatOff size={32} />
        <h2>Money Tips</h2>
        <ChevronsLeft size={32} onClick={() => onHideHistory(true)} />
      </div>
      <div className="flex gap-4 bg-secondary text-on-secondary">
        <Plus size={32} />
        <p>New Chat</p>
      </div>
      <div>
        <p>Recent</p>
        <div className="mt-4 flex flex-col gap-3 overflow-y-scroll">
          <p>Budgeting for my first Home...</p>
          <p>Retirement planning Strategies....</p>
          <p>Beginner investment portfolio</p>
          <p>Saving for vacation...</p>
        </div>
      </div>
    </div>
  )
}
