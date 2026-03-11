#!/usr/bin/env python3
"""
Fetch exchange rates from exchangerate.host (free, no key needed).
Saves to src/data/exchange-rates.json
"""
import json
import urllib.request
import sys
from datetime import datetime

CURRENCIES = ["USD", "CNY", "JPY", "GBP", "EUR", "HKD", "TWD", "KRW", "SGD", "NZD", "THB", "MYR", "IDR", "VND", "INR"]
BASE = "AUD"

def fetch_rates():
    # Use frankfurter.app (free, no key, reliable)
    url = f"https://api.frankfurter.app/latest?from={BASE}&to={','.join(CURRENCIES)}"
    print(f"Fetching: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read())
    
    result = {
        "base": BASE,
        "date": data.get("date", datetime.now().strftime("%Y-%m-%d")),
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "rates": {}
    }
    
    for cur in CURRENCIES:
        if cur in data.get("rates", {}):
            rate = data["rates"][cur]
            result["rates"][cur] = {
                "rate": rate,
                "inverse": round(1 / rate, 6) if rate else None,
                "name": get_currency_name(cur)
            }
    
    return result

def get_currency_name(code):
    names = {
        "USD": "US Dollar", "CNY": "Chinese Yuan", "JPY": "Japanese Yen",
        "GBP": "British Pound", "EUR": "Euro", "HKD": "Hong Kong Dollar",
        "TWD": "Taiwan Dollar", "KRW": "South Korean Won", "SGD": "Singapore Dollar",
        "NZD": "New Zealand Dollar", "THB": "Thai Baht", "MYR": "Malaysian Ringgit",
        "IDR": "Indonesian Rupiah", "VND": "Vietnamese Dong", "INR": "Indian Rupee"
    }
    return names.get(code, code)

if __name__ == "__main__":
    import os
    data = fetch_rates()
    out_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "exchange-rates.json")
    with open(out_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Saved {len(data['rates'])} rates to {out_path}")
    print(json.dumps(data, indent=2)[:500])
