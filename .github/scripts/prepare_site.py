from pathlib import Path
import shutil
import sys

root = Path(__file__).resolve().parents[2]
output = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else root / '_site'
if output == root or output in root.parents or (output.exists() and any(output.iterdir())):
    raise SystemExit('Choose a new or empty output directory distinct from the source.')
output.mkdir(parents=True, exist_ok=True)
files = [*root.glob('*.html'), *(root / name for name in ['CNAME', 'robots.txt', 'sitemap.xml'])]
public_types = {'.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.woff', '.woff2'}
files.extend(path for path in (root / 'assets').rglob('*') if path.is_file() and path.suffix.lower() in public_types)
files.extend(root / 'assets/docs' / name for name in ['alex-krasnok-resume.pdf'])
for source in files:
    destination = output / source.relative_to(root)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)
print(f'Prepared {len(files)} public files in {output}')
