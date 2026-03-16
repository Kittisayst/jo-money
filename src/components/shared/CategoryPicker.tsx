import { useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCategoryStore } from '@/store/category-store'
import type { TransactionType } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface CategoryPickerProps {
  type: TransactionType
  value: string
  onChange: (value: string) => void
  error?: string
}

export function CategoryPicker({ type, value, onChange, error }: CategoryPickerProps) {
  const [open, setOpen] = useState(false)
  const { categories } = useCategoryStore()
  const filteredCategories = categories.filter(c => c.type === type)
  const selectedCategory = filteredCategories.find(c => c.id === value)

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between h-auto py-3 px-4 font-lao',
              error && 'border-red-500/50'
            )}
          >
            {selectedCategory ? (
              <div className="flex items-center gap-2">
                <span>{selectedCategory.icon}</span>
                <span>{selectedCategory.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">ເລືອກໝວດໝູ່...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="ຄົ້ນຫາໝວດໝູ່..." className="h-9 font-lao" />
            <CommandList>
              <CommandEmpty className="font-lao py-4 text-center text-sm">ບໍ່ພົບໝວດໝູ່.</CommandEmpty>
              <CommandGroup>
                {filteredCategories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.name}
                    onSelect={() => {
                      onChange(cat.id)
                      setOpen(false)
                    }}
                    className="font-lao"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
                        style={{ backgroundColor: cat.color + '20', color: cat.color }}
                      >
                        {cat.icon}
                      </div>
                      <span>{cat.name}</span>
                    </div>
                    <Check
                      className={cn('h-4 w-4', value === cat.id ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="border-t p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-lao text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                <Plus className="mr-2 h-4 w-4" />
                ເພີ່ມໝວດໝູ່ໃໝ່
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500 font-lao pl-1">{error}</p>}
    </div>
  )
}
