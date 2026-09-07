import os
import json
import base64
import math
import shutil
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SVG_DIR = os.path.join(BASE_DIR, "twemoji", "assets", "svg")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
SRC_OUTPUT_DIR = os.path.join(OUTPUT_DIR, "src")

os.makedirs(SRC_OUTPUT_DIR, exist_ok=True)

if not os.path.exists(SVG_DIR):
    print(f"Submodule path not found: {SVG_DIR}")
    print(
        "Please run the following command in the project root directory: git submodule update --init --recursive"
    )
    exit(1)

def copy_static_file(candidates, dst):
    for src in candidates:
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"Copied {src} -> {dst}")
            return True
    return False

icon_src = None
for candidate in [
    os.path.join(BASE_DIR, "src", "icon.png"),
    os.path.join(BASE_DIR, "icon.png"),
]:
    if os.path.exists(candidate):
        icon_src = candidate
        break

if icon_src:
    try:
        with Image.open(icon_src) as img:
            for size in [16, 32, 48, 128]:
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
                dst_path = os.path.join(SRC_OUTPUT_DIR, f"icon-{size}.png")
                resized_img.save(dst_path)
                print(f"Generated {size}x{size} icon -> {dst_path}")
    except Exception as e:
        print(f"Failed to generate icons: {e}")

copy_static_file(
    [os.path.join(BASE_DIR, "main.js"), os.path.join(BASE_DIR, "src", "main.js")],
    os.path.join(OUTPUT_DIR, "main.js"),
)
copy_static_file(
    [
        os.path.join(BASE_DIR, "src", "manifest.json"),
        os.path.join(BASE_DIR, "manifest.json"),
    ],
    os.path.join(OUTPUT_DIR, "manifest.json"),
)
copy_static_file(
    [os.path.join(BASE_DIR, "README.md"), os.path.join(BASE_DIR, "src", "README.md")],
    os.path.join(OUTPUT_DIR, "README.md"),
)
copy_static_file(
    [os.path.join(BASE_DIR, "LICENSE"), os.path.join(BASE_DIR, "src", "LICENSE")],
    os.path.join(OUTPUT_DIR, "LICENSE"),
)

emoji_map = {}
print(f"SVG image directory: {SVG_DIR}")
print("Reading and converting SVG to a Base64 dictionary...")
raw_count = 0
for filename in os.listdir(SVG_DIR):
    if filename.endswith(".svg"):
        raw_count += 1
        raw_cp = filename[:-4].lower()
        file_path = os.path.join(SVG_DIR, filename)
        with open(file_path, "rb") as f:
            b64_str = "data:image/svg+xml;base64," + base64.b64encode(f.read()).decode(
                "utf-8"
            )
            emoji_map[raw_cp] = b64_str
            emoji_map[raw_cp.replace("-fe0f", "")] = b64_str
            if not raw_cp.endswith("-fe0f"):
                emoji_map[raw_cp + "-fe0f"] = b64_str

print(f"Successfully converted {raw_count} SVG files.")

NUM_CHUNKS = 8
items = list(emoji_map.items())
chunk_size = math.ceil(len(items) / NUM_CHUNKS)

for i in range(NUM_CHUNKS):
    chunk_items = dict(items[i * chunk_size : (i + 1) * chunk_size])
    file_name = f"emoji_data_{i + 1}.js"
    file_path = os.path.join(SRC_OUTPUT_DIR, file_name)
    chunk_json = json.dumps(chunk_items, separators=(",", ":"))
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(
            f"window.EMOJI_MAP = Object.assign(window.EMOJI_MAP || {{}}, {chunk_json});\n"
        )

print(f"Split EMOJI_MAP into {NUM_CHUNKS} files in src/ directory.")
print(f"Output directory: {OUTPUT_DIR}")
print("Done.")
