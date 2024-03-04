// main.js
const { Bot, InlineKeyboard } = require('grammy');
const config = require('./config');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const qs = require('querystring');

const bot = new Bot(config.telegramToken);

// Fungsi untuk menghasilkan ID referensi unik
const generateReffId = () => crypto.randomBytes(8).toString('hex');

// Fungsi untuk menyimpan riwayat deposit ke JSON
const saveDepositHistory = (data) => {
  let history = [];
  try {
    history = JSON.parse(fs.readFileSync('depositHistory.json', 'utf8'));
  } catch (error) {
    console.error("Error reading deposit history:", error);
  }
  history.push(data);
  fs.writeFileSync('depositHistory.json', JSON.stringify(history, null, 2));
};

// Fungsi untuk membuat deposit
const createDeposit = (type, method, nominal) => {
  const postData = qs.stringify({
    api_key: config.apiKey,
    reff_id: generateReffId(),
    nominal: nominal,
    type: type,
    metode: method
  });

  const options = {
    port: 443,
    method: 'POST',
    path: '/deposit/create',
    hostname: new URL(config.apiHost).hostname,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(JSON.parse(data));
        saveDepositHistory(JSON.parse(data)); // Menyimpan riwayat
      });
    });

    req.on('error', (error) => reject(error));
    req.write(postData);
    req.end();
  });
};

// Handler untuk command /deposit
bot.command('deposit', async (ctx) => {
  await ctx.reply('Pilih tipe deposit:', {
    reply_markup: new InlineKeyboard()
      .text("Bank", "bank")
      .text("Ewallet", "ewallet")
      .text("VA", "va")
  });
});

// Handler untuk setiap pilihan tipe deposit
// Contoh untuk "bank", implementasikan juga untuk "ewallet" dan "va" dengan logika serupa
bot.callbackQuery('bank', async (ctx) => {
  // Implementasi pemilihan metode untuk tipe "bank", "ewallet", dan "va"
  // Dan meminta user untuk memasukkan nominal
});

// Mulai bot
bot.start();
