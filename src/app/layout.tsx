import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AU Import Pricing Calculator | Free Import Cost Calculator Australia",
  description: "Free Australian import cost calculator. Calculate duty, GST, shipping, and total landed cost for importing goods to Australia. HS code lookup, AusPost rates, break-even analysis.",
  keywords: "import duty calculator australia, import cost calculator, customs duty australia, GST import, landed cost calculator, HS code lookup australia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="corporate">
      <body className="min-h-screen bg-base-200">
        <div className="navbar bg-primary text-primary-content shadow-lg">
          <div className="navbar-start">
            <a href="/" className="btn btn-ghost text-xl">🚢 AU Import Calculator</a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-1">
              <li><a href="/" className="text-primary-content hover:bg-primary-focus">Calculator</a></li>
              <li><a href="/hs-codes" className="text-primary-content hover:bg-primary-focus">HS Codes</a></li>
              <li><a href="/shipping" className="text-primary-content hover:bg-primary-focus">Shipping Rates</a></li>
              <li><a href="/guide" className="text-primary-content hover:bg-primary-focus">Import Guide</a></li>
            </ul>
          </div>
          <div className="navbar-end lg:hidden">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-base-content">
                <li><a href="/">Calculator</a></li>
                <li><a href="/hs-codes">HS Codes</a></li>
                <li><a href="/shipping">Shipping Rates</a></li>
                <li><a href="/guide">Import Guide</a></li>
              </ul>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {children}
        </main>
        <footer className="footer footer-center p-6 bg-base-300 text-base-content mt-8">
          <div>
            <p>© {new Date().getFullYear()} AU Import Calculator — Free tool for Australian importers</p>
            <p className="text-sm opacity-70">Exchange rates updated daily. Duty rates are approximate — verify with ABF for official rates.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
