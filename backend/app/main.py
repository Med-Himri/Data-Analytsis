from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import requests
from io import StringIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(request: dict):
    file_url = request.get('fileUrl')
    include_full_data = request.get('includeFullData', False)  # New optional flag
    print(f"Received fileUrl: {file_url}, includeFullData: {include_full_data}")
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

        summary = {
            "rows": int(len(df)),
            "columns": int(len(df.columns)),
            "columnNames": list(df.columns),
            "columnTypes": {k: str(v) for k, v in df.dtypes.astype(str).to_dict().items()},
            "missingValues": {col: int(df[col].isnull().sum()) for col in df.columns},
            "sampleData": df.head(5).to_dict('records'),  # Keep sample for previews
        }

        # Add full data if requested and dataset is not too large
        if include_full_data and len(df) <= 10000:  # Limit to 10k rows to avoid overload
            summary["fullData"] = df.to_dict('records')
            print(f"Included full data with {len(df)} rows")
        elif include_full_data:
            summary["fullData"] = None
            print("Dataset too large for full data; skipped")

        # Numeric stats
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            summary["numericStats"] = {}
            for col in numeric_cols:
                summary["numericStats"][col] = {
                    "mean": float(df[col].mean()),
                    "min": float(df[col].min()),
                    "max": float(df[col].max()),
                    "std": float(df[col].std()),
                }

        print("Analysis complete, returning summary")
        return summary

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")