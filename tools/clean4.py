"""Batch 3 cleaning (Instagram UI removal). Coordinates were located by hand on zoomed grids.
Run from the project root: python3 tools/clean4.py  (needs the originals in originals/batch3/)."""
import cv2, numpy as np, os, sys, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from uiclean import strip_ui, remove_dot
UP = os.environ.get('UPLOADS', '/mnt/user-data/uploads')
IMG = f'{ROOT}/public/images'
os.makedirs(f'{IMG}/archive', exist_ok=True)

def arrows(im, items):
    h, w = im.shape[:2]; m = np.zeros((h, w), np.uint8)
    for x, dy in items: cv2.circle(m, (x, h//2 + dy), 22, 255, -1)
    return cv2.inpaint(im, m, 5, cv2.INPAINT_TELEA)

def dots(im, pts):
    for x, y, a in pts: im = remove_dot(im, x, y, a)
    return im

# id -> (output, arrows[(x,dy)], dots[(x,y,active)], crop_bottom, icon)
JOBS = {
 "255a9762": ("archive/2026-10-16-swift-fridays-ladies-night.jpg", [(590,-2)], [(294,772,True),(309,772,False)], 0, True),
 "d0104297": ("archive/2026-10-15-run-the-city.jpg", [(600,2)], [(293,784,True),(308,784,False),(323,784,False)], 0, False),
 "c744e427": ("archive/2026-10-30-one-year-anniversary-crayon.jpg", [], [], 0, True),
 "91ff94e2": ("archive/2026-10-11-sunday-school-1.jpg", [(595,8)], [], 0, False),
 "d217c125": ("archive/2026-10-11-sunday-school-2.jpg", [(10,2)], [(281,777,False),(296,777,False),(311,777,True)], 0, False),
 "5cde8507": ("archive/2026-09-19-the-after-dark-dj-sonia-1.jpg", [(590,0)], [(278,775,True),(293,775,False),(308,775,False),(323,775,False)], 0, True),
 "8b9ce49a": ("archive/2026-09-19-the-after-dark-dj-sonia-2.jpg", [(15,-1),(594,-1)], [(282,776,False),(297,776,False),(312,776,True),(327,776,False)], 0, False),
 "e62ff0a7": ("archive/2026-10-08-made-in-kla-deobi.jpg", [(592,1)], [(296,774,True),(311,774,False)], 6, True),
 "5afd349a": ("20-pizza-01.jpg", [(769,3)], [(367,584,True),(382,584,False),(397,584,False),(412,584,False),(427,584,False)], 0, False),
 "cf2f478d": ("21-pizza-02.jpg", [(22,-2),(763,-2)], [(362,575,False),(377,575,False),(392,575,True),(407,575,False),(422,575,False)], 0, False),

 "bc629351": ("22-martell-cartel-sign.jpg", [(759,2)], [], 56, False),
 "11e9138e": ("23-martell-cartel-bottle.jpg", [(19,0),(761,-3)], [], 56, False),
 "6ae418bf": ("24-minister-of-enjoyment.jpg", [(13,0),(754,0)], [], 56, False),
}
for i, (out, arr, dts, crop, icon) in JOBS.items():
    src = f'{UP}/{i}-image.png'
    shutil.copy(src, f'{ROOT}/originals/batch3/{i}.png')
    im = cv2.imread(src)
    if icon: im, _ = strip_ui(im, dots=None, icon=True, arrows=False)
    if arr: im = arrows(im, arr)
    if dts: im = dots(im, dts)
    if crop: im = im[:im.shape[0]-crop]
    cv2.imwrite(f'{IMG}/{out}', im, [cv2.IMWRITE_JPEG_QUALITY, 92]); print(i, out)
