import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Wallet, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { registerSchema, type RegisterFormData } from '@/schemas'
import sheetClient from '@/lib/sheet-client'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/types'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await sheetClient.register(data.username, data.password, {
        displayName: data.displayName,
        currency: 'LAK', // ຄ່າເລີ່ມຕົ້ນ
        language: 'lo', // ຄ່າເລີ່ມຕົ້ນ
        theme: 'dark', // ຄ່າເລີ່ມຕົ້ນ
      })

      if (response.status === 'success' && response.data) {
        login(response.data as User)
        toast.success('ລົງທະບຽນສຳເລັດ', {
          description: `ຍິນດີຕ້ອນຮັບສູ່ Jo-Money, ${(response.data as User).displayName}!`,
        })
        navigate('/', { replace: true })
      } else {
        toast.error('ລົງທະບຽນບໍ່ສຳເລັດ', {
          description: response.message || 'ຊື່ຜູ້ໃຊ້ນີ້ອາດມີຄົນໃຊ້ແລ້ວ',
        })
      }
    } catch (error: any) {
      toast.error('ເກີດຂໍ້ຜິດພາດ', {
        description: error.message || 'ກະລຸນາກວດສອບອິນເຕີເນັດຂອງທ່ານ',
      })
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center py-10 px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-violet-500 shadow-lg shadow-primary/30">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">ລົງທະບຽນ</h1>
        <p className="mt-1 text-sm text-muted-foreground">ສ້າງບັນຊີ Jo-Money ໃໝ່</p>
      </div>

      {/* Register Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass-card w-full max-w-sm p-6 space-y-4"
      >
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">ຊື່ສະແດງ</label>
          <input
            {...register('displayName')}
            type="text"
            placeholder="ໃສ່ຊື່ທີ່ຕ້ອງການສະແດງ"
            disabled={isSubmitting}
            className={`h-11 w-full rounded-xl bg-secondary/30 px-4 text-sm text-foreground outline-none border transition-all ${
              errors.displayName
                ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30'
                : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50'
            }`}
          />
          {errors.displayName && (
            <p className="mt-1.5 text-xs text-destructive">{errors.displayName.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">ຊື່ຜູ້ໃຊ້</label>
          <input
            {...register('username')}
            type="text"
            placeholder="ໃສ່ຊື່ຜູ້ໃຊ້"
            disabled={isSubmitting}
            className={`h-11 w-full rounded-xl bg-secondary/30 px-4 text-sm text-foreground outline-none border transition-all ${
              errors.username
                ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30'
                : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50'
            }`}
          />
          {errors.username && (
            <p className="mt-1.5 text-xs text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">ລະຫັດຜ່ານ</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="ໃສ່ລະຫັດຜ່ານ (ຢ່າງໜ້ອຍ 6 ຕົວ)"
              disabled={isSubmitting}
              className={`h-11 w-full rounded-xl bg-secondary/30 px-4 pr-11 text-sm text-foreground outline-none border transition-all ${
                errors.password
                  ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30'
                  : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">ຢືນຢັນລະຫັດຜ່ານ</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="ໃສ່ລະຫັດຜ່ານອີກຄັ້ງ"
            disabled={isSubmitting}
            className={`h-11 w-full rounded-xl bg-secondary/30 px-4 text-sm text-foreground outline-none border transition-all ${
              errors.confirmPassword
                ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30'
                : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50'
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full flex items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:active:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ກຳລັງລົງທະບຽນ...
            </>
          ) : (
            'ລົງທະບຽນ'
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-sm text-muted-foreground pb-6">
        ມີບັນຊີແລ້ວ?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-primary font-medium hover:underline"
        >
          ເຂົ້າສູ່ລະບົບ
        </button>
      </p>
    </div>
  )
}
