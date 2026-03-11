export default function GuidePage() {
  return (
    <div className="prose max-w-none">
      <h1>📖 Complete Guide to Importing Goods to Australia</h1>

      <div className="alert alert-info mb-6 not-prose">
        <span>This guide covers the essentials for small businesses and individuals importing goods into Australia for resale.</span>
      </div>

      <h2>1. Understanding Import Costs</h2>
      <p>The <strong>landed cost</strong> of imported goods includes much more than the purchase price. Here&apos;s every cost you need to account for:</p>
      
      <div className="overflow-x-auto not-prose mb-6">
        <table className="table table-sm bg-base-100">
          <thead><tr><th>Cost Component</th><th>Typical Range</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>FOB Price</td><td>Varies</td><td>Factory gate price, excluding freight</td></tr>
            <tr><td>International Freight</td><td>$2-30/kg</td><td>Depends on method (sea vs air)</td></tr>
            <tr><td>Insurance</td><td>1-2%</td><td>Of goods value</td></tr>
            <tr><td>Customs Duty</td><td>0-5%</td><td>Based on HS code classification</td></tr>
            <tr><td>GST</td><td>10%</td><td>On (value + duty + freight)</td></tr>
            <tr><td>Customs Clearance</td><td>$50-150</td><td>Broker fee per consignment</td></tr>
            <tr><td>Quarantine (AQIS)</td><td>$0-200+</td><td>If goods require inspection</td></tr>
            <tr><td>Local Delivery</td><td>$8-20+</td><td>From port/depot to your location</td></tr>
          </tbody>
        </table>
      </div>

      <h2>2. GST on Imports</h2>
      <p>Australia charges <strong>10% GST</strong> on most imported goods. The GST is calculated on the <strong>customs value + duty + freight</strong>.</p>
      <ul>
        <li><strong>Low Value Threshold:</strong> Since 1 July 2018, GST applies to all goods imported into Australia regardless of value (the old $1000 threshold was removed for goods purchased from overseas suppliers registered for GST).</li>
        <li><strong>Business importers:</strong> If you&apos;re GST-registered, you can claim back import GST as an input tax credit on your BAS.</li>
      </ul>

      <h2>3. Customs Duty Rates</h2>
      <p>Most goods attract either <strong>0% or 5% duty</strong>. Some key rules:</p>
      <ul>
        <li><strong>Free Trade Agreements (FTA):</strong> Goods from China (ChAFTA), Japan, Korea, ASEAN countries, and many others may have reduced or zero duty under FTA preferences.</li>
        <li><strong>Rules of Origin:</strong> To claim FTA rates, you need a Certificate of Origin from the supplier.</li>
        <li><strong>Electronics:</strong> Most electronics (phones, laptops, tablets) are duty-free.</li>
        <li><strong>Clothing & textiles:</strong> Generally 5% duty.</li>
      </ul>

      <h2>4. Prohibited & Restricted Goods</h2>
      <div className="alert alert-warning not-prose mb-4">
        <span>⚠️ Some goods are prohibited or require permits. Importing without proper documentation can result in seizure and fines.</span>
      </div>
      <ul>
        <li><strong>Biosecurity:</strong> Food, plant material, animal products may require AQIS inspection and permits</li>
        <li><strong>Safety standards:</strong> Electrical goods must meet Australian safety standards (SAA approval)</li>
        <li><strong>Therapeutic goods:</strong> Medicines and supplements may need TGA approval</li>
        <li><strong>Weapons & replicas:</strong> Strictly controlled</li>
      </ul>

      <h2>5. Step-by-Step Import Process</h2>
      <ol>
        <li><strong>Source your product</strong> — negotiate FOB price with supplier</li>
        <li><strong>Arrange freight</strong> — choose sea or air based on urgency and weight</li>
        <li><strong>Get insurance</strong> — protect against loss/damage in transit</li>
        <li><strong>Customs declaration</strong> — lodge an Import Declaration (N10) or use a customs broker</li>
        <li><strong>Pay duty + GST</strong> — before goods are released</li>
        <li><strong>Quarantine check</strong> — if applicable (food, wood, animal products)</li>
        <li><strong>Collect goods</strong> — arrange pickup from port/depot or delivery</li>
      </ol>

      <h2>6. Tips for First-Time Importers</h2>
      <ul>
        <li><strong>Start small:</strong> Test with a small order before committing to bulk</li>
        <li><strong>Use a customs broker:</strong> Worth the $50-150 fee to avoid costly mistakes</li>
        <li><strong>Factor ALL costs:</strong> Use our calculator to avoid nasty surprises</li>
        <li><strong>Check FTA eligibility:</strong> Could save you 5% on duty</li>
        <li><strong>Register for GST:</strong> If turnover &gt; $75k, you must register — and you can claim back import GST</li>
        <li><strong>Keep records:</strong> ATO requires you to keep import records for 5 years</li>
      </ul>

      <h2>7. Useful Links</h2>
      <ul>
        <li><a href="https://www.abf.gov.au/importing-exporting-and-manufacturing/importing" target="_blank" rel="noopener">Australian Border Force — Importing</a></li>
        <li><a href="https://www.agriculture.gov.au/biosecurity-trade/import" target="_blank" rel="noopener">Dept of Agriculture — Biosecurity Imports</a></li>
        <li><a href="https://www.ato.gov.au/business/gst/in-detail/rules-for-specific-transactions/international-transactions/gst-and-imported-goods/" target="_blank" rel="noopener">ATO — GST on Imported Goods</a></li>
        <li><a href="https://ftaportal.dfat.gov.au/" target="_blank" rel="noopener">FTA Portal — Check FTA eligibility</a></li>
      </ul>

      <div className="not-prose mt-8">
        <a href="/" className="btn btn-primary">← Back to Calculator</a>
      </div>
    </div>
  );
}
