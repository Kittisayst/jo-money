import { createWorker } from 'tesseract.js';

export interface ParsedReceipt {
  type: 'income' | 'expense';
  amount: number;
  date: string; // YYYY-MM-DD
  note: string;
}

/**
 * ຟັງຊັນປັບແຕ່ງຮູບພາບກ່ອນອ່ານ (Grayscale & Contrast)
 * ເພື່ອໃຫ້ OCR ອ່ານຕົວໜັງສືທີ່ມີສີ (ຂຽວ/ແດງ) ໄດ້ດີຂຶ້ນ
 */
async function preprocessImage(imageFile: File | string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof imageFile === 'string' ? imageFile : URL.createObjectURL(imageFile));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // ວາດຮູບລົງ canvas
      ctx.drawImage(img, 0, 0);

      // ປັບເປັນ ຂາວ-ດຳ ແລະ ເພີ່ມ Contrast
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // ສູດ Grayscale
        const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        
        // ເພີ່ມ Contrast (ຖ້າເປັນສີອ່ອນໃຫ້ເປັນຂາວ, ສີເຂັ້ມໃຫ້ເປັນດຳ)
        const threshold = 150;
        const v = avg > threshold ? 255 : 0;
        
        data[i] = v;     // R
        data[i + 1] = v; // G
        data[i + 2] = v; // B
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    if (typeof imageFile === 'string') {
      img.src = imageFile;
    } else {
      img.src = URL.createObjectURL(imageFile);
    }
  });
}

/**
 * ຟັງຊັນສຳລັບອ່ານຂໍ້ມູນຈາກຮູບ
 */
export async function scanReceipt(imageFile: File | string): Promise<ParsedReceipt | null> {
  const processedImage = await preprocessImage(imageFile);
  const worker = await createWorker(['lao', 'eng']);
  
  try {
    const { data: { text } } = await worker.recognize(processedImage);
    await worker.terminate();
    
    return parseBcelReceipt(text);
  } catch (error) {
    console.error('OCR Error:', error);
    await worker.terminate();
    return null;
  }
}

/**
 * ຟັງຊັນ parse ຂໍ້ມູນຈາກ text ຂອງ BCEL One
 */
/**
 * ຟັງຊັນ parse ຂໍ້ມູນຈາກ text ຂອງ BCEL One
 */
