import { GoogleSheetClient } from 'google-sheet-client-ts'

const client = new GoogleSheetClient({
  apiUrl: 'https://script.google.com/macros/s/AKfycbwspVhcNci21hsTWKNPPn2geDm9m7Izg-WKuiXsJ9Qnz1jzx9FtoeU6DsIFI3DtjjY6rA/exec',
  sheetKey: '1V-KYuJr3NpO7_bnKCeKoLoJXW3KeOXzh8LIsoN16whc'
})

async function testFetch() {
  console.log('🚀 ກຳລັງດຶງຂໍ້ມູນຈາກ Sheet: Users...')
  try {
    const response = await client.getData('Users')
    console.log('✅ ຜົນຮັບທີ່ໄດ້:')
    console.log(JSON.stringify(response, null, 2))
  } catch (error) {
    console.error('❌ ເກີດຂໍ້ຜິດພາດ:')
    console.error(error)
  }
}

testFetch()
