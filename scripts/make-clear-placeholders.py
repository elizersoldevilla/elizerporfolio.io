"""
Generate placeholder screenshots for the CLEAR project.

The real captures were supplied as chat attachments, which are not files on
disk, so these are branded stand-ins rather than reproductions. They are
deliberately abstract - geometric blocks suggesting the layout - so they cannot
be mistaken for the actual product. Overwrite them with real screenshots using
the same filenames and no code changes are needed.

Palette sampled from the supplied screens.
"""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1600, 1000

INK = (22, 22, 22)        # sidebar / near-black
LIME = (181, 226, 26)     # CLEAR accent
CREAM = (245, 245, 232)   # page background
SAGE = (232, 232, 220)    # card fill
LINE = (205, 205, 190)    # card border
WHITE = (255, 255, 255)
MUTED = (120, 122, 110)

OUT = os.path.join("public", "images", "portfolio")


def font(size, bold=False):
    name = "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(os.path.join("C:\\Windows\\Fonts", name), size)


def wordmark(d, x, y, scale=1.0, on_dark=True):
    """CLEAR wordmark: a filled disc with a notch, plus the name."""
    r = int(18 * scale)
    cx, cy = x + r, y + r
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=LIME)
    # Carve the notch that reads as the "C".
    d.ellipse([cx - r * 0.35, cy - r * 1.5, cx + r * 1.35, cy + r * 0.5],
              fill=INK if on_dark else CREAM)
    d.text((x + r * 2.6, y - r * 0.15), "CLEAR", font=font(int(34 * scale), True),
           fill=WHITE if on_dark else INK)


def rounded(d, box, radius, fill=None, outline=None, width=2):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def placeholder_badge(d, y, margin=24):
    """Unmistakable marker so this is never read as a real screenshot.

    Right-aligned from the measured text width so it can never clip.
    """
    label = "PLACEHOLDER - REPLACE WITH SCREENSHOT"
    f = font(19, True)
    tw = d.textlength(label, font=f)
    x = W - margin - tw - 34
    rounded(d, [x, y, W - margin, y + 40], 20, fill=(58, 58, 58),
            outline=(104, 104, 104), width=1)
    d.text((x + 17, y + 9), label, font=f, fill=(228, 228, 228))


def caption(d, title, subtitle, x=44):
    """Caption block, anchored to the content area so it clears the sidebar."""
    d.rectangle([x - 20, H - 118, W - 20, H], fill=CREAM)
    d.text((x, H - 104), title, font=font(32, True), fill=INK)
    d.text((x, H - 62), subtitle, font=font(20), fill=MUTED)


def shell(d, title, subtitle, sidebar_items=None, wide_hero=False):
    """Shared frame: left rail + top bar, matching the app's structure."""
    d.rectangle([0, 0, W, H], fill=CREAM)
    # Sidebar
    rail = 300
    d.rectangle([0, 0, rail, H], fill=INK)
    wordmark(d, 40, 44, 0.85, on_dark=True)
    d.text((40, 116), "Centralized Logging for Ethics", font=font(15), fill=(150, 152, 140))
    d.text((40, 138), "Approval and Review", font=font(15), fill=(150, 152, 140))
    d.line([(40, 176), (260, 176)], fill=(58, 58, 58), width=1)

    if sidebar_items:
        y = 200
        for item in sidebar_items:
            rounded(d, [24, y, rail - 24, y + 46], 14, fill=(44, 44, 44))
            d.rectangle([24, y, 30, y + 46], fill=LIME)
            d.text((52, y + 13), item, font=font(19), fill=(214, 216, 206))
            y += 58

    # Top bar
    d.rectangle([rail, 0, W, 96], fill=WHITE)
    d.line([(rail, 96), (W, 96)], fill=LINE, width=1)
    d.text((rail + 44, 26), "GOOD DAY!", font=font(15, True), fill=MUTED)
    d.text((rail + 44, 50), title, font=font(30, True), fill=INK)
    return rail


