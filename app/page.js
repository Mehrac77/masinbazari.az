"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Calendar, Gauge, Fuel, Settings2, X, Plus, ArrowLeft, Check, Phone, Heart, ImagePlus } from "lucide-react";
import { supabase } from "../lib/supabase";

const C = {
  asphalt: "#1C1E22",
  asphalt2: "#26292F",
  steel: "#2C4870",
  steelDark: "#1F3455",
  yellow: "#F2B705",
  cream: "#F6F4EF",
  red: "#C1443C",
  grey: "#8A8F98",
  greyLight: "#D8D6CF",
};

const BRANDS = ["Mercedes-Benz", "BMW", "Toyota", "Hyundai", "Kia", "Chevrolet", "VAZ (Lada)", "Nissan", "Volkswagen", "Mitsubishi"];
const CITIES = ["Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", "Şəki", "Lənkəran"];
const FUELS = ["Benzin", "Dizel", "Qaz", "Hibrid", "Elektro"];
const GEARS = ["Avtomat", "Mexanika", "Robot"];

const seedListings = [
  { id: "l1", brand: "Mercedes-Benz", model: "E 200", year: 2019, price: 48500, mileage: 62000, fuel: "Benzin", gear: "Avtomat", city: "Bakı", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80", featured: true, desc: "Rəsmi diler xidməti, qəzasız, tam yığma." },
  { id: "l2", brand: "BMW", model: "320i", year: 2018, price: 39900, mileage: 71000, fuel: "Benzin", gear: "Avtomat", city: "Bakı", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80", featured: true, desc: "M-paket, orijinal boya, ikinci sahib." },
  { id: "l3", brand: "Toyota", model: "Camry", year: 2020, price: 52000, mileage: 34000, fuel: "Hibrid", gear: "Avtomat", city: "Sumqayıt", img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80", featured: false, desc: "Hibrid mühərrik, aşağı yanacaq sərfiyyatı." },
  { id: "l4", brand: "VAZ (Lada)", model: "Granta", year: 2021, price: 14200, mileage: 21000, fuel: "Benzin", gear: "Mexanika", city: "Gəncə", img: "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80", featured: false, desc: "Yeni kimi, qulluqlu, birinci sahib." },
  { id: "l5", brand: "Hyundai", model: "Elantra", year: 2022, price: 31500, mileage: 12000, fuel: "Benzin", gear: "Avtomat", city: "Bakı", img: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80", featured: true, desc: "Zəmanət altında, minimal yürüş." },
  { id: "l6", brand: "Kia", model: "Sportage", year: 2020, price: 43800, mileage: 45000, fuel: "Dizel", gear: "Avtomat", city: "Mingəçevir", img: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&q=80", featured: false, desc: "Tam dolğun, panoramik lyuk, dəri salon." },
  { id: "l7", brand: "Chevrolet", model: "Malibu", year: 2017, price: 22900, mileage: 88000, fuel: "Benzin", gear: "Avtomat", city: "Bakı", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80", featured: false, desc: "Rahat sürüş, geniş salon, ailəvi maşın." },
  { id: "l8", brand: "Volkswagen", model: "Passat", year: 2019, price: 37200, mileage: 55000, fuel: "Dizel", gear: "Robot", city: "Lənkəran", img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80", featured: false, desc: "Alman keyfiyyəti, qənaətcil dizel." },
];

const fmtPrice = (n) => n.toLocaleString("az-AZ") + " ₼";
const fmtKm = (n) => n.toLocaleString("az-AZ") + " km";

const Plate = ({ children, tone = "yellow", small }) => (
  <div style={{
    background: tone === "yellow" ? C.yellow : tone === "dark" ? C.asphalt : C.cream,
    color: tone === "yellow" ? C.asphalt : tone === "dark" ? C.yellow : C.asphalt,
    border: `2px solid ${C.asphalt}`, borderRadius: 4, padding: small ? "2px 7px" : "5px 12px",
    fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: small ? 11 : 15,
    letterSpacing: 0.5, display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
  }}>{children}</div>
);

function ListingCard({ l, onOpen, fav, toggleFav }) {
  return (
    <div onClick={() => onOpen(l)} style={{
      background: "#fff", border: `1px solid ${C.greyLight}`, borderRadius: 10, overflow: "hidden",
      cursor: "pointer", position: "relative",
    }}>
      <div style={{ position: "relative", height: 168, background: C.asphalt2 }}>
        <img src={l.img} alt={`${l.brand} ${l.model}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {l.featured && <div style={{ position: "absolute", top: 10, left: 10 }}><Plate tone="dark" small>SEÇİLMİŞ</Plate></div>}
        <button onClick={(e) => { e.stopPropagation(); toggleFav(l.id); }} style={{
          position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%",
          border: "none", background: "rgba(28,30,34,0.55)", display: "grid", placeItems: "center", cursor: "pointer",
        }}><Heart size={16} color={fav ? C.red : "#fff"} fill={fav ? C.red : "none"} /></button>
        <div style={{ position: "absolute", bottom: 10, right: 10 }}><Plate>{fmtPrice(l.price)}</Plate></div>
      </div>
      <div style={{ padding: "14px 14px 16px" }}>
        <div style={{ fontFamily: "Oswald", fontWeight: 600, fontSize: 18, color: C.asphalt }}>{l.brand} {l.model}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          <span style={metaStyle}><Calendar size={13} /> {l.year}</span>
          <span style={metaStyle}><Gauge size={13} /> {fmtKm(l.mileage)}</span>
          <span style={metaStyle}><Fuel size={13} /> {l.fuel}</span>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5, color: C.grey, fontSize: 12.5 }}>
          <MapPin size={13} /> {l.city}
        </div>
      </div>
    </div>
  );
}
const metaStyle = { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#565A62", fontWeight: 600 };

const Chip = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${active ? C.steel : C.greyLight}`,
    background: active ? C.steel : "#fff", color: active ? "#fff" : C.asphalt,
    fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
  }}>{children}</button>
);

function AddListingModal({ onClose, onSave }) {
  const [f, setF] = useState({ brand: BRANDS[0], model: "", year: 2020, price: "", mileage: "", fuel: FUELS[0], gear: GEARS[0], city: CITIES[0], desc: "", phone: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const handleFile = (e) => {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  };

  const submit = async () => {
    if (!f.model || !f.price) return;
    setSaving(true);
    setError("");
    try {
      let imgUrl = "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80";

      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("car-images").upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from("car-images").getPublicUrl(fileName);
        imgUrl = publicData.publicUrl;
      }

      const newListing = {
        id: "u" + Date.now(),
        brand: f.brand, model: f.model, year: Number(f.year), price: Number(f.price),
        mileage: Number(f.mileage) || 0, fuel: f.fuel, gear: f.gear, city: f.city,
        img: imgUrl, desc: f.desc || "Təsvir əlavə edilməyib.", phone: f.phone,
      };

      const { error: insertError } = await supabase.from("listings").insert(newListing);
      if (insertError) throw insertError;

      onSave({ ...newListing, featured: false });
      setSaved(true);
      setTimeout(onClose, 900);
    } catch (err) {
      setError("Xəta baş verdi: " + (err.message || "yenidən cəhd et"));
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 7, border: `1.5px solid ${C.greyLight}`, fontSize: 14, marginTop: 5, boxSizing: "border-box" };
  const label = { fontWeight: 700, fontSize: 12.5, color: "#565A62", textTransform: "uppercase", letterSpacing: 0.4 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,30,34,0.6)", zIndex: 50, display: "grid", placeItems: "center", padding: 16 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, maxWidth: 520, width: "100%", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.greyLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff" }}>
          <div style={{ fontFamily: "Oswald", fontWeight: 600, fontSize: 20, color: C.asphalt }}>Elan yerləşdir</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={20} /></button>
        </div>
        {saved ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.steel, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
              <Check color="#fff" size={26} />
            </div>
            <div style={{ fontFamily: "Oswald", fontSize: 18, color: C.asphalt }}>Elan yerləşdirildi</div>
          </div>
        ) : (
          <div style={{ padding: 22, display: "grid", gap: 14 }}>
            <div>
              <label style={label}>Şəkil</label>
              <label htmlFor="carImageInput" style={{
                marginTop: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 6, border: `2px dashed ${C.greyLight}`, borderRadius: 8, padding: preview ? 0 : "22px 10px",
                cursor: "pointer", overflow: "hidden", background: C.cream,
              }}>
                {preview ? (
                  <img src={preview} alt="Önizləmə" style={{ width: "100%", height: 160, objectFit: "cover" }} />
                ) : (
                  <>
                    <ImagePlus size={22} color={C.grey} />
                    <span style={{ fontSize: 13, color: C.grey, fontWeight: 600 }}>Şəkil seçmək üçün klik et</span>
                  </>
                )}
              </label>
              <input id="carImageInput" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={label}>Marka</label><select style={inputStyle} value={f.brand} onChange={set("brand")}>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select></div>
              <div><label style={label}>Model</label><input style={inputStyle} placeholder="məs. Camry" value={f.model} onChange={set("model")} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={label}>Buraxılış ili</label><input type="number" style={inputStyle} value={f.year} onChange={set("year")} /></div>
              <div><label style={label}>Qiymət (₼)</label><input type="number" style={inputStyle} placeholder="məs. 25000" value={f.price} onChange={set("price")} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={label}>Yürüş (km)</label><input type="number" style={inputStyle} placeholder="məs. 45000" value={f.mileage} onChange={set("mileage")} /></div>
              <div><label style={label}>Şəhər</label><select style={inputStyle} value={f.city} onChange={set("city")}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={label}>Yanacaq növü</label><select style={inputStyle} value={f.fuel} onChange={set("fuel")}>{FUELS.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div><label style={label}>Sürətlər qutusu</label><select style={inputStyle} value={f.gear} onChange={set("gear")}>{GEARS.map((c) => <option key={c}>{c}</option>)}</select></div>
            </div>
            <div><label style={label}>Əlaqə nömrəsi</label><input style={inputStyle} placeholder="+994 XX XXX XX XX" value={f.phone} onChange={set("phone")} /></div>
            <div><label style={label}>Təsvir</label><textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={f.desc} onChange={set("desc")} placeholder="Avtomobil haqqında qısa məlumat..." /></div>

            {error && <div style={{ color: C.red, fontSize: 13, fontWeight: 600 }}>{error}</div>}

            <button onClick={submit} disabled={saving} style={{ marginTop: 4, padding: "13px", borderRadius: 8, border: "none", background: C.yellow, color: C.asphalt, fontFamily: "Oswald", fontWeight: 600, fontSize: 15.5, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Yüklənir..." : "Elanı yerləşdir"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailView({ l, onBack }) {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "22px 18px 60px" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", cursor: "pointer", color: C.steel, fontWeight: 700, fontSize: 14, marginBottom: 16, padding: 0 }}>
        <ArrowLeft size={16} /> Bazara qayıt
      </button>
      <div style={{ borderRadius: 12, overflow: "hidden", height: 340, background: C.asphalt2 }}>
        <img src={l.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 30, color: C.asphalt }}>{l.brand} {l.model}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.grey, fontSize: 14, marginTop: 6 }}><MapPin size={15} /> {l.city}</div>
        </div>
        <Plate>{fmtPrice(l.price)}</Plate>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginTop: 24 }}>
        {[{ icon: Calendar, label: "İl", val: l.year }, { icon: Gauge, label: "Yürüş", val: fmtKm(l.mileage) }, { icon: Fuel, label: "Yanacaq", val: l.fuel }, { icon: Settings2, label: "Sürətlər qutusu", val: l.gear }].map((s, i) => (
          <div key={i} style={{ background: C.cream, borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
            <s.icon size={18} color={C.steel} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 11.5, color: C.grey, fontWeight: 700, textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontFamily: "Oswald", fontSize: 16, color: C.asphalt, marginTop: 2 }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily: "Oswald", fontWeight: 600, fontSize: 18, color: C.asphalt, marginBottom: 8 }}>Təsvir</div>
        <p style={{ fontSize: 15, color: "#3F434A", lineHeight: 1.6 }}>{l.desc}</p>
      </div>
      <div style={{ marginTop: 26, background: C.asphalt, borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ color: C.grey, fontSize: 12.5, fontWeight: 700, textTransform: "uppercase" }}>Satıcı ilə əlaqə</div>
          <div style={{ fontFamily: "'Space Mono', monospace", color: C.yellow, fontSize: 18, marginTop: 4 }}>{l.phone || "0775567940"}</div>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 8, border: "none", background: C.yellow, color: C.asphalt, fontFamily: "Oswald", fontWeight: 600, fontSize: 14.5, cursor: "pointer" }}>
          <Phone size={16} /> Zəng et
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [listings, setListings] = useState(seedListings);
  const [view, setView] = useState({ page: "home" });
  const [showAdd, setShowAdd] = useState(false);
  const [brandFilter, setBrandFilter] = useState("Hamısı");
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [favs, setFavs] = useState({});

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        setListings([...data, ...seedListings]);
      }
    })();
  }, []);

  const addListing = (l) => setListings((prev) => [l, ...prev]);
  const toggleFav = (id) => setFavs((f) => ({ ...f, [id]: !f[id] }));

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (brandFilter !== "Hamısı" && l.brand !== brandFilter) return false;
      if (maxPrice && l.price > Number(maxPrice)) return false;
      if (query && !(`${l.brand} ${l.model}`.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [listings, brandFilter, maxPrice, query]);

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", background: C.cream, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: C.asphalt, padding: "14px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => setView({ page: "home" })} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, background: C.yellow, borderRadius: 6, display: "grid", placeItems: "center", fontFamily: "Oswald", fontWeight: 700, color: C.asphalt, fontSize: 16 }}>M</div>
            <span style={{ fontFamily: "Oswald", fontWeight: 600, fontSize: 20, color: "#fff" }}>maşınbazarı<span style={{ color: C.yellow }}>.az</span></span>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 7, border: "none", background: C.yellow, color: C.asphalt, fontWeight: 800, fontSize: 13.5, cursor: "pointer" }}>
            <Plus size={16} /> Elan yerləşdir
          </button>
        </div>
      </header>

      {view.page === "detail" ? (
        <DetailView l={view.listing} onBack={() => setView({ page: "home" })} />
      ) : (
        <>
          <div style={{ background: `linear-gradient(180deg, ${C.asphalt} 0%, ${C.steelDark} 100%)`, padding: "42px 20px 34px" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto" }}>
              <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "clamp(26px,4vw,42px)", color: "#fff", maxWidth: 640, lineHeight: 1.15 }}>
                Maşın al, maşın sat, <span style={{ color: C.yellow }}>bazarlıq et.</span>
              </div>
              <p style={{ color: "#B9C1CE", fontSize: 15, marginTop: 10, maxWidth: 520 }}>
                Azərbaycanın hər guşəsindən minlərlə elan — birbaşa sahibindən, vasitəçisiz.
              </p>
              <div style={{ marginTop: 24, background: "#fff", border: `3px solid ${C.asphalt}`, borderRadius: 8, padding: 6, display: "flex", gap: 8, maxWidth: 720, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", flex: "2 1 220px", gap: 8, padding: "8px 10px" }}>
                  <Search size={17} color={C.grey} />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Marka və ya model axtar..." style={{ border: "none", outline: "none", fontSize: 14.5, width: "100%" }} />
                </div>
                <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Maks. qiymət (₼)" type="number" style={{ flex: "1 1 140px", border: `1.5px solid ${C.greyLight}`, borderRadius: 5, padding: "8px 10px", fontFamily: "'Space Mono', monospace", fontSize: 13.5, outline: "none" }} />
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 18px 60px" }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
              <Chip active={brandFilter === "Hamısı"} onClick={() => setBrandFilter("Hamısı")}>Hamısı</Chip>
              {BRANDS.map((b) => <Chip key={b} active={brandFilter === b} onClick={() => setBrandFilter(b)}>{b}</Chip>)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 14px" }}>
              <span style={{ fontWeight: 700, color: C.asphalt, fontSize: 14.5 }}>{filtered.length} elan tapıldı</span>
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: C.grey }}>Bu meyarlara uyğun elan yoxdur. Filtrləri dəyişməyi sınayın.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                {filtered.map((l) => <ListingCard key={l.id} l={l} onOpen={(li) => setView({ page: "detail", listing: li })} fav={!!favs[l.id]} toggleFav={toggleFav} />)}
              </div>
            )}
          </div>
        </>
      )}

      {showAdd && <AddListingModal onClose={() => setShowAdd(false)} onSave={addListing} />}

      <footer style={{ background: C.asphalt, color: C.grey, textAlign: "center", padding: "22px 20px", fontSize: 12.5 }}>
        <div style={{ color: C.yellow, fontFamily: "'Space Mono', monospace", fontSize: 15, marginBottom: 6 }}>
          Əlaqə: 0775567940
            Admin: Mehrac Rzazadə
        </div>
        maşınbazarı.az — 2026
      </footer>
    </div>
  );
}
