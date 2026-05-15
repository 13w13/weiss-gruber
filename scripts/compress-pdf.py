"""One-shot PDF compressor: downsample + JPEG-recompress embedded images."""
import io
import sys
import pymupdf
from PIL import Image

SRC = 'brochure vitrail.pdf'
DST = 'brochure vitrail compressed.pdf'
MAX_SIDE = 1500
JPEG_QUALITY = 65

doc = pymupdf.open(SRC)
print(f'Source: {SRC}  pages={len(doc)}')

before_imgs_bytes = 0
after_imgs_bytes = 0
replaced = 0
skipped = 0

for page_idx in range(len(doc)):
    page = doc[page_idx]
    for img_info in page.get_images(full=True):
        xref = img_info[0]
        try:
            info = doc.extract_image(xref)
        except Exception as e:
            skipped += 1
            continue
        before_imgs_bytes += len(info['image'])

        try:
            im = Image.open(io.BytesIO(info['image']))
            if im.mode in ('RGBA', 'P', 'LA'):
                im = im.convert('RGB')
            elif im.mode == 'CMYK':
                im = im.convert('RGB')
            elif im.mode != 'RGB':
                im = im.convert('RGB')
            if max(im.size) > MAX_SIDE:
                im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
            buf = io.BytesIO()
            im.save(buf, format='JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)
            new_bytes = buf.getvalue()
        except Exception as e:
            print(f'  page {page_idx+1} xref {xref}: skipped ({e})')
            skipped += 1
            continue

        if len(new_bytes) >= len(info['image']):
            after_imgs_bytes += len(info['image'])
            skipped += 1
            continue

        try:
            page.replace_image(xref, stream=new_bytes)
            after_imgs_bytes += len(new_bytes)
            replaced += 1
        except Exception as e:
            print(f'  update failed for xref {xref}: {e}')
            after_imgs_bytes += len(info['image'])
            skipped += 1

print(f'Images: replaced={replaced} skipped={skipped}')
print(f'Image bytes: before={before_imgs_bytes/1024/1024:.1f} MB  after={after_imgs_bytes/1024/1024:.1f} MB')

doc.save(DST, garbage=4, clean=True, deflate=True, deflate_images=False, deflate_fonts=True)
doc.close()

import os
src_size = os.path.getsize(SRC) / 1024 / 1024
dst_size = os.path.getsize(DST) / 1024 / 1024
print(f'\nResult: {src_size:.1f} MB  ->  {dst_size:.1f} MB  ({(1-dst_size/src_size)*100:.0f}% reduction)')
