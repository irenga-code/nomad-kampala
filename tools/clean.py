import cv2, numpy as np, glob, os, sys
sys.path.insert(0,'/home/claude/tools')
from names import ORDER
SRC='./originals'; OUT='./public/images'
os.makedirs(OUT,exist_ok=True)

def make_logo():
    im=cv2.imread(f'{SRC}/11-artist-leather-jacket.png')
    c=im[0:116,324:462].astype(np.float32)
    L=c.mean(axis=2)
    bg=np.percentile(L,20)
    a=np.clip((L-(bg+14))/(170-(bg+14)),0,1)
    a=cv2.resize(a,None,fx=4,fy=4,interpolation=cv2.INTER_LANCZOS4)
    a=np.clip(a,0,1)
    ys,xs=np.where(a>0.08); a=a[ys.min():ys.max()+1,xs.min():xs.max()+1]
    rgba=np.dstack([np.full(a.shape+(3,),255,np.uint8),(a*255).astype(np.uint8)])
    cv2.imwrite(f'{OUT}/nomad-logo.png',rgba)
    return rgba
LOGO=make_logo()

def paste_logo(img,width,margin,pos='br'):
    h,w=img.shape[:2]
    lw=width; lh=int(LOGO.shape[0]*lw/LOGO.shape[1])
    l=cv2.resize(LOGO,(lw,lh),interpolation=cv2.INTER_AREA).astype(np.float32)
    x=w-lw-margin; y=h-lh-margin
    # soft dark gradient for logo contrast
    yy,xx=np.mgrid[0:h,0:w]
    cx,cy=x+lw/2,y+lh/2
    d=np.sqrt(((xx-cx)/(lw*1.1))**2+((yy-cy)/(lh*1.1))**2)
    g=np.clip(1-d,0,1)**1.5*0.55
    img=(img.astype(np.float32)*(1-g[...,None])).astype(np.float32)
    a=l[...,3:4]/255.0
    roi=img[y:y+lh,x:x+lw]
    img[y:y+lh,x:x+lw]=roi*(1-a)+l[...,:3]*a
    return img.astype(np.uint8)

def inpaint_arrows(im,idx):
    h,w=im.shape[:2]
    g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
    mask=np.zeros((h,w),np.uint8)
    for x0,x1 in [(0,50),(w-50,w)]:
        strip=g[h//2-80:h//2+80,x0:x1]
        c=cv2.HoughCircles(cv2.GaussianBlur(strip,(5,5),0),cv2.HOUGH_GRADIENT,1,20,param1=80,param2=15,minRadius=12,maxRadius=22)
        if c is not None:
            cx,cy,r=c[0][0]; cv2.circle(mask,(int(cx+x0),int(cy+h//2-80)),int(r)+5,255,-1)
    if idx==7: cv2.circle(mask,(w,397),26,255,-1)
    return cv2.inpaint(im,mask,6,cv2.INPAINT_TELEA)

# per-image: bottom crop px, then logo overlay (width) for group A
CROP={1:68,2:68,3:128,4:68,5:68,6:68,7:80,8:80,9:54,10:54,11:54,12:54,13:54,14:54,15:54,16:54}
for i,(uid,name) in enumerate(ORDER,1):
    im=cv2.imread(f'{SRC}/{i:02d}-{name}.png')
    im=inpaint_arrows(im,i)
    h,w=im.shape[:2]
    if i<=16:
        im=im[:h-CROP[i]]
    else:
        im=im[:445]
        # remove red date box (top-right)
        h2,w2=im.shape[:2]
        m=np.zeros((h2,w2),np.uint8)
        hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
        red=cv2.inRange(hsv,(0,120,120),(10,255,255))|cv2.inRange(hsv,(170,120,120),(180,255,255))
        red[:, :w2-120]=0; red[90:,:]=0
        x,y,bw,bh=cv2.boundingRect(red)
        m=np.zeros((h2,w2),np.uint8)
        cv2.rectangle(m,(x-16,y-16),(min(w2,x+bw+16),y+bh+16),255,-1)
        im=cv2.inpaint(im,m,12,cv2.INPAINT_NS)
    if i>=17:
        h3,w3=im.shape[:2]
        m=np.zeros((h3,w3),np.uint8); m[0:105,0:105]=255
        im=cv2.inpaint(im,m,10,cv2.INPAINT_NS)
        # paste at top-left via flipped helper
        f=cv2.flip(cv2.flip(im,-1),-1)
        lw=84; lh=int(LOGO.shape[0]*lw/LOGO.shape[1])
        l=cv2.resize(LOGO,(lw,lh),interpolation=cv2.INTER_AREA).astype(np.float32)
        a=l[...,3:4]/255.0; x0,y0=14,12
        roi=im[y0:y0+lh,x0:x0+lw].astype(np.float32)
        im[y0:y0+lh,x0:x0+lw]=(roi*(1-a)+l[...,:3]*a).astype(np.uint8)
    if i<=6:
        im=paste_logo(im,112 if i!=3 else 112,16)
    cv2.imwrite(f'{OUT}/{i:02d}-{name}.jpg',im,[cv2.IMWRITE_JPEG_QUALITY,92])
print('done')
