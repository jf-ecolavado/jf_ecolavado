import pandas as pd
import json

file_path = r"C:\Users\jorge\Downloads\Verificación de Zonas y Distancias Reales.xlsx"
try:
    df = pd.read_excel(file_path)
    # Convert to a list of dicts for easy reading
    data = df.to_dict(orient='records')
    with open('zones_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Data extracted successfully to zones_data.json")
except Exception as e:
    print(f"Error: {e}")
