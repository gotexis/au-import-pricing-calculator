"use client";

import { useState } from "react";
import hsCodesData from "@/data/hs-codes.json";

export default function HSCodesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(hsCodesData.map((h) => h.category)))];

  const filtered = hsCodesData.filter((h) => {
    const matchSearch = search === "" || h.desc.toLowerCase().includes(search.toLowerCase()) || h.hs.includes(search);
    const matchCategory = categoryFilter === "All" || h.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">🔍 HS Code Lookup — Australian Import Duty Rates</h1>
      <p className="opacity-70 mb-6">Search common HS codes and their import duty rates for Australia. Rates sourced from the Australian Border Force (ABF) Customs Tariff.</p>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search HS code or description..."
          className="input input-bordered flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select select-bordered" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra bg-base-100 shadow">
          <thead>
            <tr>
              <th>HS Code</th>
              <th>Description</th>
              <th>Category</th>
              <th className="text-right">Duty Rate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((h) => (
              <tr key={h.hs}>
                <td className="font-mono font-bold">{h.hs}</td>
                <td>{h.desc}</td>
                <td><span className="badge badge-outline">{h.category}</span></td>
                <td className="text-right">
                  <span className={`badge ${h.duty_pct === 0 ? "badge-success" : "badge-warning"}`}>
                    {h.duty_pct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="alert alert-info mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <div>
          <p className="font-bold">About HS Codes</p>
          <p>The Harmonized System (HS) is an international nomenclature for classifying traded products. Australia uses a 10-digit code system based on HS codes. The rates shown here are for the most common 4-digit headings. For exact rates, consult the <a href="https://www.abf.gov.au/importing-exporting-and-manufacturing/tariff-classification" className="link" target="_blank" rel="noopener">ABF Customs Tariff</a>.</p>
        </div>
      </div>
    </div>
  );
}
