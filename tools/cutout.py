"""Cut bottles out of white studio backgrounds into transparent PNGs for the menu and the spinning bottle ring.
Usage: python3 tools/cutout.py   (needs the originals in originals/menu/)"""
import cv2, numpy as np, os, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UP = os.environ.get('UPLOADS', '/mnt/user-data/uploads')
OUT = f'{ROOT}/public/images/menu'
JOBS = {  # upload id -> (name, tolerance)
 '56dba4b5': ('don-julio-reposado', 14), '4': None,
 'e3ea299e': ('don-julio-1942', 14),
 'bbb5296c': ('martell-xo', 10),
 '7ec23a80': ('martell-blue-swift', 12),
 '9f2d0fb0': ('martell-vs', 12),
 '26397335': ('martell-vsop', 12),
 '2ebe6cd5': ('hennessy-vs-trio', 14),
 'abcb32b5': ('prosecco', 18),
 '45948030': ('hennessy-vs', 16),
 'f7969536': ('johnnie-walker-double-black', 14),
}
JOBS.pop('4')
for i, (name, tol) in JOBS.items():
    src = f'{UP}/{i}-image.png'; shutil.copy(src, f'{ROOT}/originals/menu/{name}.png')
    im = cv2.imread(src); h, w = im.shape[:2]
    pad = cv2.copyMakeBorder(im, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=(255, 255, 255))
    mask = np.zeros((h + 4, w + 4), np.uint8)
    for seed in [(0, 0), (w + 1, 0), (0, h + 1), (w + 1, h + 1), (w // 2, 0), (w // 2, h + 1)]:
        if (pad[seed[1], seed[0]] > 225).all():
            cv2.floodFill(pad, mask, seed, (255, 0, 255), (tol,) * 3, (tol,) * 3, cv2.FLOODFILL_FIXED_RANGE | cv2.FLOODFILL_MASK_ONLY | (255 << 8))
    bg = mask[1:h + 1, 1:w + 1] > 0
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.9)
    out = np.dstack([im, alpha])
    ys, xs = np.where(alpha > 20)
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    s = 900 / out.shape[0]
    if s < 1: out = cv2.resize(out, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    cv2.imwrite(f'{OUT}/{name}.png', out); print(name, out.shape)
