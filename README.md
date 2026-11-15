# Classical Scents — static storefront

Luxury black + matte gold e-commerce site for Classical Scents (Pakistan, PKR). Plain HTML5, CSS and vanilla JavaScript. No frameworks, no build step, no npm.

## Open it

Double-click `index.html`. Everything works from the file system: pages, cart, wishlist, filters, quiz, search.

For a local server (optional, closer to how GitHub Pages serves it):

```bash
npx serve .
```

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Home: hero, showcase tabs, collections, quiz, bundles, reviews, newsletter |
| `shop.html` | Catalogue with filters, sort, grid/list, shareable URL (`?gender=men`, `?collection=prive`, `?type=attar`, `?q=oud`) |
| `product.html?id=1` | Product page (gallery, notes pyramid, meters, tabs, reviews, related) |
| `cart.html` | Cart page; a slide-out cart drawer is also on every page |
| `collections.html`, `about.html`, `contact.html` | Editorial pages; contact has the FAQ with shipping / tracking / exchange anchors |
| `css/style.css` | The whole design system (hero critical CSS is inline in `index.html`) |
| `js/products.js` | **Single source of truth** for products, bundles, reviews, collections and brand contact details |
| `js/main.js` | Header, search, cart, wishlist, cards, quiz, filters, product page |
| `images/` | SVG placeholders (replace with photos, keep the filenames) |
| `robots.txt`, `sitemap.xml` | SEO, pointed at `https://classicalscents.com` |

## Edit products

Open `js/products.js`. Each product looks like this:

```js
{
  id: 1, slug: 'aurum-oud', name: 'Aurum Oud', gender: 'men',       // men | women | unisex
  collection: 'oud-attar',                                           // signature | prive | oud-attar | fresh-citrus
  type: 'extrait', family: 'Woody',                                  // type: extrait | attar
  topNotes: [...], heartNotes: [...], baseNotes: [...], keyNotes: ['Oud', 'Amber', 'Vanilla'],
  longevity: 14, sillage: 4,                                         // hours, 1–5
  sizes: [{ ml: 50, price: 4450, originalPrice: 5550 }, ...],        // originalPrice: null when not on sale
  badges: ['bestseller'],                                            // bestseller | new | restocked
  rating: 4.8, reviewCount: 212, stock: 24,                          // stock 0 = Sold Out + Notify Me
  description: '...', howToWear: '...',
  occasions: ['evening', 'wedding'], moods: ['bold', 'warm'],        // used by the Find Your Scent quiz
  image: 'aurum-oud'                                                 // -> images/products/aurum-oud-1.svg, -2, -3
}
```

Rules the site relies on:

- `id` and `slug` must be unique. Prices must be above 0. `originalPrice` must be higher than `price` or `null`.
- `-X%` badges, Sold Out, "from" prices, the quiz and search are all computed from this data. Nothing is hard-coded in HTML.
- A validator runs on every page load and logs any data problem to the browser console.
- Bundles live in `BUNDLES` (set price + `compareAt` for the Save X% badge). Reviews live in `REVIEWS`; `productId` must match the product the quote mentions.
- Phone, WhatsApp number, email and address: edit `BRAND` at the top of `products.js` **and** the matching text in the footer of each HTML page (search for `923001234567`).

## Replace the placeholder images

All artwork is SVG so you can see the layout now. Swap in photos with the same base filenames:

1. Product photos: `images/products/<image>-1.jpg`, `-2.jpg`, `-3.jpg` (front, angle, detail). Recommended 800×800px square PNG with a transparent background (cards show the whole bottle, nothing is cropped).
2. In `js/products.js` change `IMAGE_EXT = 'svg'` to `'jpg'` (or `'png'`).
3. Optional WebP: add `<image>-1.webp` next to each photo and set `USE_WEBP = true`. Cards then render `<picture>` with a WebP source.
4. Other images are referenced directly from the HTML: `images/collection-*.svg`, `gender-*.svg`, `insta-*.svg`, `about-*.svg`, `bundle-*.svg`, `map-placeholder.svg`. Replace the file and update the extension in the `src` attribute.
5. Social preview: add `images/og-cover.png` (1200×630). The meta tags already point to it; the SVG version is only a visual reference.

Set explicit `width`/`height` on any new `<img>` to keep layout shift at zero.

### Real product photos

Products with real photos use a `photos` list in `js/products.js`, for example `photos: ['royal-1.png', 'royal-2.jpg', 'royal-3.jpg']`:

- `-1.png` is the studio cut-out on a transparent background (card and main gallery image).
- `-2.jpg` is the lifestyle shot (shown when hovering a card).
- `-3.jpg` is a second angle or close-up.

Put a `.webp` copy with the same name next to each file; the site serves WebP first and falls back to PNG/JPG. Royal, Queen, Alpha and Divine use real photos. Add your other perfumes as new entries with ids 5, 6 and 7.

### Promo tiles (stone stage)

Product cards, the home features and the collection tiles use two extra files per perfume:

- `images/products/<image>-stage.jpg` / `.webp`: the 1000×900 backdrop with the stone and props. The stone's top surface sits 25.8% above the bottom edge.
- `images/products/<image>-cut.png` / `.webp`: the bottle alone, tightly cropped, transparent, base at the bottom edge.

Set `tagline` and `cut: [width, 720]` on the product in `js/products.js`. A product without `cut` falls back to the plain card.

## Deploy to GitHub Pages

1. Create a repository and push this folder to the `main` branch.
2. Repository **Settings → Pages → Build and deployment**: Source "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site goes live at `https://<user>.github.io/<repo>/`. All links are relative, so it works in a sub-folder.
4. Custom domain: add a `CNAME` file containing `classicalscents.com`, point DNS at GitHub Pages and tick "Enforce HTTPS". `robots.txt`, `sitemap.xml` and the canonical tags already use that domain.

## Checkout

The Checkout button opens a WhatsApp order message with the cart contents. To connect a real gateway, replace the `checkout()` function in `js/main.js`.
