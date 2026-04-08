# Media Spec & Upload Guide

Everything you need to know about adding your photos to the portfolio.
The import tool handles all resizing and compression — you just need to name files correctly and drop them in the right folder.

---

## How It Works

```
1. Name your file correctly (see naming rules below)
2. Drop it into the correct drop/ subfolder
3. Run: npm run import
4. Done — your photo appears on the site automatically
```

---

## Folder Map

```
drop/
├── bio/           ← Your profile/about photo (1 image only)
├── featured/      ← Top 3 hero images on the showreel section
├── videography/   ← Cinematic video stills & thumbnails
├── portraits/     ← Portrait photography work
├── automotive/    ← Cars & bike photography
├── lifestyle/     ← Lifestyle photography
├── events/        ← Event coverage
└── misc/          ← Everything else
```

After running `npm run import`, processed images land in:
```
public/images/[category]/your-filename.jpg
```

---

## File Naming Rules

**Use lowercase letters, numbers, and hyphens only. No spaces, no special characters.**

| Do this ✓ | Not this ✗ |
|---|---|
| `street-portrait-01.jpg` | `Street Portrait 01.jpg` |
| `bmw-m3-golden-hour.jpg` | `BMW M3 (Golden Hour).jpg` |
| `concert-night-2024.jpg` | `concert night 2024!!.jpg` |
| `studio-vol-1.jpg` | `Studio_Vol_1.JPEG` |

The filename becomes the card title automatically:
- `bmw-m3-golden-hour.jpg` → **Bmw M3 Golden Hour**

You can always edit the title, role, and year manually in `src/data/images.js` after importing.

---

## Per-Category Specs

The import tool auto-resizes everything. Just give it any reasonable quality photo — it handles the rest.

| Category | Output Size | Aspect Ratio | Notes |
|---|---|---|---|
| `bio/` | 1200 × 1600 px | 3:4 (portrait) | Centred crop. Use a vertical shot. |
| `featured/` | 1200 × 1600 px | 3:4 (portrait) | These are the 3 big WebGL distortion cards. Best photos go here. |
| `videography/` | 1400 × 933 px | 3:2 (landscape) | Wide crop. Video stills work great here. |
| `portraits/` | 900 × 1200 px | 3:4 (portrait) | Vertical crop. Use face/upper body shots. |
| `automotive/` | 1400 × 933 px | 3:2 (landscape) | Wide crop. Great for side profiles & road shots. |
| `lifestyle/` | 1200 × 900 px | 4:3 (landscape) | Standard landscape crop. |
| `events/` | 1400 × 933 px | 3:2 (landscape) | Wide crop. Good for crowd/stage shots. |
| `misc/` | 1200 × 900 px | 4:3 (landscape) | Standard landscape crop. |

All images are output as **progressive JPEG** at 82–88% quality.

---

## Input Requirements

- **Minimum resolution:** Larger than the output size listed above (shooting RAW or high-res JPEG is ideal)
- **Accepted formats:** `.jpg` `.jpeg` `.png` `.webp` `.tiff` `.tif` `.heic` `.avif`
- **Colour space:** sRGB preferred (the tool converts automatically but sRGB is safest)
- **Max input size:** No hard limit — the tool handles large files fine

---

## The bio/ Folder (Special Case)

Only put **one image** in `drop/bio/`. It is used as your portrait in the About section.

```
drop/bio/your-name.jpg   ← single file, any name
```

After importing, the About section uses it automatically.

---

## The featured/ Folder (Special Case)

Put your **best 3 images** here — one per category ideally (e.g. one video still, one portrait, one car shot). These are the large WebGL distortion hover cards at the top of the work section.

```
drop/featured/showreel-hero.jpg
drop/featured/portrait-hero.jpg
drop/featured/automotive-hero.jpg
```

If you add more than 3, only the first 3 are used as the featured cards. The rest are ignored.

---

## Editing Titles, Roles & Years

After running `npm run import`, open `src/data/images.js`. Each image entry looks like this:

```js
{ slug: 'bmw-m3-golden-hour', src: '/images/automotive/bmw-m3-golden-hour.jpg', title: 'Bmw M3 Golden Hour', role: 'Automotive Photography', year: '2024' }
```

Edit `title`, `role`, and `year` freely — the tool will never overwrite values you've already set for existing images. It only adds new entries for new files.

---

## Adding More Photos Later

Just drop new files into the folder and run `npm run import` again. Existing images are untouched.

```bash
npm run import          # process once and exit
npm run import:watch    # stay running, auto-process any file you drop in
```

---

## Removing a Photo

1. Delete the file from `public/images/[category]/`
2. Remove its entry from `src/data/images.js`
3. The site updates on the next save (no rebuild needed in dev mode)

---

## Recommended Compression (Before Dropping In)

The import tool already compresses output, but if your source files are extremely large (>30 MB), pre-compress them first to speed up processing:

- **[Squoosh](https://squoosh.app)** — browser-based, free, drag and drop
- **[ImageOptim](https://imageoptim.com)** — Mac app, batch processing
- **Lightroom / Capture One** — export at 90–100% JPEG quality, full resolution

---

## Quick Reference

```
Got a new photo?

1. Name it:     my-photo-name.jpg   (lowercase, hyphens, no spaces)
2. Drop it in:  drop/[category]/
3. Run:         npm run import
4. Done ✓
```
