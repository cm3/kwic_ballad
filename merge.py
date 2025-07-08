import os
import pandas as pd

# === 入力ディレクトリ（カレントディレクトリ内） ===
folder = "./"  # または任意のパスに変更可能

# === 出力ファイル名 ===
output_text_lines = "merged_text_lines.csv"
output_metadata = "merged_metadata.csv"

# === 初期化 ===
text_lines_dfs = []
metadata_dfs = []

# === フォルダ内CSVを走査して分類・読み込み ===
for filename in os.listdir(folder):
    if filename.endswith(".csv"):
        filepath = os.path.join(folder, filename)
        if "text_lines" in filename:
            df = pd.read_csv(filepath)
            text_lines_dfs.append(df)
        elif "metadata" in filename:
            df = pd.read_csv(filepath)
            metadata_dfs.append(df)

# === 結合と出力 ===
if text_lines_dfs:
    merged_text_lines = pd.concat(text_lines_dfs, ignore_index=True)
    merged_text_lines.to_csv(os.path.join(folder, output_text_lines), index=False)
    print(f"Merged text_lines saved to {output_text_lines}")

if metadata_dfs:
    merged_metadata = pd.concat(metadata_dfs, ignore_index=True)
    merged_metadata.to_csv(os.path.join(folder, output_metadata), index=False)
    print(f"Merged metadata saved to {output_metadata}")
