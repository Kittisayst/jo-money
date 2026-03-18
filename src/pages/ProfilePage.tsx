import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, Mail, AtSign, Save, Loader2, Lock as LockIcon, KeyRound, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const profileSchema = z.object({
  displayName: z.string().min(2, 'ຊື່ຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ'),
  username: z.string().min(3, 'ຊື່ຜູ້ໃຊ້ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ'),
  email: z.string().email('ຮູບແບບ Email ບໍ່ຖືກຕ້ອງ').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, saveProfile } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      username: user?.username || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const success = await saveProfile(data)
      
      if (success) {
        toast.success('ບັນທຶກຂໍ້ມູນໂປຣໄຟລ໌ສຳເລັດແລ້ວ')
        navigate('/settings')
      } else {
        toast.error('ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ Google Sheet ໄດ້')
      }
    } catch (error) {
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ')
    }
  }

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || 'U'

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
        <h1 className="text-xl font-bold font-lao">ຂໍ້ມູນສ່ວນຕົວ</h1>
      </header>

      {/* Profile Avatar Section */}
      <div className="flex flex-col items-center justify-center py-6 gap-4">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full p-1 bg-gradient-to-br from-primary via-violet-500 to-primary animate-gradient shadow-2xl shadow-primary/30">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-3xl font-bold text-foreground overflow-hidden">
               <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-violet-500 text-white">
                {initial}
              </div>
            </div>
          </div>
          <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white border-4 border-background flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
            <Save size={14} />
          </button>
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg font-lao">{user?.displayName}</h2>
          <p className="text-sm text-muted-foreground">@{user?.username}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card className="glass-card border-white/5 shadow-xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-lao flex items-center gap-2">
              <User size={18} className="text-primary" />
              ຂໍ້ມູນພື້ນຖານ
            </CardTitle>
            <CardDescription className="font-lao text-xs">
              ຂໍ້ມູນເຫຼົ່ານີ້ຈະສະແດງຢູ່ໃນລາຍງານ ແລະ ໜ້າຫຼັກ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="font-lao text-xs flex items-center gap-1.5 ml-1">
                <User size={12} className="text-muted-foreground" />
                ຊື່ສະແດງຜົນ
              </Label>
              <Input
                id="displayName"
                {...register('displayName')}
                className={cn(
                  "bg-secondary/30 border-white/5 focus:bg-secondary/50 transition-all rounded-xl h-11 font-lao px-4",
                  errors.displayName && "border-red-500/50"
                )}
                placeholder="ປ້ອນຊື່ຂອງທ່ານ..."
              />
              {errors.displayName && (
                <p className="text-[10px] text-red-400 ml-1 font-lao">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="font-lao text-xs flex items-center gap-1.5 ml-1 text-muted-foreground">
                <AtSign size={12} />
                ຊື່ຜູ້ໃຊ້ (@username)
              </Label>
              <Input
                id="username"
                {...register('username')}
                className={cn(
                  "bg-secondary/30 border-white/5 focus:bg-secondary/50 transition-all rounded-xl h-11 font-lao px-4",
                  errors.username && "border-red-500/50"
                )}
                placeholder="ປ້ອນຊື່ຜູ້ໃຊ້..."
              />
              {errors.username && (
                <p className="text-[10px] text-red-400 ml-1 font-lao">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-lao text-xs flex items-center gap-1.5 ml-1 text-muted-foreground">
                <Mail size={12} />
                Email (ທາງເລືອກ)
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={cn(
                  "bg-secondary/30 border-white/5 focus:bg-secondary/50 transition-all rounded-xl h-11 font-lao px-4",
                  errors.email && "border-red-500/50"
                )}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-[10px] text-red-400 ml-1 font-lao">{errors.email.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 shadow-xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-lao flex items-center gap-2">
              <LockIcon size={18} className="text-primary" />
              ຄວາມປອດໄພ
            </CardTitle>
            <CardDescription className="font-lao text-xs">
              ຈັດການຄວາມປອດໄພຂອງບັນຊີທ່ານ
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
             <Button 
                type="button"
                variant="ghost"
                onClick={() => navigate('/settings/change-password')}
                className="w-full justify-between h-12 rounded-xl hover:bg-secondary/50 transition-all font-lao px-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                    <KeyRound size={16} />
                  </div>
                  <span>ປ່ຽນລະຫັດຜ່ານ</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Button>
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
            <Save className="h-5 w-5 mr-2" />
          )}
          ບັນທຶກການປ່ຽນແປງ
        </Button>
      </form>
    </div>
  )
}

// Utility to handle conditional classes (assuming it's available or we can use a helper)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
