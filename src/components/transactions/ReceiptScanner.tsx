import { useState, useRef } from 'react'
import { Loader2, ScanLine } from 'lucide-react'
import { scanReceipt, type ParsedReceipt } from '@/utils/ocr-utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ReceiptScannerProps {
  onScanComplete: (data: ParsedReceipt) => void
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    const toastId = toast.loading('ກຳລັງອ່ານຂໍ້ມູນຈາກຮູບ...')

    try {
      const result = await scanReceipt(file)
      
      if (result) {
        onScanComplete(result)
        toast.success('ອ່ານຂໍ້ມູນໃບບິນສຳເລັດ!', { id: toastId })
      } else {
        toast.error('ບໍ່ສາມາດອ່ານຂໍ້ມູນໄດ້ ກະລຸນາລອງໃໝ່ ຫຼື ປ້ອນເອງ', { id: toastId })
      }
    } catch (error) {
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການ Scan', { id: toastId })
    } finally {
      setIsScanning(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <div 
        onClick={() => !isScanning && fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
          isScanning 
            ? "border-primary bg-primary/5" 
            : "border-white/10 bg-white/5 hover:border-primary/40 hover:bg-white/10"
        )}
      >
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          {isScanning ? (
            <>
              <div className="relative mb-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <div className="absolute inset-0 h-10 w-10 border-t-2 border-primary rounded-full animate-ping opacity-20"></div>
              </div>
              <p className="text-sm font-medium text-primary animate-pulse font-lao">ກຳລັງປະມວນຜົນຮູບພາບ...</p>
            </>
          ) : (
            <>
              <div className="mb-3 p-3 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform duration-300">
                <ScanLine className="h-8 w-8" />
              </div>
              <p className="text-sm font-bold font-lao mb-1">Scan ໃບບິນ BCEL One</p>
              <p className="text-xs text-white/40 font-lao">ອັບໂຫຼດຮູບເພື່ອເຕີມຂໍ້ມູນອັດຕະໂນມັດ</p>
            </>
          )}
        </div>

        {/* Scan animation overlay when scanning */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent w-full absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  )
}
