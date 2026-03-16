import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxContextValue {
  value: any
  onValueChange: (value: any) => void
  open: boolean
  setOpen: (open: boolean) => void
  items: any[]
}

const ComboboxContext = React.createContext<ComboboxContextValue | undefined>(undefined)

function useCombobox() {
  const context = React.useContext(ComboboxContext)
  if (!context) {
    throw new Error("Combobox components must be used within a <Combobox />")
  }
  return context
}

export interface ComboboxProps {
  value?: any
  onValueChange?: (value: any) => void
  items: any[]
  children: React.ReactNode
  className?: string
}

export function Combobox({
  value,
  onValueChange,
  items,
  children,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <ComboboxContext.Provider value={{ value, onValueChange: (val) => onValueChange?.(val), open, setOpen, items }}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className={cn("relative w-full", className)}>{children}</div>
      </Popover>
    </ComboboxContext.Provider>
  )
}

export function ComboboxInput({ placeholder, className }: { placeholder?: string, className?: string }) {
  const { value, items, open } = useCombobox()
  
  const selectedItem = items.find((item) => {
    if (typeof item === 'string') return item === value
    return String(item.id) === String(value)
  })

  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn("w-full justify-between h-auto py-3 px-4 glass-input border-white/10 transition-all font-lao", className)}
      >
        <span className="truncate">
          {selectedItem ? (
             typeof selectedItem === 'string' ? selectedItem : (selectedItem.name || selectedItem.label || selectedItem.title)
          ) : (
            <span className="text-muted-foreground">{placeholder || "ເລືອກ..."}</span>
          )}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  )
}

export function ComboboxSearch({ placeholder, className }: { placeholder?: string, className?: string }) {
  return <CommandInput placeholder={placeholder || "ຄົ້ນຫາ..."} className={cn("border-none focus:ring-0", className)} />
}

export function ComboboxContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <PopoverContent className={cn("w-[--radix-popover-trigger-width] p-0 border-white/10 glass-card z-[100]", className)} align="start">
      <Command className="bg-transparent font-lao">
        {children}
      </Command>
    </PopoverContent>
  )
}

export function ComboboxEmpty({ children }: { children: React.ReactNode }) {
  return <CommandEmpty>{children}</CommandEmpty>
}

export function ComboboxList({ children }: { children: (item: any) => React.ReactNode }) {
  const { items } = useCombobox()
  return (
    <CommandList className="max-h-[220px]">
      <CommandGroup>
        {items.map((item) => children(item))}
      </CommandGroup>
    </CommandList>
  )
}

export function ComboboxItem({ 
  value, 
  children, 
  className,
  onSelect
}: { 
  value: any, 
  children: React.ReactNode, 
  className?: string,
  onSelect?: () => void
}) {
  const { value: selectedValue, onValueChange, setOpen } = useCombobox()
  
  // cmdk ຕ້ອງການ value ເປັນ string ສໍາລັບການ filter ແລະ internal state
  const itemValue = typeof value === 'string' ? value : JSON.stringify(value)
  
  const handleSelect = () => {
    onValueChange(value)
    setOpen(false)
    onSelect?.()
  }

  return (
    <CommandItem
      value={itemValue}
      onSelect={handleSelect}
      className={cn("flex items-center gap-3 py-3 px-4 cursor-pointer", className)}
    >
      <div className="flex flex-1 items-center gap-3">
        {children}
      </div>
      <Check
        className={cn(
          "h-4 w-4 text-primary shrink-0 ml-auto",
          selectedValue === value ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
}
