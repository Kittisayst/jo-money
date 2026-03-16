import { GoogleSheetClient } from 'google-sheet-client-ts'

// ສ້າງ instance ສຳລັບຕິດຕໍ່ Google Sheet API
const client = new GoogleSheetClient({
  apiUrl: 'https://script.google.com/macros/s/AKfycbwspVhcNci21hsTWKNPPn2geDm9m7Izg-WKuiXsJ9Qnz1jzx9FtoeU6DsIFI3DtjjY6rA/exec',
  sheetKey: '1V-KYuJr3NpO7_bnKCeKoLoJXW3KeOXzh8LIsoN16whc'
})

async function testAuth() {
  console.log('====================================')
  console.log('🚀 ເລີ່ມທົດສອບລະບົບ 1. Register 2. Login...')
  console.log('====================================\n')

  try {
    const testUser = 'user' + Math.floor(Math.random() * 1000)
    const testPass = 'password123'

    // 1. ທົດລອງ Register User ໃໝ່
    console.log(`ກຳລັງທົດສອບລົງທະບຽນ (Register) ດ້ວຍ username: "${testUser}"...`)
    const regRes = await client.register(testUser, testPass, { 
      displayName: 'Test User', 
      currency: 'LAK', 
      language: 'lo', 
      theme: 'dark' 
    })
    
    console.log('\n📝 ຜົນຮັບ Register:')
    console.log(JSON.stringify(regRes, null, 2))

    // 2. ລອງ Login ດ້ວຍ User ທີ່ຫາສ້າງໃໝ່
    if (regRes.status === 'success') {
      console.log(`\nກຳລັງທົດສອບເຂົ້າສູ່ລະບົບ (Login) ດ້ວຍ username: "${testUser}"...`)
      const loginRes = await client.login(testUser, testPass)
      
      console.log('\n✅ ຜົນຮັບ Login:')
      console.log(JSON.stringify(loginRes, null, 2))
    }
  } catch (error) {
    console.error('\n💥 ເກີດຂໍ້ຜິດພາດ (Error):')
    console.error(error)
  }
}

testAuth()
