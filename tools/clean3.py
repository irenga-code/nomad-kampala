import cv2, numpy as np, os, sys, shutil
sys.path.insert(0, '/home/claude/tools')
from uiclean import strip_ui, find_dots, remove_dot
UP = '/mnt/user-data/uploads'
P = '/home/claude/nomad-kampala'
IMG = f'{P}/public/images'
for d in ('archive', 'banners'): os.makedirs(f'{IMG}/{d}', exist_ok=True)
os.makedirs(f'{P}/originals/batch2', exist_ok=True)

def load(i):
    ext = 'jpg' if i == 'aacefd5e' else 'png'
    f = f'{UP}/{i}-image.{ext}'
    shutil.copy(f, f'{P}/originals/batch2/{i}.{ext}')
    return cv2.imread(f)

def manual_arrows(im, items):
    """items: (side x, dy) circles drawn then inpainted"""
    h, w = im.shape[:2]
    m = np.zeros((h, w), np.uint8)
    for x, dy in items: cv2.circle(m, (x, h//2 + dy), 22, 255, -1)
    return cv2.inpaint(im, m, 5, cv2.INPAINT_TELEA)

def manual_dots(im, pts):
    for x, y, active in pts: im = remove_dot(im, x, y, active)
    return im

def save(im, rel, q=92):
    cv2.imwrite(f'{IMG}/{rel}', im, [cv2.IMWRITE_JPEG_QUALITY, q])

# id -> (output, dots hint, manual arrows, manual dots, crop bottom)
JOBS = {
 "12a2c35a": ("archive/2026-11-12-eivin-cena-1.jpg", None, [], [(293, 775, True), (308, 775, False)], 0),
 "1b1586db": ("archive/2026-11-12-eivin-cena-2.jpg", None, [(11, 1)], [(286, 777, False), (301, 777, True)], 0),
 "70f090af": ("archive/2026-11-10-tipsy-tuesday.jpg", None, [], [], 0),
 "91525e21": ("archive/2026-11-08-park-and-chill-1.jpg", (278, 3), [(553, -2)], [], 0),
 "c29f9b2c": ("archive/2026-11-08-park-and-chill-2.jpg", (276, 3), [], [], 0),
 "fd75c6f0": ("archive/2026-11-06-swift-fridays.jpg", (286, 3), [(591, -1)], [], 0),
 "b1c3e6fc": ("archive/2026-11-05-run-the-city.jpg", None, [], [], 0),
 "434ddec6": ("archive/2026-11-03-tipsy-tuesday.jpg", None, [(586, 5)], [], 0),
 "5c8fd5d6": ("archive/2026-11-01-sunday-school.jpg", None, [], [], 0),
 "9133e9ee": ("archive/2026-10-31-the-after-dark-halloween.jpg", (305, 3), [], [], 0),
 "e2251cc7": ("archive/2026-10-27-tipsy-tuesday-1.jpg", None, [], [], 0),
 "8b7c5364": ("archive/2026-10-27-tipsy-tuesday-2.jpg", None, [], [], 0),
 "39bde7dd": ("archive/2026-10-27-tipsy-tuesday-3.jpg", None, [], [], 0),
 "7c1b845d": ("archive/2026-10-27-tipsy-tuesday-4.jpg", None, [], [], 0),
 "8c011f31": ("archive/2026-10-24-the-after-dark.jpg", (307, 3), [(604, -3)], [], 0),
 # photos
 "35609a12": ("17-swift-friday-artist.jpg", None, [(748, -1)], [], 100),
 "bea6a80c": ("18-artist-uganda-flag-01.jpg", None, [], [], 64),
 "9e66b22f": ("19-artist-uganda-flag-02.jpg", None, [(13, 2)], [], 64),
}
for i, (out, dots, marr, mdots, crop) in JOBS.items():
    im = load(i)
    im, found = strip_ui(im, dots=dots)
    if marr: im = manual_arrows(im, marr)
    if mdots: im = manual_dots(im, mdots)
    if crop: im = im[:im.shape[0] - crop]
    save(im, out); print(i, out, found)

# Swift Fridays banner (already clean artwork)
sw = load('aacefd5e'); save(sw, 'banners/swift-fridays.jpg', 90)

# The After Dark banner: clean copy with the date box removed
im = cv2.imread(f'{IMG}/archive/2026-10-24-the-after-dark.jpg')
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
red = cv2.inRange(hsv, (0, 150, 150), (8, 255, 255)) | cv2.inRange(hsv, (172, 150, 150), (180, 255, 255))
red[130:, :] = 0; red[:, 140:] = 0
x, y, bw, bh = cv2.boundingRect(red)
print('date box', x, y, bw, bh)
rx, ry, rw, rh = max(0, x-12), max(0, y-12), bw+24, bh+24
sx = rx + rw + 4                      # same-height strip of pattern just to the right
src = im[ry:ry+rh, sx:sx+rw].copy()
mask = 255*np.ones(src.shape[:2], np.uint8)
ban = cv2.seamlessClone(src, im, mask, (rx + rw//2, ry + rh//2), cv2.NORMAL_CLONE)
save(ban, 'banners/the-after-dark.jpg', 92)
