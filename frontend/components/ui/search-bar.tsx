import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "relative flex h-12 items-center rounded-lg border-2 border-gray-200 bg-white text-sm focus-within:border-red-500 transition-colors",
        className,
      )}
    >
      <Search className="absolute left-3 h-4 w-4 text-gray-400" />
      <Input
        ref={ref}
        className="w-full pl-10 pr-3 bg-transparent border-0 text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        {...props}
      />
    </div>
  )
})
SearchBar.displayName = "SearchBar"

export { SearchBar }
