import { useState } from "react";

const ACCENT = {
  purple: { bg: "#EEEDFE", text: "#3C3489", border: "#AFA9EC" },
  teal: { bg: "#E1F5EE", text: "#085041", border: "#5DCAA5" },
  coral: { bg: "#FAECE7", text: "#712B13", border: "#F0997B" },
  blue: { bg: "#E6F1FB", text: "#0C447C", border: "#85B7EB" },
  green: { bg: "#EAF3DE", text: "#27500A", border: "#97C459" },
};

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [serp, setSerp] = useState("");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);

  const colors = [ACCENT.purple, ACCENT.teal, ACCENT.coral, ACCENT.blue, ACCENT.green];

  async function generate() {
    if (!keyword.trim() || !serp.trim()) {
      setError("Isi keyword dan SERP data dulu ya.");
      return;
    }
    setError("");
    setLoading(true);
    setQueries([]);

    const prompt = `Kamu adalah SEO specialist untuk website properti Indonesia.

Main keyword: "${keyword}"

SERP data (meta titles, meta descriptions, PAA, related searches, AIO snippets dari 10 halaman top):
${serp}

Tugasmu: Buat 6-8 query/pertanyaan informatif dalam Bahasa Indonesia yang relevan untuk dijadikan bottom content di halaman listing properti.

Aturan:
- Fokus pada intent user yang muncul dari data SERP
- Prioritaskan topik yang paling sering muncul — jika tidak cukup 8 yang benar-benar berbeda, lebih baik 6 berkualitas daripada 8 repetitif
- Gunakan variasi topik: harga, spesifikasi, syarat, tips, lokasi, cara hitung, perbandingan, dll
- Tulis dalam bentuk pertanyaan natural seperti yang orang ketik di Google
- Jangan ulangi query yang mirip
- Buat query singkat dan padat; maksimal 70 karakter untuk kalimat utama (tidak termasuk catatan dalam kurung di akhir)
- Jika query menyebut lokasi/jalan/kawasan spesifik dalam kalimat (seperti "di jl. peta", "di kopo plaza"), ganti dengan kata generik seperti "di kawasan", "di area", atau hilangkan — detail lokasi cukup masuk ke catatan (sebut area: ...)
- Jika query menanyakan rekomendasi lokasi atau area yang cocok, gunakan frasa "area mana" atau "lokasi mana" bukan nama spesifik di kalimat utama
- Jika query berisi kalimat seperti "saya ingin mencari ..., harus mulai dari mana?" atau sejenisnya, ubah menjadi format "bagaimana jika saya ingin [aksi] [properti] di [lokasi]?" — sesuaikan aksi dengan konteks (cari, beli, sewa, jual beli, investasi, dll) berdasarkan apa yang muncul di SERP
- Jika perlu detail tambahan (spesifikasi, fasilitas, dll), gunakan format kurung di akhir seperti (luas tanah, bangunan, fasilitas, dll) bukan dimasukkan ke dalam kalimat utama
- Sertakan konteks spesifik dari keyword (nama area, tipe properti, dll)
- Semua output harus lowercase
- Jika kalimat adalah pertanyaan, akhiri dengan tanda tanya (?)
- Jika kalimat bukan pertanyaan, tidak perlu tanda tanya
- Jika query bersifat transaksional (user ingin beli, sewa, atau cari properti), tambahkan catatan dalam kurung di akhir: (arahkan ke brighton, layanan brighton)
- Jika dari SERP muncul area-area spesifik yang relevan (nama jalan, kawasan, kecamatan, dll), kumpulkan semua area tersebut dan jadikan satu baris tersendiri di akhir output dalam format: (sebut area: area1, area2, area3, dst) — bukan ditempel di query manapun
- Jangan tambahkan (sebut area: ...) ke dalam kalimat query sama sekali
- Output HANYA JSON array of strings, tanpa penjelasan, tanpa markdown backtick

Contoh output format:
["berapa harga ruko di ...?", "bagaimana jika saya tertarik sewa ruko di ...? (arahkan ke brighton, layanan brighton)", "spesifikasi ruko di ... (luas tanah, luas bangunan, jumlah lantai)", "(sebut area: ahmad yani, gatot subroto, gatot subroto, pinggir jalan)"]`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "[]";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQueries(Array.isArray(parsed) ? parsed.map(q => q.toLowerCase().trim()) : []);
    } catch (e) {
      setError("Gagal generate. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function copyAll() {
    const text = queries.map(q => q).join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  }

  async function copyOne(q, i) {
    try {
      await navigator.clipboard.writeText(q);
    } catch {
      const el = document.createElement("textarea");
      el.value = q;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" }}>
        SERP → Bottom Content Queries
      </h2>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>
        Paste main keyword dan raw SERP data, langsung dapat 6–8 query siap pakai.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Main Keyword
          </label>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="contoh: ruko dijual di bandung"
            style={{ width: "100%", boxSizing: "border-box", fontSize: 14, padding: "10px 14px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Raw SERP Data
          </label>
          <textarea
            value={serp}
            onChange={e => setSerp(e.target.value)}
            placeholder={"Paste semua dari SERP:\n- Meta titles & descriptions\n- People Also Ask\n- People Also Search\n- AIO snippets\n- Konten kompetitor (boleh campur semua)"}
            rows={10}
            style={{ width: "100%", boxSizing: "border-box", fontSize: 13, padding: "10px 14px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: "var(--color-text-danger)", margin: 0 }}>{error}</p>
        )}

        <button
          onClick={generate}
          disabled={loading}
          style={{ padding: "11px 20px", fontSize: 14, fontWeight: 500, borderRadius: "var(--border-radius-md)", border: "none", background: loading ? "var(--color-background-secondary)" : "#3C3489", color: loading ? "var(--color-text-secondary)" : "#fff", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Generating..." : "Generate Queries ↗"}
        </button>
      </div>

      {loading && (
        <div style={{ margin: "2rem 0", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3C3489", animation: "pulse 1s infinite" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#085041", animation: "pulse 1s 0.2s infinite" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#712B13", animation: "pulse 1s 0.4s infinite" }} />
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: 4 }}>Menganalisis SERP data...</span>
        </div>
      )}

      {queries.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Hasil — {queries.length} queries
              </span>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: ACCENT.teal.bg, color: ACCENT.teal.text, border: `0.5px solid ${ACCENT.teal.border}` }}>
                {keyword}
              </span>
            </div>
            <button
              onClick={copyAll}
              style={{ fontSize: 12, padding: "6px 12px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer" }}
            >
              {copied === "all" ? "✓ Copied all!" : "Copy semua"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {queries.map((q, i) => {
              const c = colors[i % colors.length];
              return (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: "var(--border-radius-md)", border: `0.5px solid ${c.border}`, background: c.bg }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500, minWidth: 22, height: 22, borderRadius: 99, background: c.text, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </span>
                  <span style={{ flex: 1, fontSize: 14, color: c.text, lineHeight: 1.6 }}>{q}</span>
                  <button
                    onClick={() => copyOne(q, i)}
                    style={{ fontSize: 11, padding: "4px 8px", borderRadius: "var(--border-radius-md)", border: `0.5px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer", flexShrink: 0 }}
                  >
                    {copied === i ? "✓" : "copy"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
