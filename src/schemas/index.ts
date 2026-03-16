import { z } from 'zod'

/**
 * Schema ສຳລັບ ເຂົ້າສູ່ລະບົບ
 */
export const loginSchema = z.object({
  username: z.string().min(3, 'ຊື່ຜູ້ໃຊ້ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ'),
  password: z.string().min(6, 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Schema ສຳລັບ ລົງທະບຽນ
 */
export const registerSchema = z
  .object({
    username: z.string().min(3, 'ຊື່ຜູ້ໃຊ້ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ'),
    password: z.string().min(6, 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ'),
    confirmPassword: z.string(),
    displayName: z.string().min(1, 'ກະລຸນາໃສ່ຊື່ສະແດງ'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'ລະຫັດຜ່ານບໍ່ກົງກັນ',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Schema ສຳລັບ ລາຍການທຸລະກຳ
 */
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('ຈຳນວນເງິນຕ້ອງຫຼາຍກວ່າ 0'),
  categoryId: z.string().min(1, 'ກະລຸນາເລືອກໝວດໝູ່'),
  note: z.string().optional().default(''),
  date: z.string().min(1, 'ກະລຸນາເລືອກວັນທີ'),
  imageUrl: z.string().optional(),
})

export type TransactionFormData = z.infer<typeof transactionSchema>

/**
 * Schema ສຳລັບ ໝວດໝູ່
 */
export const categorySchema = z.object({
  name: z.string().min(1, 'ກະລຸນາໃສ່ຊື່ໝວດ'),
  type: z.enum(['income', 'expense']),
  icon: z.string().min(1, 'ກະລຸນາເລືອກ icon'),
  color: z.string().min(1, 'ກະລຸນາເລືອກສີ'),
})

export type CategoryFormData = z.infer<typeof categorySchema>

/**
 * Schema ສຳລັບ ຕັ້ງຄ່າຜູ້ໃຊ້
 */
export const userSettingsSchema = z.object({
  displayName: z.string().min(1, 'ກະລຸນາໃສ່ຊື່ສະແດງ'),
  currency: z.enum(['LAK', 'THB', 'USD']),
  language: z.enum(['lo', 'en']),
  theme: z.enum(['light', 'dark']),
})

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>