def status_pill(d, x, y, w, h, fill=LIME):
    rounded(d, [x, y, x + w, y + h], h // 2, fill=fill)


# --------------------------------------------------------------------------
# 1. Sign-in
# --------------------------------------------------------------------------
img = Image.new("RGB", (W, H), CREAM)
d = ImageDraw.Draw(img)

# Sign-in is a full-height split, not the sidebar layout the other two screens
# use, so it is drawn from scratch rather than via shell().
split = int(W * 0.56)
d.rectangle([0, 0, split, H], fill=INK)
d.rectangle([split, 0, W, H], fill=LIME)

# Left: wordmark, tagline, headline
lx = 96
wordmark(d, lx, 300, 1.0, on_dark=True)
d.text((lx, 366), "Centralized Logging for Ethics", font=font(19), fill=(168, 170, 158))
d.text((lx, 392), "Approval and Review", font=font(19), fill=(168, 170, 158))

d.text((lx, 500), "Track your ethics", font=font(56, True), fill=CREAM)
d.text((lx, 570), "application with clarity.", font=font(56, True), fill=CREAM)

d.text((lx, 690), "A centralized platform for monitoring ethics",
       font=font(22), fill=(150, 152, 140))
d.text((lx, 722), "applications, requirements, revisions, and",
       font=font(22), fill=(150, 152, 140))
d.text((lx, 754), "approval progress.", font=font(22), fill=(150, 152, 140))

# Right: the form
cxm = split + (W - split) / 2
d.ellipse([cxm - 36, 190, cxm + 36, 262], fill=CREAM)
d.ellipse([cxm - 21, 209, cxm + 21, 251], fill=LIME)

pad = 110
fw = W - split - pad * 2
fx = split + pad

d.text((fx, 350), "TUA Email", font=font(24, True), fill=WHITE)
rounded(d, [fx, 388, fx + fw, 454], 14, fill=INK)
d.text((fx + 26, 408), "Enter your email", font=font(21), fill=(180, 180, 180))

d.text((fx, 492), "Password", font=font(24, True), fill=WHITE)
rounded(d, [fx, 530, fx + fw, 596], 14, fill=INK)
d.text((fx + 26, 550), "Enter your password", font=font(21), fill=(180, 180, 180))

bw = (fw - 24) // 2
for i, role in enumerate(["Student", "IERC"]):
    bx = fx + i * (bw + 24)
    rounded(d, [bx, 634, bx + bw, 730], 14, fill=CREAM if i == 0 else INK)
    d.text((bx + bw / 2 - d.textlength(role, font=font(23, True)) / 2, 670),
           role, font=font(23, True), fill=INK if i == 0 else WHITE)

rounded(d, [fx, 772, fx + fw, 850], 22, fill=CREAM)
d.text((fx + fw / 2 - d.textlength("ENTER", font=font(25, True)) / 2, 797),
       "ENTER", font=font(25, True), fill=INK)

placeholder_badge(d, 28, margin=split + 24)
d.rectangle([0, H - 118, split, H], fill=INK)
d.text((lx, H - 104), "CLEAR  -  Sign-in", font=font(32, True), fill=CREAM)
d.text((lx, H - 62), "Role-based access: Student and IERC committee",
       font=font(20), fill=(150, 152, 140))
img.save(os.path.join(OUT, "clear-1.jpg"), "JPEG", quality=86, optimize=True)


# --------------------------------------------------------------------------
# 2. Student workspace
# --------------------------------------------------------------------------
img = Image.new("RGB", (W, H), CREAM)
d = ImageDraw.Draw(img)
rail = shell(d, "Demo Student", "Student workspace",
             ["Home", "Application", "New request", "Action Center",
              "Notifications", "Profile"])

pad = 44
cx = rail + pad
cw = W - rail - pad * 2

# Current status card
rounded(d, [cx, 140, W - pad, 300], 18, fill=SAGE, outline=LINE, width=2)
d.text((cx + 30, 168), "Current Status", font=font(20, True), fill=INK)
d.text((cx + 30, 196), "Application ID: RES-00001", font=font(17), fill=MUTED)
d.text((W - pad - 30 - d.textlength("RECEIVED BY REVIEWER", font=font(38, True)), 206),
       "RECEIVED BY REVIEWER", font=font(38, True), fill=INK)

# Timeline
rounded(d, [cx, 324, W - pad, 520], 18, fill=SAGE, outline=LINE, width=2)
d.text((cx + 30, 350), "Timeline", font=font(20, True), fill=INK)
ly = 430
d.line([(cx + 40, ly), (W - pad - 40, ly)], fill=INK, width=3)
stages = [("Application", "Submitted", True), ("Submission", "Received", True),
          ("Sent For", "Review", True), ("Received By", "Reviewer", False),
          ("Review", "Finalization", False), ("Decision", "Issued", False)]
span = (W - pad - 40 - (cx + 40)) / (len(stages) - 1)
for i, (a, b, done) in enumerate(stages):
    sx = cx + 40 + i * span
    r = 13
    d.ellipse([sx - r, ly - r, sx + r, ly + r],
              fill=LIME if done else WHITE, outline=INK, width=3)
    if done:
        d.line([(sx - 6, ly), (sx - 1, ly + 6), (sx + 7, ly - 7)], fill=INK, width=3)
    d.text((sx - d.textlength(a, font=font(15, True)) / 2, ly + 24), a,
           font=font(15, True), fill=INK)
    d.text((sx - d.textlength(b, font=font(15)) / 2, ly + 44), b, font=font(15), fill=INK)
    note = "10/03/26" if done else ("Current Review" if i == 3 else "")
    if note:
        col = (110, 150, 20) if done else (110, 110, 90)
        d.text((sx - d.textlength(note, font=font(14, True)) / 2, ly + 68), note,
               font=font(14, True), fill=col)

# Next action + requirements
half = (cw - 24) // 2
rounded(d, [cx, 544, cx + half, 748], 18, fill=SAGE, outline=LINE, width=2)
d.text((cx + 30, 572), "Next Action", font=font(20, True), fill=INK)
d.text((cx + 30, 606), "The committee is already reviewing",
       font=font(21, True), fill=INK)
d.text((cx + 30, 634), "your submission.", font=font(21, True), fill=INK)
d.text((cx + 30, 672), "You will be notified when a decision is recorded.",
       font=font(15), fill=MUTED)

rx = cx + half + 24
rounded(d, [rx, 544, W - pad, 748], 18, fill=SAGE, outline=LINE, width=2)
d.text((rx + 30, 572), "Requirements & Revisions", font=font(20, True), fill=INK)
d.ellipse([rx + 30, 618, rx + 60, 648], fill=(120, 170, 30))
d.text((rx + 76, 620), "Requirements", font=font(19, True), fill=INK)
d.text((rx + 76, 644), "Complete", font=font(15), fill=(110, 150, 20))
d.ellipse([rx + 30, 686, rx + 60, 716], fill=SAGE, outline=MUTED, width=2)
d.text((rx + 76, 688), "1 revision", font=font(19, True), fill=INK)
d.text((rx + 76, 712), "See Revision Desk", font=font(15), fill=MUTED)

placeholder_badge(d, H - 172)
caption(d, "CLEAR  -  Student workspace",
        "Six-stage timeline, live status and requirements tracking", x=rail + pad)
img.save(os.path.join(OUT, "clear-2.jpg"), "JPEG", quality=86, optimize=True)


# --------------------------------------------------------------------------
# 3. Committee dashboard
# --------------------------------------------------------------------------
img = Image.new("RGB", (W, H), CREAM)
d = ImageDraw.Draw(img)
rail = shell(d, "Demo Professor", "Committee workspace",
             ["Dashboard", "New applications", "Under review", "For revision",
              "Pending decision", "Signed / approved", "Application queue"])
y = 200 + 58 * 7
d.line([(40, y), (260, y)], fill=(58, 58, 58), width=1)
d.text((40, y + 20), "RESOURCES", font=font(14, True), fill=(110, 112, 100))
d.text((52, y + 52), "Guidelines", font=font(19), fill=(150, 152, 140))

pad = 44
cx = rail + pad
d.text((cx, 130), "GOOD EVENING", font=font(15, True), fill=MUTED)
d.text((cx, 156), "Committee dashboard", font=font(52, True), fill=INK)
d.text((cx, 236), "Here's an overview of the document requests in your scope.",
       font=font(20), fill=MUTED)

# KPI row
stats = [("0", "New Applications"), ("1", "Under Review"), ("1", "For Revision"),
         ("0", "Pending Decision"), ("0", "Approved")]
gw = (W - pad - cx - 4 * 18) / 5
for i, (val, label) in enumerate(stats):
    gx = cx + i * (gw + 18)
    rounded(d, [gx, 292, gx + gw, 404], 16, fill=WHITE, outline=LINE, width=2)
    d.text((gx + 26, 316), val, font=font(46, True), fill=INK)
    d.text((gx + 26, 372), label, font=font(16), fill=MUTED)

# Application queue
rounded(d, [cx, 428, W - pad, 800], 18, fill=(240, 245, 214), outline=LINE, width=2)
d.text((cx + 30, 458), "SIGNED IN AS PROFESSOR", font=font(14, True), fill=MUTED)
d.text((cx + 30, 482), "Application Queue", font=font(30, True), fill=INK)
d.text((W - pad - 220, 492), "Refreshes every 30 seconds", font=font(15), fill=MUTED)

rounded(d, [cx + 30, 528, W - pad - 260, 578], 12, fill=WHITE, outline=LINE, width=1)
d.text((cx + 56, 544), "Search by title, student, or professor", font=font(18), fill=MUTED)
rounded(d, [W - pad - 250, 528, W - pad - 30, 578], 12, fill=WHITE, outline=LINE, width=1)
d.text((W - pad - 224, 544), "All statuses", font=font(18), fill=INK)

#
# Table columns are positioned as fractions of the card's inner width so they
# cannot overflow the card the way fixed pixel offsets did.
inner_x = cx + 30
inner_w = (W - pad - 30) - inner_x
COLS = {
    "ref": inner_x + 10,
    "title": inner_x + inner_w * 0.13,
    "req": inner_x + inner_w * 0.46,
    "assign": inner_x + inner_w * 0.62,
    "status": inner_x + inner_w * 0.76,
    "updated": inner_x + inner_w * 0.92,
}

hy = 604
for label, key in (("REFERENCE", "ref"), ("TITLE", "title"), ("REQUESTED BY", "req"),
                   ("ASSIGNED TO", "assign"), ("STATUS", "status"), ("UPDATED", "updated")):
    d.text((COLS[key], hy), label, font=font(13, True), fill=MUTED)
d.line([(inner_x, hy + 28), (W - pad - 30, hy + 28)], fill=LINE, width=1)

ry = 640
rowf = font(17, True)
d.text((COLS["ref"], ry + 15), "RES-00001", font=rowf, fill=(110, 150, 20))
d.text((COLS["title"], ry), "Impact of Short-Term Counseling on",
       font=font(17, True), fill=INK)
d.text((COLS["title"], ry + 24), "First-Year Academic Resilience",
       font=font(17, True), fill=INK)
d.text((COLS["req"], ry + 15), "Demo Student", font=font(17), fill=INK)
d.text((COLS["assign"], ry + 15), "Demo Professor", font=font(17), fill=INK)
status_pill(d, COLS["status"], ry + 6, 152, 38, fill=(214, 228, 240))
d.ellipse([COLS["status"] + 14, ry + 21, COLS["status"] + 26, ry + 33],
          fill=(70, 110, 160))
d.text((COLS["status"] + 34, ry + 13), "Under Review", font=font(15),
       fill=(50, 80, 120))
d.text((COLS["updated"], ry + 15), "Oct 3, 2026", font=font(17), fill=INK)

placeholder_badge(d, H - 172)
caption(d, "CLEAR  -  Committee dashboard",
        "Live queue counts, search and status filtering for reviewers", x=rail + pad)
img.save(os.path.join(OUT, "clear-3.jpg"), "JPEG", quality=86, optimize=True)


for n in ("clear-1.jpg", "clear-2.jpg", "clear-3.jpg"):
    p = os.path.join(OUT, n)
    print(f"{n}: {os.path.getsize(p) / 1024:.0f} KB  {Image.open(p).size}")