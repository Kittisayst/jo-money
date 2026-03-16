import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Edit2, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCategoryStore } from '@/store/category-store'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'
import type { Category, TransactionType } from '@/types'

// Hoist static arrays outside component to avoid recreation
const ICONS = ['💰', '💼', '🛍️', '🍔', '🏠', '📱', '🚗', '👕', '🏥', '📚', '🎮', '🎁', '✈️', '💸', '🛒']
const COLORS = ['#22c55e', '#16a34a', '#15803d', '#ef4444', '#dc2626', '#b91c1c', '#3b82f6', '#2563eb', '#1d4ed8', '#f59e0b', '#d97706', '#b45309']
const INITIAL_FORM_DATA = {
  name: '',
  type: 'expense' as TransactionType,
  icon: '📝',
  color: '#ef4444'
}

export default function CategoriesPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory, initialized, isLoading } = useCategoryStore()
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  // Memoize derived state to avoid recalculation
  const { incomeCategories, expenseCategories } = useMemo(() => {
    return {
      incomeCategories: categories.filter(c => c.type === 'income'),
      expenseCategories: categories.filter(c => c.type === 'expense')
    }
  }, [categories])

  // Use useCallback to prevent recreation
  const handleFetchCategories = useCallback(() => {
    if (user && !initialized && !isLoading) {
      fetchCategories(user.id)
    }
  }, [fetchCategories, user, initialized, isLoading])

  useEffect(() => {
    handleFetchCategories()
  }, [handleFetchCategories])

  // Reset form function moved to event handler
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA)
    setEditingCategory(null)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          ...formData,
          userId: user.id
        })
      } else {
        await addCategory({
          ...formData,
          userId: user.id,
          sortOrder: categories.length + 1
        })
      }
      
      // Reset form after successful operation
      resetForm()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color
    })
  }, [])

  const handleDelete = useCallback(async (categoryId: string) => {
    if (confirm('ທ່ານແນ່ໃຈບໍ່ທີ່ຕ້ອງການລຶບໝວດນີ້?')) {
      await deleteCategory(categoryId)
    }
  }, [deleteCategory])

  const handleCancel = useCallback(() => {
    resetForm()
  }, [resetForm])

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">ກະລຸນາເຂົ້າສູ່ລະບົບ</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/settings')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">ຈັດການໝວດໝູ່</h1>
      </div>

      {/* Add/Edit Form */}
      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ຊື່ໝວດ
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background/60 border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="ປ້ອນຊື່ໝວດ..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ປະເພດ
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={formData.type === 'income' ? 'default' : 'ghost'}
                  onClick={() => setFormData({ ...formData, type: 'income', color: '#22c55e' })}
                  className={cn(
                    formData.type === 'income'
                      ? 'bg-income text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  ລາຍຮັບ
                </Button>
                <Button
                  type="button"
                  variant={formData.type === 'expense' ? 'default' : 'ghost'}
                  onClick={() => setFormData({ ...formData, type: 'expense', color: '#ef4444' })}
                  className={cn(
                    formData.type === 'expense'
                      ? 'bg-expense text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  ລາຍຈ່າຍ
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ໄອຄອນ
              </label>
              <div className="grid grid-cols-8 gap-2">
                {ICONS.map((icon) => (
                  <Button
                    key={icon}
                    type="button"
                    variant={formData.icon === icon ? 'default' : 'ghost'}
                    onClick={() => setFormData({ ...formData, icon })}
                    className={cn(
                      'text-lg p-2',
                      formData.icon === icon
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ສີ
              </label>
              <div className="grid grid-cols-6 gap-2">
                {COLORS.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant={formData.color === color ? 'default' : 'ghost'}
                    onClick={() => setFormData({ ...formData, color })}
                    className={cn(
                      'h-8 p-0',
                      formData.color === color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-background'
                        : ''
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {formData.color === color && (
                      <span className="text-primary-foreground text-xs">✓</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {editingCategory ? 'ອັບເດດ' : 'ເພີ່ມ'}
              </Button>
              {editingCategory && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  ຍົກເລີກ
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Income Categories */}
      {incomeCategories.length > 0 && (
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <h3 className="font-medium text-income mb-3">ລາຍຮັບ</h3>
            <div className="space-y-2">
              {incomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40"
                >
                  <div className="text-2xl">{category.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{category.name}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expense Categories */}
      {expenseCategories.length > 0 && (
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <h3 className="font-medium text-expense mb-3">ລາຍຈ່າຍ</h3>
            <div className="space-y-2">
              {expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40"
                >
                  <div className="text-2xl">{category.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{category.name}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
