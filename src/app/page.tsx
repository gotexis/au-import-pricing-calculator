"use client";

import { useState, useMemo } from "react";
import exchangeRatesData from "@/data/exchange-rates.json";
import hsCodesData from "@/data/hs-codes.json";
import auspostRates from "@/data/auspost-rates.json";

interface CostBreakdown {
  fobAud: number;
  internationalShipping: number;
  insurance: number;
  customsValue: number;
  dutyAmount: number;
  gstBase: number;
  gstAmount: number;
  customsClearance: number;
  quarantineFee: number;
  localShipping: number;
  platformCommission: number;
  paymentFees: number;
  totalLandedCost: number;
  suggestedRetailPrice: number;
  profitPerUnit: number;
  profitMargin: number;
  breakEvenPrice: number;
}

const PLATFORM_RATES: Record<string, number> = {
  none: 0,
  ebay: 0.132,
  amazon: 0.15,
  shopify: 0.029,
  etsy: 0.065,
};

export default function Home() {
  const [currency, setCurrency] = useState("USD");
  const [fobPrice, setFobPrice] = useState<number>(50);
  const [quantity, setQuantity] = useState<number>(100);
  const [weightKg, setWeightKg] = useState<number>(0.5);
  const [intlShippingPerKg, setIntlShippingPerKg] = useState<number>(8);
  const [insurancePct, setInsurancePct] = useState<number>(1);
  const [hsCode, setHsCode] = useState("8517");
  const [state, setState] = useState("NSW");
  const [zone, setZone] = useState("Metro");
  const [platform, setPlatform] = useState("none");
  const [targetMargin, setTargetMargin] = useState<number>(30);
  const [customsClearance, setCustomsClearance] = useState<number>(88);
  const [quarantineFee, setQuarantineFee] = useState<number>(0);

  const exchangeRate = useMemo(() => {
    const r = (exchangeRatesData.rates as Record<string, { rate: number }>)[currency];
    return r ? r.rate : 1;
  }, [currency]);

  const dutyPct = useMemo(() => {
    const hs = hsCodesData.find((h) => h.hs === hsCode);
    return hs ? hs.duty_pct / 100 : 0.05;
  }, [hsCode]);

  const localShippingRate = useMemo(() => {
    const rate = auspostRates.find(
      (r) => r.state === state && (r.zone === zone || r.zone === "All")
    );
    return rate || { base_price: 10, per_extra_kg: 2, base_kg: 5 };
  }, [state, zone]);

  const costs: CostBreakdown = useMemo(() => {
    const fobAud = fobPrice / exchangeRate;
    const intlShipTotal = weightKg * intlShippingPerKg * quantity;
    const intlShipPerUnit = intlShipTotal / quantity;
    const insuranceAmt = fobAud * (insurancePct / 100);

    // Customs value (VoTI) = FOB + freight + insurance
    const customsValue = fobAud + intlShipPerUnit + insuranceAmt;

    // Duty
    const dutyAmount = customsValue * dutyPct;

    // GST base = customs value + duty
    const gstBase = customsValue + dutyAmount;
    // GST only applies if consignment value > $1000 AUD (for goods imported by post/cargo)
    // For commercial imports, GST always applies
    const gstAmount = gstBase * 0.1;

    // Clearance costs (shared across quantity)
    const clearancePerUnit = customsClearance / quantity;
    const quarantinePerUnit = quarantineFee / quantity;

    // Local shipping per unit
    const totalWeight = weightKg * quantity;
    let localShipTotal;
    if (totalWeight <= localShippingRate.base_kg) {
      localShipTotal = localShippingRate.base_price;
    } else {
      localShipTotal =
        localShippingRate.base_price +
        (totalWeight - localShippingRate.base_kg) * localShippingRate.per_extra_kg;
    }
    const localShipPerUnit = localShipTotal / quantity;

    const totalLandedCost =
      fobAud +
      intlShipPerUnit +
      insuranceAmt +
      dutyAmount +
      gstAmount +
      clearancePerUnit +
      quarantinePerUnit +
      localShipPerUnit;

    // Suggested retail price with target margin
    const suggestedRetailPrice = totalLandedCost / (1 - targetMargin / 100);

    // Platform commission
    const commissionRate = PLATFORM_RATES[platform] || 0;
    const platformCommission = suggestedRetailPrice * commissionRate;

    // Payment processing (2.9% + $0.30 typical)
    const paymentFees = suggestedRetailPrice * 0.029 + 0.3;

    // Final retail price accounting for platform + payment fees
    const finalRetail =
      (totalLandedCost + 0.3) /
      (1 - targetMargin / 100 - commissionRate - 0.029);

    const profitPerUnit = finalRetail - totalLandedCost - finalRetail * commissionRate - (finalRetail * 0.029 + 0.3);
    const profitMargin = (profitPerUnit / finalRetail) * 100;
    const breakEvenPrice = totalLandedCost + totalLandedCost * commissionRate / (1 - commissionRate) + 0.3;

    return {
      fobAud,
      internationalShipping: intlShipPerUnit,
      insurance: insuranceAmt,
      customsValue,
      dutyAmount,
      gstBase,
      gstAmount,
      customsClearance: clearancePerUnit,
      quarantineFee: quarantinePerUnit,
      localShipping: localShipPerUnit,
      platformCommission: finalRetail * commissionRate,
      paymentFees: finalRetail * 0.029 + 0.3,
      totalLandedCost,
      suggestedRetailPrice: finalRetail,
      profitPerUnit,
      profitMargin,
      breakEvenPrice,
    };
  }, [fobPrice, exchangeRate, quantity, weightKg, intlShippingPerKg, insurancePct, dutyPct, customsClearance, quarantineFee, localShippingRate, platform, targetMargin]);

  const presets = [
    { name: "📱 Phone Case (China→AU)", currency: "USD", fob: 2, qty: 500, weight: 0.05, shipping: 6, hs: "3926", margin: 50, platform: "ebay" },
    { name: "👗 Women's Dress (China→AU)", currency: "USD", fob: 15, qty: 200, weight: 0.3, shipping: 8, hs: "6204", margin: 40, platform: "ebay" },
    { name: "💻 Laptop (US→AU)", currency: "USD", fob: 800, qty: 5, weight: 2.5, shipping: 12, hs: "8471", margin: 15, platform: "amazon" },
    { name: "🧴 Skincare Set (Korea→AU)", currency: "USD", fob: 8, qty: 300, weight: 0.4, shipping: 7, hs: "3304", margin: 45, platform: "shopify" },
    { name: "🪑 Office Chair (China→AU)", currency: "USD", fob: 45, qty: 50, weight: 15, shipping: 4, hs: "9401", margin: 35, platform: "none" },
    { name: "⌚ Digital Watch (China→AU)", currency: "USD", fob: 5, qty: 1000, weight: 0.08, shipping: 6, hs: "9102", margin: 60, platform: "ebay" },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setCurrency(p.currency);
    setFobPrice(p.fob);
    setQuantity(p.qty);
    setWeightKg(p.weight);
    setIntlShippingPerKg(p.shipping);
    setHsCode(p.hs);
    setTargetMargin(p.margin);
    setPlatform(p.platform);
  };

  const costLayers = [
    { label: "FOB Price (AUD)", value: costs.fobAud, color: "bg-blue-500" },
    { label: "Int'l Shipping", value: costs.internationalShipping, color: "bg-cyan-500" },
    { label: "Insurance", value: costs.insurance, color: "bg-teal-500" },
    { label: `Duty (${(dutyPct * 100).toFixed(0)}%)`, value: costs.dutyAmount, color: "bg-amber-500" },
    { label: "GST (10%)", value: costs.gstAmount, color: "bg-red-500" },
    { label: "Customs Clearance", value: costs.customsClearance, color: "bg-purple-500" },
    { label: "Quarantine/AQIS", value: costs.quarantineFee, color: "bg-pink-500" },
    { label: "Local Shipping", value: costs.localShipping, color: "bg-indigo-500" },
  ];

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🚢 AU Import Pricing Calculator</h1>
        <p className="text-lg opacity-70">Calculate the true landed cost of importing goods to Australia</p>
        <p className="text-sm opacity-50">Exchange rates: {exchangeRatesData.date} | 1 AUD = {exchangeRate.toFixed(4)} {currency}</p>
      </div>

      {/* Preset Scenarios */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">⚡ Quick Start — Common Import Scenarios</h2>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button key={p.name} className="btn btn-sm btn-outline" onClick={() => applyPreset(p)}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">📦 Product Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Currency</span></label>
                <select className="select select-bordered" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {Object.entries(exchangeRatesData.rates).map(([code, info]) => (
                    <option key={code} value={code}>{code} — {(info as { name: string }).name}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">FOB Price ({currency})</span></label>
                <input type="number" className="input input-bordered" value={fobPrice} onChange={(e) => setFobPrice(Number(e.target.value))} min={0} step={0.01} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Quantity</span></label>
                <input type="number" className="input input-bordered" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Weight per unit (kg)</span></label>
                <input type="number" className="input input-bordered" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} min={0} step={0.1} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Int&apos;l Shipping ($/kg)</span></label>
                <input type="number" className="input input-bordered" value={intlShippingPerKg} onChange={(e) => setIntlShippingPerKg(Number(e.target.value))} min={0} step={0.5} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Insurance (%)</span></label>
                <input type="number" className="input input-bordered" value={insurancePct} onChange={(e) => setInsurancePct(Number(e.target.value))} min={0} step={0.5} />
              </div>
            </div>

            <h2 className="card-title mt-4">🏛️ Customs & Duty</h2>

            <div className="form-control">
              <label className="label"><span className="label-text">HS Code (Product Category)</span></label>
              <select className="select select-bordered" value={hsCode} onChange={(e) => setHsCode(e.target.value)}>
                {hsCodesData.map((h) => (
                  <option key={h.hs} value={h.hs}>{h.hs} — {h.desc} ({h.duty_pct}% duty)</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Customs Clearance ($)</span></label>
                <input type="number" className="input input-bordered" value={customsClearance} onChange={(e) => setCustomsClearance(Number(e.target.value))} min={0} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Quarantine/AQIS Fee ($)</span></label>
                <input type="number" className="input input-bordered" value={quarantineFee} onChange={(e) => setQuarantineFee(Number(e.target.value))} min={0} />
              </div>
            </div>

            <h2 className="card-title mt-4">🚛 Local Delivery</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">State</span></label>
                <select className="select select-bordered" value={state} onChange={(e) => setState(e.target.value)}>
                  {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Zone</span></label>
                <select className="select select-bordered" value={zone} onChange={(e) => setZone(e.target.value)}>
                  <option value="Metro">Metro</option>
                  <option value="Regional">Regional</option>
                </select>
              </div>
            </div>

            <h2 className="card-title mt-4">💰 Selling</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Platform</span></label>
                <select className="select select-bordered" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="none">Direct / Own Website</option>
                  <option value="ebay">eBay (13.2%)</option>
                  <option value="amazon">Amazon AU (15%)</option>
                  <option value="shopify">Shopify (2.9%)</option>
                  <option value="etsy">Etsy (6.5%)</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Target Margin (%)</span></label>
                <input type="number" className="input input-bordered" value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value))} min={0} max={90} />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="stat bg-base-100 rounded-box shadow">
              <div className="stat-title">Landed Cost</div>
              <div className="stat-value text-primary text-2xl">{fmt(costs.totalLandedCost)}</div>
              <div className="stat-desc">per unit</div>
            </div>
            <div className="stat bg-base-100 rounded-box shadow">
              <div className="stat-title">Suggested Price</div>
              <div className="stat-value text-success text-2xl">{fmt(costs.suggestedRetailPrice)}</div>
              <div className="stat-desc">{targetMargin}% margin target</div>
            </div>
            <div className="stat bg-base-100 rounded-box shadow">
              <div className="stat-title">Profit/Unit</div>
              <div className="stat-value text-2xl" style={{ color: costs.profitPerUnit >= 0 ? "green" : "red" }}>{fmt(costs.profitPerUnit)}</div>
              <div className="stat-desc">{costs.profitMargin.toFixed(1)}% actual margin</div>
            </div>
            <div className="stat bg-base-100 rounded-box shadow">
              <div className="stat-title">Break-Even</div>
              <div className="stat-value text-warning text-2xl">{fmt(costs.breakEvenPrice)}</div>
              <div className="stat-desc">minimum selling price</div>
            </div>
          </div>

          {/* Cost Waterfall */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">📊 Cost Waterfall (per unit)</h2>
              <div className="space-y-2">
                {costLayers.map((layer) => {
                  const pct = costs.totalLandedCost > 0 ? (layer.value / costs.totalLandedCost) * 100 : 0;
                  return (
                    <div key={layer.label} className="flex items-center gap-2">
                      <span className="w-36 text-sm text-right">{layer.label}</span>
                      <div className="flex-1 bg-base-200 rounded-full h-6 relative">
                        <div
                          className={`${layer.color} h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold`}
                          style={{ width: `${Math.max(pct, 5)}%`, minWidth: "60px" }}
                        >
                          {fmt(layer.value)}
                        </div>
                      </div>
                      <span className="w-12 text-xs text-right">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
                <div className="divider my-1"></div>
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-36 text-sm text-right">TOTAL LANDED</span>
                  <div className="flex-1 bg-base-300 rounded-full h-6 flex items-center justify-end pr-2 text-sm">
                    {fmt(costs.totalLandedCost)}
                  </div>
                  <span className="w-12 text-xs text-right">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Breakdown Table */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">📋 Full Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr><th>Item</th><th className="text-right">Per Unit</th><th className="text-right">× {quantity}</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>FOB ({currency} {fobPrice} → AUD)</td><td className="text-right">{fmt(costs.fobAud)}</td><td className="text-right">{fmt(costs.fobAud * quantity)}</td></tr>
                    <tr><td>International Shipping</td><td className="text-right">{fmt(costs.internationalShipping)}</td><td className="text-right">{fmt(costs.internationalShipping * quantity)}</td></tr>
                    <tr><td>Insurance ({insurancePct}%)</td><td className="text-right">{fmt(costs.insurance)}</td><td className="text-right">{fmt(costs.insurance * quantity)}</td></tr>
                    <tr className="font-semibold bg-base-200"><td>Customs Value (VoTI)</td><td className="text-right">{fmt(costs.customsValue)}</td><td className="text-right">{fmt(costs.customsValue * quantity)}</td></tr>
                    <tr><td>Import Duty ({(dutyPct * 100).toFixed(0)}%)</td><td className="text-right">{fmt(costs.dutyAmount)}</td><td className="text-right">{fmt(costs.dutyAmount * quantity)}</td></tr>
                    <tr><td>GST (10%)</td><td className="text-right">{fmt(costs.gstAmount)}</td><td className="text-right">{fmt(costs.gstAmount * quantity)}</td></tr>
                    <tr><td>Customs Clearance</td><td className="text-right">{fmt(costs.customsClearance)}</td><td className="text-right">{fmt(customsClearance)}</td></tr>
                    <tr><td>Quarantine/AQIS</td><td className="text-right">{fmt(costs.quarantineFee)}</td><td className="text-right">{fmt(quarantineFee)}</td></tr>
                    <tr><td>Local Shipping ({state} {zone})</td><td className="text-right">{fmt(costs.localShipping)}</td><td className="text-right">{fmt(costs.localShipping * quantity)}</td></tr>
                    <tr className="font-bold bg-primary/10"><td>Total Landed Cost</td><td className="text-right">{fmt(costs.totalLandedCost)}</td><td className="text-right">{fmt(costs.totalLandedCost * quantity)}</td></tr>
                    <tr><td>Platform Fee</td><td className="text-right">{fmt(costs.platformCommission)}</td><td className="text-right">{fmt(costs.platformCommission * quantity)}</td></tr>
                    <tr><td>Payment Processing</td><td className="text-right">{fmt(costs.paymentFees)}</td><td className="text-right">{fmt(costs.paymentFees * quantity)}</td></tr>
                    <tr className="font-bold bg-success/10"><td>Suggested Retail</td><td className="text-right">{fmt(costs.suggestedRetailPrice)}</td><td className="text-right">{fmt(costs.suggestedRetailPrice * quantity)}</td></tr>
                    <tr className="font-bold"><td>Net Profit</td><td className="text-right" style={{ color: costs.profitPerUnit >= 0 ? "green" : "red" }}>{fmt(costs.profitPerUnit)}</td><td className="text-right" style={{ color: costs.profitPerUnit >= 0 ? "green" : "red" }}>{fmt(costs.profitPerUnit * quantity)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
