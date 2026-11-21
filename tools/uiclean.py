"""Remove Instagram carousel UI (arrows, dots, tag icon) from screenshots."""
import cv2, numpy as np

def find_arrows(g):
    """light round button (~33px) with a dark chevron, centred vertically on the image, near a side edge"""
    h, w = g.shape; res = []
    for side, (x0, x1) in (("L", (0, 110)), ("R", (w-110, w))):
        y0, y1 = int(h/2) - 32, int(h/2) + 32
        reg = g[y0:y1, x0:x1]
        bw = (reg >= 175).astype(np.uint8)*255
        bw = cv2.morphologyEx(bw, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
        cnts, _ = cv2.findContours(bw, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for c in cnts:
            (cx, cy), r = cv2.minEnclosingCircle(c)
            if not (12 <= r <= 21): continue
            area = cv2.contourArea(c)
            if area < 0.55*np.pi*r*r: continue
            m = np.zeros(reg.shape, np.uint8); cv2.circle(m, (int(cx), int(cy)), int(r)-3, 255, -1)
            dark = ((reg < 110) & (m > 0)).sum()
            if dark >= 10:
                res.append((side, int(cx + x0), int(cy + y0), int(r)))
    return res

def tag_icon(g):
    h, w = g.shape; y0 = h - 70
    reg = g[y0:h, 0:48]
    white = cv2.morphologyEx((reg >= 235).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    nl, lab, st, cen = cv2.connectedComponentsWithStats(white)
    for i in range(1, nl):
        x, y, bw, bh, a = st[i]
        if 10 <= bw <= 24 and 12 <= bh <= 26 and 0.35 <= a/(bw*bh) <= 0.85 and x < 38:
            return (int(x + bw/2), int(y + bh/2 + y0))
    return None

def find_dots(g, first_x, n, pitch=15):
    """first_x: approx x of first dot, n: how many to look for. Returns verified (x,y) list."""
    h, w = g.shape; g32 = g.astype(np.float32); out = []
    yy, xx = np.mgrid[-10:11, -10:11]; d = np.sqrt(xx**2 + yy**2)
    inn = d <= 3; ring = (d >= 6.5) & (d <= 8.5)
    best = None
    for y in range(h-30, h-8):
        for x in range(int(first_x)-5, int(first_x)+6):
            p = g32[y-10:y+11, x-10:x+11]
            if p.shape != (21, 21): continue
            a = p[inn]; r = p[ring]
            if a.std() > 6: continue
            s = abs(a.mean() - np.median(r)) - r.std()*0.2
            if best is None or s > best[0]: best = (s, x, y)
    if best is None or best[0] < 18: return out
    _, bx, by = best
    for k in range(n):
        cx = bx + pitch*k
        sc = None
        for dx in range(-2, 3):
            for dy in range(-1, 2):
                x, y = cx+dx, by+dy
                p = g32[y-10:y+11, x-10:x+11]
                if p.shape != (21, 21): continue
                a = p[inn]; r = p[ring]
                if a.std() > 6: continue
                s = abs(a.mean() - np.median(r))
                if sc is None or s > sc[0]: sc = (s, x, y)
        if sc and sc[0] >= 14: out.append((sc[1], sc[2]))
    return out

def remove_dot(im, x, y, active=None, r_in=3.5, r_out=6.0):
    """Instagram dots: inactive = white at 40% over the picture (reversible), active = solid white."""
    h, w = im.shape[:2]
    yy, xx = np.mgrid[:h, :w]; d = np.hypot(xx - x, yy - y)
    inner = d <= r_in
    if active is None:
        active = (im[inner].min(axis=1) >= 250).mean() > 0.9
    if active:
        return cv2.inpaint(im, ((d <= r_out)*255).astype(np.uint8), 3, cv2.INPAINT_TELEA)
    a = 0.4
    f = im.astype(np.float32)
    f[inner] = (f[inner] - 255*a) / (1 - a)
    f = np.clip(f, 0, 255).astype(np.uint8)
    ring = (((d > r_in) & (d <= r_out))*255).astype(np.uint8)
    return cv2.inpaint(f, ring, 2, cv2.INPAINT_TELEA)

def strip_ui(im, dots=None, icon=True, arrows=True):
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    mask = np.zeros(g.shape, np.uint8); found = {}
    if arrows:
        a = find_arrows(g); found['arrows'] = [x[0] for x in a]
        for _, x, y, r in a: cv2.circle(mask, (x, y), r + 6, 255, -1)
    if icon:
        t = tag_icon(g); found['icon'] = bool(t)
        if t: cv2.circle(mask, t, 27, 255, -1)
    out = cv2.inpaint(im, mask, 4, cv2.INPAINT_TELEA) if mask.any() else im
    if dots:
        d = find_dots(g, *dots); found['dots'] = len(d)
        for x, y in d: out = remove_dot(out, x, y)
    return out, found
