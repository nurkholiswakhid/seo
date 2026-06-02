# SEO Query Generator

Aplikasi untuk generate pertanyaan informatif berdasarkan keyword dan SERP data untuk konten properti Indonesia.

## 🚀 Fitur

- Generate 6-8 query informatif dari keyword dan SERP data
- Analisis SERP otomatis menggunakan AI
- Copy query hasil generate dengan satu klik
- Interface yang user-friendly dan responsive

## 📋 Requirements

- Node.js >= 16
- npm atau yarn

## 🛠️ Installation

```bash
# Clone repository
git clone https://github.com/username/seo-query-generator.git
cd seo-query-generator

# Install dependencies
npm install
```

## 💻 Development

```bash
# Start development server
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 🏗️ Build

```bash
# Build untuk production
npm run build

# Preview build result
npm run preview
```

Output akan berada di folder `dist/`

## 🌐 Deployment

### Deploy ke GitHub Pages

```bash
npm run build
```

Push folder `dist/` ke branch `gh-pages` atau gunakan GitHub Actions workflow yang sudah disediakan.

### Deploy ke Vercel

```bash
npm i -g vercel
vercel
```

### Deploy ke Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## 📝 Usage

1. Masukkan keyword utama di kolom "Main Keyword"
2. Paste SERP data (meta titles, descriptions, PAA, related searches, dll)
3. Klik "Generate" dan tunggu hasil
4. Copy query yang diinginkan dengan klik tombol copy

## 🔧 Tech Stack

- React 18
- Vite
- CSS

## 📄 License

MIT

## 👨‍💻 Author

Your Name

---

Untuk kontribusi atau issue, silakan buka pull request atau issue di repository ini.