function parseBcelReceipt(text: string): ParsedReceipt | null {
  console.log("--- OCR Raw Text Start ---");
  console.log(text);
  console.log("--- OCR Raw Text End ---");

  let amount = 0;
  let type: 'income' | 'expense' = 'expense';
  let date = new Date().toISOString().split('T')[0];
  let note = '';

  // 1. ກວດສອບປະເພດ (Income/Expense)
  if (text.includes('ໄດ້ຮັບເງິນໂອນ') || text.includes('ເງິນເຂົ້າ') || text.includes('Received')) {
    type = 'income';
  } else if (text.includes('ເງິນອອກ') || text.includes('ໂອນເງິນ') || text.includes('OnePay')) {
    type = 'expense';
  }

  // 2. ຫາຈຳນວນເງິນ (Amount)
  // ຊອກຫາຕົວເລກ ທີ່ມີເຄື່ອງໝາຍຈຸດ ຫຼື ຈຸດທົດສະນິຍົມ ແລະ ອາດຈະຕາມຫຼັງດ້ວຍ LAK ຫຼື ₭
  // Regex ນີ້ຈະຢືດຢຸ່ນຫຼາຍຂຶ້ນ
  const amountPatterns = [
    /([\d,]+\.\d{2})\s*(?:LAK|₭|lak)/gi, // 280,000.00 LAK
    /([\d,]+\.\d{2})/gi,                // 280,000.00 (ແບບບໍ່ມີ LAK)
    /ເງິນ(?:ເຂົ້າ|ອອກ)\s*\n?([\d,]+\.\d{2})/gi // ເງິນເຂົ້າ 280,000.00
  ];

  const foundAmounts: number[] = [];
  
  for (const pattern of amountPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const numStr = match[1].replace(/,/g, ''); // ລຶບ comma ອອກ
      const num = parseFloat(numStr);
      if (num > 0 && num < 1000000000) { // ບໍ່ເອົາເລກໃບບິນທີ່ຍາວເກີນໄປ
        foundAmounts.push(num);
      }
    }
  }

  if (foundAmounts.length > 0) {
    // ເລືອກເອົາຈຳນວນເງິນທີ່ "ໃຫຍ່ທີ່ສຸດ" (ແຕ່ບໍ່ເກີນ 1 ຕື້) ເພາະລາຄາມັກຈະເປັນເລກໃຫຍ່ສຸດໃນໃບບິນ
    amount = Math.max(...foundAmounts);
    console.log("Found Amount:", amount);
  }

  // 3. ຫາວັນທີ (Date)
  const dateMatch = text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (dateMatch) {
    const [_, d, m, y] = dateMatch;
    date = `${y}-${m}-${d}`;
    console.log("Found Date:", date);
  }

  // 4. ຫາ Note (ຊື່ ແລະ ລາຍລະອຽດ)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const noteParts = [];

  // ພະຍາຍາມຊອກຫາ "ຮ້ານ" ກ່ອນ (ເພາະໃນ OnePay ຈະຢູ່ລຸ່ມ ແລະ ເປັນຊື່ຜູ້ຮັບແທ້)
  let foundIndex = lines.findIndex(l => l === 'ຮ້ານ' || l === 'ຈາກບັນຊີ' || l === 'ລາຍລະອຽດ');
  
  // ຖ້າຫາແບບ Case ພິເສດບໍ່ເຫັນ ຈຶ່ງຫາແບບ .includes
  if (foundIndex === -1) {
    foundIndex = lines.findIndex(l => l.includes('ຮ້ານ') || l.includes('ຈາກບັນຊີ') || l.includes('From') || l.includes('Store'));
  }

  if (foundIndex !== -1 && lines[foundIndex + 1]) {
    let targetValue = lines[foundIndex + 1];
    
    // ຖ້າແຖວຕໍ່ມາເປັນ "ເລກອ້າງອີງ" ໃຫ້ຂ້າມໄປອີກ
    if (targetValue.includes('ເລກອ້າງອີງ') && lines[foundIndex + 2]) {
      targetValue = lines[foundIndex + 2];
    }

    // ກວດສອບ: ບໍ່ໃຫ້ເອົາ "ວັນທີ" ຫຼື "ເລກບັນຊີ" ມາເປັນ Note
    const isDate = /\d{2}\/\d{2}\/\d{4}/.test(targetValue);
    const isAccount = /Account|121-12-00/.test(targetValue);

    if (!isDate && !isAccount) {
      noteParts.push(targetValue);
    } else {
      // ຖ້າແຖວຕໍ່ຈາກ keyword ຍັງເປັນ Account/Date ໃຫ້ລອງຫາແຖວອື່ນທີ່ມີຊື່ຄົນ ຫຼື ຊື່ຮ້ານ
      const merchantLine = lines.find((l, idx) => idx > foundIndex && (l.includes('ນາງ') || l.includes('ທ້າວ') || l.includes('ຮ້ານ') || (l.length > 5 && !l.includes('202') && !l.includes('Account'))));
      if (merchantLine) {
        noteParts.push(merchantLine.replace('ຮ້ານ', '').trim());
      }
    }
  }

  // ເເພີ່ມລາຍລະອຽດເພີ່ມເຕີມ ຖ້າມີ
  const detailIndex = lines.findIndex(l => l.includes('ລາຍລະອຽດ') || l.includes('Detail'));
  if (detailIndex !== -1 && lines[detailIndex + 1]) {
    const detail = lines[detailIndex + 1];
    if (!detail.includes('ເລກໃບບິນ') && !detail.startsWith('202') && !noteParts.includes(detail)) {
      noteParts.push(detail);
    }
  }
  
  note = noteParts.join(' - ');
  console.log("Found Note:", note);

  // ຖ້າຫາເງິນບໍ່ເຫັນເລີຍ ຫຼື ເປັນ 0 ໃຫ້ຖືວ່າ fail
  if (amount <= 0) return null;

  return { type, amount, date, note };
}
