from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import requests
from io import StringIO

app = FastAPI()

# Enable CORS for your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(request: dict):
    file_url = request.get('fileUrl')
    print(f"Received fileUrl: {file_url}")
    if not file_url:
        raise HTTPException(status_code=400, detail="fileUrl is required")

    try:
        print("Downloading CSV...")
        response = requests.get(file_url)
        response.raise_for_status()
        print(f"Downloaded {len(response.text)} characters")

        print("Parsing CSV with pandas...")
        df = pd.read_csv(StringIO(response.text))
        print(f"Parsed DataFrame with {len(df)} rows and {len(df.columns)} columns")

        # Convert to Python types to avoid numpy serialization issues
        summary = {
            "rows": int(len(df)),  # Convert to int
            "columns": int(len(df.columns)),  # Convert to int
            "columnNames": list(df.columns),
            "columnTypes": {k: str(v) for k, v in df.dtypes.astype(str).to_dict().items()},
            "sampleData": df.head(5).to_dict('records'),
        }

        # Handle numeric stats with conversion
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            summary["numericStats"] = {}
            for col in numeric_cols:
                summary["numericStats"][col] = {
                    "mean": float(df[col].mean()),  # Convert to float
                    "min": float(df[col].min()),    # Convert to float
                    "max": float(df[col].max()),    # Convert to float
                    "std": float(df[col].std()),    # Convert to float
                }

        print("Analysis complete, returning summary")
        return summary

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")