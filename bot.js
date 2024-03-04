// bot.js
// Import module yang dibutuhkan
const { Bot, InlineKeyboard } = require('grammy');
const config = require('./config');
const { makeDepositRequest } = require('./createDeposit'); // Mengimpor fungsi yang benar

// Inisialisasi bot dengan token dari config
const bot = new Bot(config.telegramToken);

// Kode lain tetap sama, tidak ada perubahan


// Menangani perintah /start atau /menu
bot.command(['start', 'menu'], async (ctx) => {
  await ctx.reply("Menu:", {
    reply_markup: new InlineKeyboard()
      .text("Buat Deposit", "create_deposit")
      .text("Saya masih hidup", "alive")
  });
});

// Menangani callback query untuk membuat deposit
bot.callbackQuery("create_deposit", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Silakan masukkan detail deposit dengan format: nominal|type|method\nContoh: 5000|ewallet|qris");
});

// Menangani callback query untuk pernyataan "Saya masih hidup"
bot.callbackQuery("alive", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Aku masih hidup!");
});

// Menangani pesan teks untuk membuat deposit
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  if (text.includes("|")) {
    const [nominal, type, method] = text.split("|");
    // Implementasi request ke API deposit
    const response = await makeDepositRequest(nominal, type, method);
    if (response.status) {
      // Menampilkan respon sesuai dengan jenis method dan type
      switch (type) {
        case "ewallet":
          if (method === "qris") {
            await ctx.replyWithPhoto(response.data.qr_image, {
              caption: `QR String: ${response.data.qr_string}\nNominal: ${response.data.nominal}\nID: ${response.data.id}\nStatus: ${response.data.status}`
            });
          } else {
            await ctx.reply(`Deposit berhasil!`, {
              reply_markup: new InlineKeyboard().url("Bayar Sekarang", response.data.url)
            });
          }
          break;
        case "bank":
        case "va":
          await ctx.reply(`Deposit berhasil!\nID: ${response.data.id}\nNominal: ${response.data.nominal}\nStatus: ${response.data.status}`);
          break;
        default:
          await ctx.reply("Tipe deposit tidak dikenal.");
      }
    } else {
      await ctx.reply("Gagal membuat deposit.");
    }
  }
});

// Fungsi untuk membuat request deposit ke API (contoh implementasi)
// async function makeDepositRequest(nominal, type, method) {
  // Logika untuk membuat request ke API dan mengembalikan respon
  // Return contoh respon sukses
//   return {
//     status: true,
//     data: {
//       id: "xxxxxxx",
//       reff_id: "xxxxxxx",
//       nominal: nominal,
//       type: type,
//       method: method,
//       qr_string: "xxxxxx",
//       qr_image: "https://example.com/qr/xxxxx",
//       status: "pending",
//       created_at: new Date().toISOString(),
//       expired_at: new Date(new Date().getTime() + 3600000).toISOString(), // 1 jam kemudian
//     },
//     code: 200,
//   };
// }

// Jalankan bot
bot.start();
