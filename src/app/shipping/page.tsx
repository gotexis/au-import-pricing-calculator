import auspostRates from "@/data/auspost-rates.json";

export default function ShippingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">🚛 Australian Domestic Shipping Rates</h1>
      <p className="opacity-70 mb-6">Approximate AusPost parcel rates by state and zone. Use these to estimate your local delivery costs after goods clear customs.</p>

      <div className="overflow-x-auto">
        <table className="table table-zebra bg-base-100 shadow">
          <thead>
            <tr>
              <th>State</th>
              <th>Zone</th>
              <th className="text-right">Base Rate (up to {auspostRates[0]?.base_kg}kg)</th>
              <th className="text-right">Per Extra kg</th>
            </tr>
          </thead>
          <tbody>
            {auspostRates.map((r, i) => (
              <tr key={i}>
                <td className="font-bold">{r.state}</td>
                <td>{r.zone}</td>
                <td className="text-right">${r.base_price.toFixed(2)}</td>
                <td className="text-right">${r.per_extra_kg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">📦 International Shipping Methods</h2>
            <table className="table table-sm">
              <thead><tr><th>Method</th><th>Est. $/kg</th><th>Transit</th></tr></thead>
              <tbody>
                <tr><td>Sea Freight (FCL)</td><td>$2-5</td><td>4-6 weeks</td></tr>
                <tr><td>Sea Freight (LCL)</td><td>$5-10</td><td>5-8 weeks</td></tr>
                <tr><td>Air Freight</td><td>$8-15</td><td>5-10 days</td></tr>
                <tr><td>Express Air (DHL/FedEx)</td><td>$15-30</td><td>3-5 days</td></tr>
                <tr><td>ePacket / AliExpress Standard</td><td>$3-8</td><td>2-4 weeks</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">💡 Shipping Tips</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Volumetric weight:</strong> Carriers charge by the greater of actual vs volumetric weight (L×W×H÷5000 for air, ÷6000 for sea)</li>
              <li><strong>Consolidation:</strong> Ship multiple SKUs together to reduce per-unit costs</li>
              <li><strong>Insurance:</strong> Typically 1-2% of goods value. Always insure shipments over $1000</li>
              <li><strong>Incoterms:</strong> FOB means you arrange freight from port. CIF means supplier includes freight + insurance to your port</li>
              <li><strong>THC (Terminal Handling):</strong> $150-300 per container, charged at destination port</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
