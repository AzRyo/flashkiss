import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  LayoutDashboard, Monitor, CreditCard, Receipt, Ticket, Image as ImageIcon,
  Wallet, Settings, Camera, X, Check, Plus, Trash2, Search, Download, Filter,
  Store, Sparkles, ChevronRight, QrCode, ArrowUpRight, ShieldCheck, Copy, Pencil,
} from "lucide-react";

const C = {
  bg: "#FBF4F1", panel: "#FFFFFF", ink: "#2A1620", sub: "#7A5A66",
  rose: "#D6336C", roseDeep: "#A61E4D", roseSoft: "#FBE3EC",
  gold: "#C2933F", goldSoft: "#F6ECD8", line: "#EAD9D0",
  green: "#2F9E6E", greenSoft: "#E3F4EC", red: "#C9453B",
};
const rp = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

function buildQR(seed) {
  const size = 25; let s = 7;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 1000000007;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const g = Array.from({ length: size }, () => Array.from({ length: size }, () => rand() > 0.5));
  const f = (r0, c0) => { for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
    const edge = r === 0 || r === 6 || c === 0 || c === 6, core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
    g[r0 + r][c0 + c] = edge || core; } };
  f(0, 0); f(0, size - 7); f(size - 7, 0); return g;
}
function QR({ seed }) {
  const g = useMemo(() => buildQR(seed), [seed]);
  return (
    <div className="inline-block p-3 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${g.length}, 6px)`, gridAutoRows: "6px" }}>
        {g.flatMap((row, r) => row.map((on, c) => (
          <div key={`${r}-${c}`} style={{ width: 6, height: 6, background: on ? C.ink : "transparent" }} />
        )))}
      </div>
    </div>
  );
}

// ---- seed data ----
const SEED_PKG = [
  { id: "p1", name: "Kilat", price: 15000, prints: 1, note: "1 sesi, 1 cetak strip", popular: true },
  { id: "p2", name: "Duo", price: 25000, prints: 2, note: "1 sesi, 2 cetak strip" },
  { id: "p3", name: "Pesta", price: 40000, prints: 4, note: "5 menit, 4 cetak strip" },
];
const SEED_BOOTH = [
  { id: "b1", device: "Redmi Pad 2", name: "Booth Senja", mode: "cafe", partner: "Kafe Senja", active: true },
  { id: "b2", device: "iPad 9th", name: "Booth Roastery", mode: "cafe", partner: "Roastery MM2100", active: true },
  { id: "b3", device: "Galaxy Tab A9", name: "Booth Event", mode: "private", partner: null, active: false },
];
const NAMES = ["Putri Maharani", "Dimas Aryo", "Salsa Nabila", "Reza Pratama", "Indah Lestari", "Bayu Saputra"];
const PKGN = ["Kilat", "Duo", "Pesta"];
const SEED_TX = Array.from({ length: 12 }).map((_, i) => {
  const price = [15000, 25000, 40000][i % 3];
  const mode = i % 4 === 0 ? "private" : "cafe";
  return {
    id: "cmqk" + (1000 + i).toString(36),
    time: `19 Jun 2026, ${(12 - Math.floor(i / 2))}.${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60}`,
    booth: i % 2 === 0 ? "Booth Senja" : "Booth Roastery",
    customer: NAMES[i % NAMES.length],
    pkg: PKGN[i % 3], price, mode,
    partner: mode === "cafe" ? (i % 2 === 0 ? "Kafe Senja" : "Roastery MM2100") : null,
    status: i === 3 ? "pending" : "paid", sesi: i === 3 ? "capturing" : i === 7 ? "failed" : "completed",
  };
});
const SEED_VOUCHER = [
  { id: "v1", code: "FLASH25", value: 10000, type: "Full Color", note: "Promo launching", status: "Aktif", exp: "26 Jun 2026", made: "25 Mei 2026" },
  { id: "v2", code: "KISSBW01", value: 15000, type: "Hitam Putih", note: "", status: "Digunakan", exp: "Tidak ada", made: "25 Mei 2026" },
];
const SEED_FRAME = [
  { id: "f1", name: "Tiket Bioskop", type: "Classic 2", shots: 2, on: true },
  { id: "f2", name: "Wanita Cantik & Sukses", type: "Solo", shots: 1, on: true },
  { id: "f3", name: "Favorit Music", type: "Solo", shots: 1, on: true },
  { id: "f4", name: "Graduation", type: "Classic 2", shots: 2, on: false },
];
const REVENUE_7D = [
  { d: "Rab", v: 45000 }, { d: "Kam", v: 80000 }, { d: "Jum", v: 120000 },
  { d: "Sab", v: 210000 }, { d: "Min", v: 175000 }, { d: "Sen", v: 60000 }, { d: "Sel", v: 95000 },
];

