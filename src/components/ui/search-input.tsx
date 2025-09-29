import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Button } from "./button"

export interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  onClear?: () => void
  showClearButton?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, showClearButton = true, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || props.defaultValue || "")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      props.onChange?.(e)
    }

    const handleClear = () => {
      setValue("")
      onClear?.()
      // Create a synthetic event to trigger onChange with empty value
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>
      props.onChange?.(syntheticEvent)
    }

    React.useEffect(() => {
      setValue(props.value || "")
    }, [props.value])

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          className={cn("pl-10", showClearButton && value && "pr-10", className)}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {showClearButton && value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
            onClick={handleClear}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = "SearchInput"

export { SearchInput }
