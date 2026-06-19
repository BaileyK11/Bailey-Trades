import faulthandler
faulthandler.enable()

import sys
import traceback

print("Script started", flush=True)

try:
    print("Importing yfinance...", flush=True)
    import yfinance as yf
    print("yfinance imported successfully", flush=True)
    
    print("Attempting to get Ticker...", flush=True)
    ticker = yf.Ticker("AAPL")
    print("Ticker created successfully", flush=True)
    
    print("Fetching history...", flush=True)
    hist = ticker.history(period="2d")
    print("History fetched successfully", flush=True)
    print("DataFrame shape:", hist.shape if hist is not None else "None", flush=True)
    print(hist, flush=True)
    
except Exception as e:
    print("An exception occurred:", flush=True)
    traceback.print_exc()
    sys.exit(1)

print("Script finished", flush=True)