export default function FlashkissApp() {
  const [page, setPage] = useState("dashboard");
  const [mode, setMode] = useState("cafe");
  const [split, setSplit] = useState(75);
  const [packages, setPackages] = useState(SEED_PKG);
  const [booths, setBooths] = useState(SEED_BOOTH);
  const [activeBooth, setActiveBooth] = useState("b1");
  const [tx, setTx] = useState(SEED_TX);
  const [vouchers, setVouchers] = useState(SEED_VOUCHER);
  const [frames, setFrames] = useState(SEED_FRAME);
  const [midtrans, setMidtrans] = useState({ env: "sandbox", merchantId: "G123456789", clientKey: "", serverKey: "" });
  const [kiosk, setKiosk] = useState(null);
  const [voucherModal, setVoucherModal] = useState(false);
  const [frameUpload, setFrameUpload] = useState(false);

  const boothName = (id) => booths.find((b) => b.id === id)?.name;
  const boothObj = booths.find((b) => b.id === activeBooth) || booths[0];
  const shareCalc = (price, m) => m === "cafe"
    ? { op: Math.round(price * split / 100), cafe: Math.round(price * (100 - split) / 100) }
    : { op: price, cafe: 0 };

  const paid = tx.filter((t) => t.status === "paid");
  const totalRevenue = paid.reduce((a, t) => a + t.price, 0);
  const totalSessions = tx.filter((t) => t.sesi === "completed").length;
  const sesiDonut = [
    { name: "completed", v: tx.filter((t) => t.sesi === "completed").length, c: C.green },
    { name: "capturing", v: tx.filter((t) => t.sesi === "capturing").length, c: C.rose },
    { name: "failed", v: tx.filter((t) => t.sesi === "failed").length, c: C.red },
  ];

  const completePayment = () => {
    const p = kiosk.pkg;
    setTx((prev) => [{
      id: "cmqk" + Date.now().toString(36), time: "Baru saja", booth: boothObj.name,
      customer: "Pelanggan kiosk", pkg: p.name, price: p.price, mode,
      partner: mode === "cafe" ? boothObj.partner : null, status: "paid", sesi: "completed",
    }, ...prev]);
    setKiosk({ ...kiosk, step: "done" });
  };

  const NAV = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["perangkat", "Perangkat", Monitor],
    ["langganan", "Langganan", CreditCard],
    ["transaksi", "Transaksi", Receipt],
    ["voucher", "Voucher", Ticket],
    ["frame", "Frame", ImageIcon],
    ["keuangan", "Keuangan", Wallet],
    ["pengaturan", "Pengaturan", Settings],
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100%" }} className="text-[14px]">
      <style>{`input:focus,select:focus,textarea:focus{outline:2px solid ${C.rose};outline-offset:1px}`}</style>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 border-r flex flex-col" style={{ borderColor: C.line, background: C.panel, minHeight: 720 }}>
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.rose }}>
              <Camera size={18} color="#fff" />
            </div>
            <span className="font-serif text-xl tracking-tight">Flashkiss</span>
          </div>
          <nav className="px-3 flex-1">
            {NAV.map(([id, label, Icon]) => {
              const on = page === id;
              return (
                <button key={id} onClick={() => setPage(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 font-medium transition"
                  style={on ? { background: C.roseSoft, color: C.roseDeep } : { color: C.sub }}>
                  <Icon size={18} /> {label}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t" style={{ borderColor: C.line }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: C.ink }}>V</div>
              <div className="leading-tight">
                <div className="font-medium text-[13px]">Vian Eko Nugroho</div>
                <div className="text-xs" style={{ color: C.sub }}>Flashkiss owner</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-20" style={{ borderColor: C.line, background: C.bg }}>
            <div className="flex rounded-full p-1" style={{ background: C.roseSoft }}>
              {[["cafe", "Bagi Hasil Kafe"], ["private", "Flashkiss Pribadi"]].map(([m, l]) => (
                <button key={m} onClick={() => setMode(m)} className="px-3 py-1.5 rounded-full font-medium transition"
                  style={mode === m ? { background: C.rose, color: "#fff" } : { color: C.roseDeep }}>{l}</button>
              ))}
            </div>
            <button onClick={() => setKiosk({ step: "select", pkg: null })}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white" style={{ background: C.ink }}>
              <Sparkles size={16} /> Buka Kiosk
            </button>
          </div>

          <div className="p-6">
            {page === "dashboard" && (
              <Page title="Dashboard" sub="Performa booth Flashkiss minggu ini">
                <div className="grid grid-cols-4 gap-4">
                  <Stat label="Pendapatan hari ini" value={rp(60000)} icon={Wallet} c={C.rose} />
                  <Stat label="Pendapatan bulan ini" value={rp(1240000)} icon={ArrowUpRight} c={C.ink} />
                  <Stat label="Transaksi hari ini" value="4" icon={Receipt} c={C.gold} />
                  <Stat label="Perangkat aktif" value={`${booths.filter(b => b.active).length} / ${booths.length}`} icon={Monitor} c={C.green} />
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <Stat label="Total sesi (mingguan)" value={totalSessions} icon={Camera} c={C.roseDeep} />
                  <Stat label="Pendapatan mingguan" value={rp(785000)} icon={ArrowUpRight} c={C.rose} />
                  <div className="col-span-2 p-4 rounded-2xl flex items-center justify-between" style={{ background: C.ink }}>
                    <div>
                      <div className="text-xs" style={{ color: "#E7C9D5" }}>Saldo tersedia (withdraw)</div>
                      <div className="text-2xl font-bold text-white mt-1">{rp(597600)}</div>
                    </div>
                    <button onClick={() => setPage("keuangan")} className="px-4 py-2 rounded-full font-semibold text-white" style={{ background: C.rose }}>Tarik saldo</button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-5">
                  <div className="col-span-2 p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                    <div className="font-semibold mb-1">Pendapatan 7 hari terakhir</div>
                    <div className="text-xs mb-4" style={{ color: C.sub }}>Transaksi booth yang berhasil</div>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={REVENUE_7D}>
                          <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: C.sub, fontSize: 12 }} />
                          <Bar dataKey="v" radius={[6, 6, 0, 0]} fill={C.rose} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                    <div className="font-semibold mb-1">Sesi foto</div>
                    <div className="text-xs mb-2" style={{ color: C.sub }}>Total {tx.length} sesi</div>
                    <div style={{ height: 150 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={sesiDonut} dataKey="v" innerRadius={45} outerRadius={65} paddingAngle={3}>
                            {sesiDonut.map((e, i) => <Cell key={i} fill={e.c} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1 mt-2">
                      {sesiDonut.map((e) => (
                        <div key={e.name} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: e.c }} />{e.name}</span>
                          <span className="font-semibold">{e.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                  <div className="font-semibold mb-3">Transaksi terbaru</div>
                  {tx.slice(0, 4).map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: C.line }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.roseSoft }}><Camera size={16} color={C.roseDeep} /></div>
                        <div><div className="font-medium">{t.customer} · {t.pkg}</div><div className="text-xs" style={{ color: C.sub }}>{t.booth} · {t.time}</div></div>
                      </div>
                      <div className="text-right"><div className="font-semibold">{rp(t.price)}</div><Badge status={t.status} /></div>
                    </div>
                  ))}
                </div>
              </Page>
            )}

            {page === "perangkat" && (
              <Page title="Perangkat" sub="Booth dan tablet Flashkiss. Atur mode dan kafe tempat dipasang">
                <div className="space-y-3">
                  {booths.map((b) => (
                    <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{ background: C.panel, border: `1px solid ${activeBooth === b.id ? C.rose : C.line}` }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.roseSoft }}><Monitor size={20} color={C.roseDeep} /></div>
                      <div className="flex-1">
                        <div className="font-semibold">{b.name} <span className="text-xs font-normal" style={{ color: C.sub }}>· {b.device}</span></div>
                        <div className="text-sm" style={{ color: C.sub }}>{b.mode === "cafe" ? `Bagi hasil · ${b.partner}` : "Flashkiss pribadi"}</div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: b.active ? C.greenSoft : C.bg, color: b.active ? C.green : C.sub }}>{b.active ? "online" : "offline"}</span>
                      <button onClick={() => setActiveBooth(b.id)} className="px-3 py-1.5 rounded-full font-medium"
                        style={activeBooth === b.id ? { background: C.rose, color: "#fff" } : { background: C.bg, color: C.ink }}>
                        {activeBooth === b.id ? "Terpilih" : "Pilih"}
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setBooths((p) => [...p, { id: "b" + Date.now(), device: "Tablet baru", name: "Booth baru", mode: "cafe", partner: "Kafe baru", active: true }])}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white" style={{ background: C.rose }}><Plus size={16} /> Tambah perangkat</button>
              </Page>
            )}

            {page === "langganan" && (
              <Page title="Langganan" sub="Paket layanan Flashkiss Anda">
                <div className="p-6 rounded-2xl" style={{ background: C.ink }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs" style={{ color: "#E7C9D5" }}>Paket aktif</div>
                      <div className="font-serif text-2xl text-white mt-1">Pro Booth</div>
                      <div className="text-sm mt-1" style={{ color: "#E7C9D5" }}>Perangkat tanpa batas, semua frame, Midtrans QRIS</div>
                    </div>
                    <div className="text-right"><div className="text-2xl font-bold text-white">{rp(99000)}</div><div className="text-xs" style={{ color: "#E7C9D5" }}>per bulan</div></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[["Perangkat", "Tanpa batas"], ["Frame", "Semua jenis"], ["Tagihan berikut", "19 Jul 2026"]].map(([k, v]) => (
                    <div key={k} className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                      <div className="text-xs" style={{ color: C.sub }}>{k}</div><div className="font-semibold text-lg mt-1">{v}</div>
                    </div>
                  ))}
                </div>
              </Page>
            )}

            {page === "transaksi" && (
              <Page title="Transaksi" sub="Riwayat sesi dan pembagian otomatis sesuai mode"
                action={<button className="flex items-center gap-2 px-4 py-2 rounded-full font-medium" style={{ background: C.panel, border: `1px solid ${C.line}` }}><Download size={15} /> Export CSV</button>}>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="p-4 rounded-2xl" style={{ background: C.roseSoft }}>
                    <div className="text-xs" style={{ color: C.roseDeep }}>Total pendapatan (paid)</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: C.roseDeep }}>{rp(totalRevenue)}</div>
                  </div>
                  <Stat label="Jumlah transaksi" value={tx.length} icon={Receipt} c={C.ink} />
                  <Stat label="Bagian kafe (paid)" value={rp(paid.reduce((a, t) => a + shareCalc(t.price, t.mode).cafe, 0))} icon={Store} c={C.gold} />
                </div>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                    <Search size={16} color={C.sub} /><input placeholder="Cari ID, pelanggan, device..." className="bg-transparent flex-1" />
                  </div>
                  <button className="flex items-center gap-2 px-3 rounded-xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}><Filter size={16} /></button>
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
                  <div className="grid gap-2 px-4 py-3 text-xs font-semibold" style={{ gridTemplateColumns: "1.4fr 1.4fr 1.2fr 1fr .9fr 1fr 1fr", background: C.roseSoft, color: C.roseDeep }}>
                    <span>ID</span><span>Waktu</span><span>Pelanggan</span><span>Jumlah</span><span>Status</span><span>Sesi</span><span>Bagi hasil</span>
                  </div>
                  {tx.map((t) => {
                    const s = shareCalc(t.price, t.mode);
                    return (
                      <div key={t.id} className="grid gap-2 px-4 py-3 border-t items-center" style={{ gridTemplateColumns: "1.4fr 1.4fr 1.2fr 1fr .9fr 1fr 1fr", borderColor: C.line, background: C.panel }}>
                        <span className="font-mono text-xs" style={{ color: C.sub }}>{t.id}</span>
                        <span className="text-xs">{t.time}</span>
                        <span className="text-xs">{t.customer}</span>
                        <span className="font-semibold">{rp(t.price)}</span>
                        <Badge status={t.status} />
                        <Badge sesi={t.sesi} />
                        <span className="text-xs" style={{ color: C.gold }}>{t.mode === "cafe" ? rp(s.cafe) : "-"}</span>
                      </div>
                    );
                  })}
                </div>
              </Page>
            )}

            {page === "voucher" && (
              <Page title="Voucher" sub="Kode potongan harga untuk promo Flashkiss"
                action={<button onClick={() => setVoucherModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white" style={{ background: C.rose }}><Plus size={16} /> Buat voucher</button>}>
                <div className="grid grid-cols-4 gap-4 mb-5">
                  <Stat label="Total" value={vouchers.length} icon={Ticket} c={C.ink} />
                  <Stat label="Aktif" value={vouchers.filter(v => v.status === "Aktif").length} icon={Check} c={C.green} />
                  <Stat label="Digunakan" value={vouchers.filter(v => v.status === "Digunakan").length} icon={ShieldCheck} c={C.rose} />
                  <Stat label="Nonaktif" value={vouchers.filter(v => v.status === "Nonaktif").length} icon={X} c={C.sub} />
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
                  <div className="grid gap-2 px-4 py-3 text-xs font-semibold" style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1.4fr 1fr 1fr", background: C.roseSoft, color: C.roseDeep }}>
                    <span>Kode</span><span>Nilai</span><span>Tipe</span><span>Catatan</span><span>Kedaluwarsa</span><span>Status</span>
                  </div>
                  {vouchers.map((v) => (
                    <div key={v.id} className="grid gap-2 px-4 py-3 border-t items-center" style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1.4fr 1fr 1fr", borderColor: C.line, background: C.panel }}>
                      <span className="font-mono font-semibold flex items-center gap-1">{v.code} <Copy size={12} color={C.sub} /></span>
                      <span>{rp(v.value)}</span>
                      <span className="text-xs">{v.type}</span>
                      <span className="text-xs" style={{ color: C.sub }}>{v.note || "-"}</span>
                      <span className="text-xs">{v.exp}</span>
                      <span className="text-xs px-2 py-1 rounded-full text-center" style={{ background: v.status === "Aktif" ? C.greenSoft : C.bg, color: v.status === "Aktif" ? C.green : C.sub }}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </Page>
            )}

            {page === "frame" && (
              <Page title="Koleksi Frame" sub="Frame PNG 1200 x 1800 px. Atur posisi foto setelah upload"
                action={<button onClick={() => setFrameUpload(true)} className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white" style={{ background: C.rose }}><Plus size={16} /> Upload frame</button>}>
                <div className="grid grid-cols-4 gap-4">
                  {frames.map((f) => (
                    <div key={f.id} className="rounded-2xl overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                      <div className="aspect-[3/4] flex flex-col items-center justify-center gap-2 m-3 rounded-xl" style={{ background: C.roseSoft }}>
                        <ImageIcon size={26} color={C.roseDeep} />
                        <span className="font-serif text-sm" style={{ color: C.roseDeep }}>Flashkiss</span>
                        <span className="text-[10px]" style={{ color: C.sub }}>{f.shots} foto</span>
                      </div>
                      <div className="px-3 pb-3 flex items-center justify-between">
                        <div><div className="font-medium text-sm">{f.name}</div><div className="text-xs" style={{ color: C.sub }}>{f.type}</div></div>
                        <button onClick={() => setFrames((p) => p.map((x) => x.id === f.id ? { ...x, on: !x.on } : x))}
                          className="w-10 h-6 rounded-full p-0.5 transition" style={{ background: f.on ? C.rose : C.line }}>
                          <div className="w-5 h-5 rounded-full bg-white transition" style={{ transform: f.on ? "translateX(16px)" : "none" }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Page>
            )}

            {page === "keuangan" && (
              <Page title="Keuangan" sub="Kelola saldo dan penarikan dana"
                action={<button className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white" style={{ background: C.rose }}><ArrowUpRight size={16} /> Tarik saldo</button>}>
                <div className="grid grid-cols-3 gap-4">
                  <Stat label="Total omzet (142 transaksi)" value={rp(totalRevenue)} icon={Wallet} c={C.ink} />
                  <Stat label="Saldo terdeposit" value={rp(7000)} icon={CreditCard} c={C.green} />
                  <Stat label="Sudah ditarik" value={rp(0)} icon={ArrowUpRight} c={C.gold} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-5 rounded-2xl" style={{ background: C.roseSoft }}>
                    <div className="text-xs font-semibold tracking-wide" style={{ color: C.roseDeep }}>SALDO TERSEDIA</div>
                    <div className="text-3xl font-bold mt-1" style={{ color: C.ink }}>{rp(597600)}</div>
                    <div className="text-sm mt-1" style={{ color: C.sub }}>Siap ditarik ke rekening Anda</div>
                    <div className="flex items-center gap-2 mt-3 text-xs font-medium" style={{ color: C.green }}><ShieldCheck size={14} /> Akun terverifikasi</div>
                  </div>
                  <div className="p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                    <div className="font-semibold mb-2">Informasi penarikan</div>
                    <ul className="space-y-1.5 text-sm" style={{ color: C.sub }}>
                      <li>Proses 7 sampai 14 hari kerja.</li>
                      <li>Minimal penarikan Rp50.000.</li>
                      <li>Potongan QRIS Midtrans 0,7% per transaksi sukses.</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                  <div className="font-semibold mb-3">Riwayat saldo</div>
                  <div className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: C.line }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.greenSoft }}><ArrowUpRight size={16} color={C.green} style={{ transform: "rotate(180deg)" }} /></div>
                      <div><div className="font-medium text-sm">Penjualan foto via Midtrans QRIS</div><div className="text-xs" style={{ color: C.sub }}>23 Jun 2026 · potongan 0,7%</div></div>
                    </div>
                    <span className="font-semibold" style={{ color: C.green }}>+{rp(14895)}</span>
                  </div>
                </div>
              </Page>
            )}

            {page === "pengaturan" && (
              <Page title="Pengaturan" sub="Paket harga, bagi hasil, dan koneksi Midtrans">
                <div className="p-5 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                  <div className="font-semibold mb-3">Paket & harga</div>
                  {packages.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: C.line }}>
                      <input value={p.name} onChange={(e) => setPackages((pr) => pr.map((x) => x.id === p.id ? { ...x, name: e.target.value } : x))} className="font-medium bg-transparent flex-1" />
                      <span style={{ color: C.sub }}>Rp</span>
                      <input type="number" value={p.price} onChange={(e) => setPackages((pr) => pr.map((x) => x.id === p.id ? { ...x, price: Number(e.target.value) } : x))}
                        className="w-28 text-right font-semibold px-2 py-1 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.line}` }} />
                      <button onClick={() => setPackages((pr) => pr.filter((x) => x.id !== p.id))} style={{ color: C.roseDeep }}><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button onClick={() => setPackages((p) => [...p, { id: "p" + Date.now(), name: "Paket baru", price: 20000, prints: 1, note: "1 sesi" }])}
                    className="mt-3 flex items-center gap-2 text-sm font-medium" style={{ color: C.rose }}><Plus size={15} /> Tambah paket</button>
                </div>

                <div className="p-5 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                  <div className="font-semibold mb-1">Bagi hasil mode kafe</div>
                  <div className="text-sm mb-3" style={{ color: C.sub }}>Flashkiss {split}% · kafe {100 - split}%</div>
                  <input type="range" min="50" max="90" value={split} onChange={(e) => setSplit(Number(e.target.value))} className="w-full" style={{ accentColor: C.rose }} />
                </div>

                <div className="p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                  <div className="flex items-center gap-2 mb-4"><CreditCard size={18} color={C.rose} /><span className="font-semibold">Koneksi Midtrans QRIS</span></div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Lingkungan">
                      <select value={midtrans.env} onChange={(e) => setMidtrans({ ...midtrans, env: e.target.value })} className="w-full px-3 py-2 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
                        <option value="sandbox">Sandbox (uji coba)</option><option value="production">Production (live)</option>
                      </select>
                    </Field>
                    <Field label="Merchant ID"><input value={midtrans.merchantId} onChange={(e) => setMidtrans({ ...midtrans, merchantId: e.target.value })} className="w-full px-3 py-2 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.line}` }} /></Field>
                    <Field label="Client Key"><input value={midtrans.clientKey} placeholder="SB-Mid-client-xxxx" onChange={(e) => setMidtrans({ ...midtrans, clientKey: e.target.value })} className="w-full px-3 py-2 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.line}` }} /></Field>
                    <Field label="Server Key (disimpan di server)"><input type="password" value={midtrans.serverKey} placeholder="••••••••" onChange={(e) => setMidtrans({ ...midtrans, serverKey: e.target.value })} className="w-full px-3 py-2 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.line}` }} /></Field>
                  </div>
                  <div className="mt-3 text-xs p-3 rounded-lg" style={{ background: C.goldSoft, color: C.gold }}>Server Key tidak boleh ada di kode browser. Backend yang memakainya untuk membuat QR dan menerima notifikasi pembayaran.</div>
                </div>
              </Page>
            )}
          </div>
        </main>
      </div>

      {/* Voucher modal */}
      {voucherModal && (
        <Modal onClose={() => setVoucherModal(false)} title="Buat voucher">
          <Field label="Jumlah voucher"><input defaultValue="1" className="w-full px-3 py-2 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.line}` }} /></Field>
          <Field label="Tipe cetak">
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 rounded-lg font-medium" style={{ background: C.roseSoft, color: C.roseDeep }}>Hitam Putih</button>
              <button className="py-2 rounded-lg font-medium" style={{ background: C.bg, border: `1px solid ${C.line}` }}>Full Color</button>
            </div>
          </Field>
          <Field label="Nilai kustom (opsional)"><input placeholder="Kosongkan untuk harga default" className="w-full px-3 py-2 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.line}` }} /></Field>
          <Field label="Catatan (opsional)"><input placeholder="Contoh: Promo launching" className="w-full px-3 py-2 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.line}` }} /></Field>
          <button onClick={() => {
            const code = Array.from({ length: 6 }, () => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]).join("");
            setVouchers((p) => [{ id: "v" + Date.now(), code, value: 10000, type: "Hitam Putih", note: "Promo launching", status: "Aktif", exp: "Tidak ada", made: "Hari ini" }, ...p]);
            setVoucherModal(false);
          }} className="w-full py-3 rounded-full font-semibold text-white mt-2" style={{ background: C.rose }}>Buat voucher</button>
        </Modal>
      )}

      {/* Frame upload modal */}
      {frameUpload && (
        <Modal onClose={() => setFrameUpload(false)} title="Upload frame baru">
          <Field label="Nama frame"><input placeholder="Contoh: Frame Ulang Tahun" className="w-full px-3 py-2 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.line}` }} /></Field>
          <Field label="Jumlah foto">
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((n) => <button key={n} className="py-2 rounded-lg font-medium" style={n === 1 ? { background: C.roseSoft, color: C.roseDeep } : { background: C.bg, border: `1px solid ${C.line}` }}>{n} Foto</button>)}
            </div>
          </Field>
          <Field label="Ukuran cetak">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["Standard 4R 1200x1800", "Standard A4 1200x1697", "2R Strip 1200x2400", "Long Strip 1200x3600"].map((s, i) => (
                <button key={s} className="py-2 rounded-lg font-medium" style={i === 0 ? { background: C.roseSoft, color: C.roseDeep } : { background: C.bg, border: `1px solid ${C.line}` }}>{s}</button>
              ))}
            </div>
          </Field>
          <Field label="Background frame">
            <div className="px-3 py-6 rounded-lg text-center text-sm" style={{ background: C.bg, border: `1px dashed ${C.line}`, color: C.sub }}>Pilih file PNG / JPG / WebP</div>
          </Field>
          <button onClick={() => {
            setFrames((p) => [...p, { id: "f" + Date.now(), name: "Frame baru", type: "Solo", shots: 1, on: true }]);
            setFrameUpload(false);
          }} className="w-full py-3 rounded-full font-semibold text-white mt-2" style={{ background: C.rose }}>Lanjut: atur posisi foto</button>
        </Modal>
      )}

      {/* Kiosk */}
      {kiosk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(42,22,32,0.55)" }}>
          <div className="w-full max-w-md rounded-3xl overflow-hidden" style={{ background: C.bg }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ background: C.rose }}>
              <div className="flex items-center gap-2 text-white"><Camera size={18} /><span className="font-serif text-lg">Flashkiss Kiosk</span></div>
              <button onClick={() => setKiosk(null)} className="text-white"><X size={20} /></button>
            </div>
            <div className="p-6">
              {kiosk.step === "select" && (
                <>
                  <div className="text-center mb-5">
                    <div className="font-serif text-2xl">Pilih paket foto</div>
                    <div className="text-sm" style={{ color: C.sub }}>{mode === "cafe" ? `di ${boothObj.partner}` : "Flashkiss Pribadi"}</div>
                  </div>
                  <div className="space-y-3">
                    {packages.map((p) => (
                      <button key={p.id} onClick={() => setKiosk({ step: "pay", pkg: p })} className="w-full flex items-center justify-between p-4 rounded-2xl text-left"
                        style={{ background: C.panel, border: `1px solid ${p.popular ? C.rose : C.line}` }}>
                        <div>
                          <div className="font-semibold flex items-center gap-2">{p.name}{p.popular && <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: C.rose }}>populer</span>}</div>
                          <div className="text-sm" style={{ color: C.sub }}>{p.note}</div>
                        </div>
                        <div className="flex items-center gap-2"><span className="font-bold text-lg">{rp(p.price)}</span><ChevronRight size={18} color={C.sub} /></div>
                      </button>
                    ))}
                  </div>
                </>
              )}
              {kiosk.step === "pay" && (
                <div className="text-center">
                  <div className="font-serif text-2xl mb-1">Scan untuk bayar</div>
                  <div className="text-sm mb-4" style={{ color: C.sub }}>{kiosk.pkg.name} · {rp(kiosk.pkg.price)}</div>
                  <QR seed={kiosk.pkg.id + kiosk.pkg.price} />
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs" style={{ color: C.sub }}><QrCode size={14} /> QRIS · semua e-wallet & bank</div>
                  <button onClick={completePayment} className="mt-5 w-full py-3 rounded-full font-semibold text-white" style={{ background: C.ink }}>Simulasikan pembayaran berhasil</button>
                  <div className="text-xs mt-2" style={{ color: C.sub }}>Di sistem asli, ini diganti notifikasi otomatis Midtrans.</div>
                </div>
              )}
              {kiosk.step === "done" && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: C.rose }}><Check size={30} color="#fff" /></div>
                  <div className="font-serif text-2xl mb-1">Pembayaran diterima</div>
                  <div className="text-sm mb-5" style={{ color: C.sub }}>Sesi {kiosk.pkg.name} siap. Senyum.</div>
                  {mode === "cafe" && <div className="text-sm p-3 rounded-xl mb-4" style={{ background: C.goldSoft, color: C.gold }}>{boothObj.partner} dapat {rp(shareCalc(kiosk.pkg.price, "cafe").cafe)} dari sesi ini</div>}
                  <button onClick={() => setKiosk(null)} className="w-full py-3 rounded-full font-semibold text-white" style={{ background: C.rose }}>Selesai</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Page({ title, sub, action, children }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div><div className="font-serif text-2xl">{title}</div><div className="text-sm" style={{ color: C.sub }}>{sub}</div></div>
        {action}
      </div>
      {children}
    </div>
  );
}
function Stat({ label, value, icon: Icon, c }) {
  return (
    <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.roseSoft }}><Icon size={18} color={c} /></div>
      </div>
      <div className="text-2xl font-bold" style={{ color: c }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: C.sub }}>{label}</div>
    </div>
  );
}
function Field({ label, children }) {
  return <div className="mb-3"><div className="text-xs font-medium mb-1.5" style={{ color: C.sub }}>{label}</div>{children}</div>;
}
function Badge({ status, sesi }) {
  if (sesi) {
    const map = { completed: [C.greenSoft, C.green], capturing: [C.roseSoft, C.roseDeep], failed: ["#FBE0DD", C.red] };
    const [bg, fg] = map[sesi] || [C.bg, C.sub];
    return <span className="text-xs px-2 py-1 rounded-full text-center" style={{ background: bg, color: fg }}>{sesi}</span>;
  }
  const map = { paid: [C.greenSoft, C.green, "Berhasil"], pending: [C.goldSoft, C.gold, "Pending"] };
  const [bg, fg, label] = map[status] || [C.bg, C.sub, status];
  return <span className="text-xs px-2 py-1 rounded-full" style={{ background: bg, color: fg }}>{label}</span>;
}
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(42,22,32,0.55)" }}>
      <div className="w-full max-w-sm rounded-3xl p-6" style={{ background: C.panel }}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-serif text-xl">{title}</span>
          <button onClick={onClose} style={{ color: C.sub }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
