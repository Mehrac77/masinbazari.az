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
