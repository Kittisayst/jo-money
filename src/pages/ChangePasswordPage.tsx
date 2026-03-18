import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Lock, ShieldCheck, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'ກະລຸນາປ້ອນລະຫັດຜ່ານປັດຈຸບັນ'),
  newPassword: z.string().min(6, 'ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ'),
  confirmPassword: z.string().min(1, 'ກະລຸນາຢືນຢັນລະຫັດຜ່ານໃໝ່'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "ລະຫັດຜ່ານໃໝ່ບໍ່ົງກັນ",
  path: ["confirmPassword"],
})

type PasswordFormData = z.infer<typeof passwordSchema>

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const changePassword = useAuthStore((state) => state.changePassword)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const result = await changePassword(data.currentPassword, data.newPassword)
      
      if (result.success) {
        toast.success(result.message)
        reset()
        navigate('/settings')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການປ່ຽນລະຫັດຜ່ານ')
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full bg-secondary/50 hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold font-lao">ປ່ຽນລະຫັດຜ່ານ</h1>
      </header>

      {/* Security Icon & Info */}
      <div className="flex flex-col items-center justify-center py-6 gap-3">
        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20 rotate-3 transition-transform hover:rotate-0">
          <ShieldCheck size={40} />
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg font-lao">ຄວາມປອດໄພຂອງບັນຊີ</h2>
          <p className="text-sm text-muted-foreground font-lao">ແນະນຳໃຫ້ປ່ຽນລະຫັດຜ່ານທຸກໆ 3 ເດືອນ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="glass-card border-white/5 shadow-xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-lao flex items-center gap-2">
              <KeyRound size={18} className="text-primary" />
              ຕັ້ງຄ່າລະຫັດຜ່ານໃໝ່
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-0">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" id="currentPasswordLabel" className="font-lao text-xs flex items-center gap-1.5 ml-1">
                ລະຫັດຜ່ານປັດຈຸບັນ
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  {...register('currentPassword')}
                  className={cn(
                    "bg-secondary/30 border-white/5 focus:bg-secondary/50 transition-all rounded-xl h-11 font-lao pl-4 pr-10",
                    errors.currentPassword && "border-red-500/50"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-[10px] text-red-400 ml-1 font-lao">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="h-px bg-white/5" />

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" id="newPasswordLabel" className="font-lao text-xs flex items-center gap-1.5 ml-1">
                ລະຫັດຜ່ານໃໝ່
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  {...register('newPassword')}
                  className={cn(
                    "bg-secondary/30 border-white/5 focus:bg-secondary/50 transition-all rounded-xl h-11 font-lao pl-4 pr-10",
                    errors.newPassword && "border-red-500/50"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[10px] text-red-400 ml-1 font-lao">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" id="confirmPasswordLabel" className="font-lao text-xs flex items-center gap-1.5 ml-1">
                ຢືນຢັນລະຫັດຜ່ານໃໝ່
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  {...register('confirmPassword')}
                  className={cn(
                    "bg-secondary/30 border-white/5 focus:bg-secondary/50 transition-all rounded-xl h-11 font-lao pl-4 pr-10",
                    errors.confirmPassword && "border-red-500/50"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] text-red-400 ml-1 font-lao">{errors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-white font-bold font-lao shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Lock className="h-5 w-5 mr-2" />
          )}
          ຢືນຢັນການປ່ຽນແປງ
        </Button>
      </form>
    </div>
  )
}
