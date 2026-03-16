import { GoogleSheetClient } from 'google-sheet-client-ts'

// ສ້າງ instance ສຳລັບຕິດຕໍ່ Google Sheet API
const client = new GoogleSheetClient({
  apiUrl: 'https://script.google.com/macros/s/AKfycbwspVhcNci21hsTWKNPPn2geDm9m7Izg-WKuiXsJ9Qnz1jzx9FtoeU6DsIFI3DtjjY6rA/exec',
  sheetKey: '1V-KYuJr3NpO7_bnKCeKoLoJXW3KeOXzh8LIsoN16whc'
})

// Default categories for Jo-Money
const defaultCategories = [
  // ລາຍຮັບ (Income)
  { name: 'ເງິນເດືອນ', type: 'income', icon: '💰', color: '#22c55e', sortOrder: 1 },
  { name: 'ໂບນັດ', type: 'income', icon: '💼', color: '#22c55e', sortOrder: 2 },
  { name: 'ລາຍຮັບອື່ນໆ', type: 'income', icon: '💵', color: '#22c55e', sortOrder: 3 },
  { name: 'ຂາຍສິນຄ້າ', type: 'income', icon: '🛍️', color: '#22c55e', sortOrder: 4 },
  { name: 'ໂອນເງິນ', type: 'income', icon: '💸', color: '#22c55e', sortOrder: 5 },
  
  // ລາຍຈ່າຍ (Expenses)
  { name: 'ອາຫານ', type: 'expense', icon: '🍔', color: '#ef4444', sortOrder: 1 },
  { name: 'ຄ່າເດີນພັກ', type: 'expense', icon: '🏠', color: '#ef4444', sortOrder: 2 },
  { name: 'ການສື່ສານ', type: 'expense', icon: '📱', color: '#ef4444', sortOrder: 3 },
  { name: 'ຂົນສົ່ງ', type: 'expense', icon: '🚗', color: '#ef4444', sortOrder: 4 },
  { name: 'ຊັບປ້ອຍ', type: 'expense', icon: '👕', color: '#ef4444', sortOrder: 5 },
  { name: 'ສຸຂະພາບ', type: 'expense', icon: '🏥', color: '#ef4444', sortOrder: 6 },
  { name: 'ການສຶກສາ', type: 'expense', icon: '📚', color: '#ef4444', sortOrder: 7 },
  { name: 'ບັນດາ', type: 'expense', icon: '🎮', color: '#ef4444', sortOrder: 8 },
  { name: 'ຂອງຂວັນ', type: 'expense', icon: '🛍️', color: '#ef4444', sortOrder: 9 },
  { name: 'ທ່ອງທ່ຽວ', type: 'expense', icon: '✈️', color: '#ef4444', sortOrder: 10 },
  { name: 'ບໍລິຈາກ', type: 'expense', icon: '🎁', color: '#ef4444', sortOrder: 11 },
]

async function seedCategories() {
  console.log('====================================')
  console.log('🌱 ເລີ່ມຕິດຕັ້ງ default categories...')
  console.log('====================================\n')

  try {
    // ກວດວ່າມີ categories ແລ້ວຫຼືບໍ່
    console.log('🔍 ກວດສອບ categories ທີ່ມີຢູ່...')
    const existingResponse = await client.getData('Categories')
    
    if (existingResponse.status === 'success' && existingResponse.data && existingResponse.data.length > 0) {
      console.log(`✅ Categories ມີຢູ່ແລ້ວ ${existingResponse.data.length} ລາຍການ`)
      console.log('⏭️  ຂ້າມ seeding...')
      return
    }
    
    // ເພີ່ມ default categories
    console.log(`📝 ກຳລັງເພີ່ມ ${defaultCategories.length} default categories...`)
    const now = new Date().toISOString()
    const categoriesWithId = defaultCategories.map(category => ({
      ...category,
      id: crypto.randomUUID(),
      userId: 'global', // Global categories for all users
      createdAt: now,
      updatedAt: now,
    }))
    
    const insertResponse = await client.insertData('Categories', categoriesWithId)
    
    if (insertResponse.status === 'success') {
      console.log(`\n✅ ຕິດຕັ້ງສຳເລັບ! ເພີ່ມ ${categoriesWithId.length} categories`)
      console.log('\n📋 Categories ທີ່ຕິດຕັ້ງ:')
      categoriesWithId.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.icon} ${cat.name} (${cat.type})`)
      })
    } else {
      console.error('\n❌ ລົ້ມເຫຼົ່ານໃນການ seeding categories:', insertResponse.message)
    }
    
  } catch (error) {
    console.error('\n💥 ເກີດຂໍ້ຜິດພາດ (Error):')
    console.error(error)
  }
}

async function clearCategories() {
  console.log('====================================')
  console.log('🗑️  ລຶບ categories ທັງໝົດ...')
  console.log('====================================\n')

  try {
    const response = await client.getData('Categories')
    
    if (response.status === 'success' && response.data && response.data.length > 0) {
      console.log(`📋 ພົບ ${response.data.length} categories ທີ່ຕ້ອງລຶບ...`)
      
      // ລຶບຈາກລາຍສຸດຂອງແຖວກ່ອນ (ລຳດັບຍົກກັບ)
      for (let i = response.data.length - 1; i >= 0; i--) {
        await client.deleteData('Categories', i)
      }
      
      console.log(`✅ ລຶບ ${response.data.length} categories ສຳເລັບ!`)
    } else {
      console.log('ℹ️  ບໍ່ມີ categories ທີ່ຕ້ອງລຶບ')
    }
    
  } catch (error) {
    console.error('\n💥 ເກີດຂໍ້ຜິດພາດ (Error):')
    console.error(error)
  }
}

// ເລືອກ function ຕາມ argument
const command = process.argv[2]

if (command === 'clear') {
  clearCategories()
} else if (command === 'seed' || !command) {
  seedCategories()
} else {
  console.log('📖 ການໃຊ້:')
  console.log('  node test-seed.mjs seed   - ຕິດຕັ້ງ default categories')
  console.log('  node test-seed.mjs clear  - ລຶບ categories ທັງໝົດ')
}
