/* ============================================================
   Classical Scents — product data (single source of truth)
   Every page, card, filter, quiz and the product page read from
   this file. Edit prices, notes and stock here only.
   ============================================================ */

/* Set to 'jpg' (or 'png') once real photos are in /images/products/.
   Files must be named  <image>-1.<ext>, <image>-2.<ext>, <image>-3.<ext>  */
var IMAGE_EXT = 'svg';
/* Set to true after adding a matching .webp next to every photo. */
var USE_WEBP = false;

var FREE_SHIPPING_THRESHOLD = 5000;

var BRAND = {
  name: 'Classical Scents',
  url: 'https://classicalscents.com/',
  phone: '+92 300 1234567',
  whatsapp: '923001234567',
  email: 'hello@classicalscents.com',
  address: 'Shop 12, Zamzama Boulevard, DHA Phase 5, Karachi 75500',
  instagram: 'https://instagram.com/classicalscents'
};

var COLLECTIONS = [
  { slug: 'signature',    name: 'Signature',      tagline: 'The house classics. Wearable, polished, unmistakable.',  image: 'images/collection-signature.jpg' },
  { slug: 'prive',        name: 'Privé',          tagline: 'Limited, intense and dressed for the evening.',          image: 'images/collection-prive.jpg' },
  { slug: 'gift-sets',    name: 'Gift Sets',      tagline: 'Curated sets, boxed, wrapped and ready to give.',        image: 'images/collection-gift-sets.jpg' }
];

/* gender: men | women | unisex   collection: see COLLECTIONS   type: extrait | attar
   sizes: ml, price (PKR), originalPrice (PKR or null when not on sale)
   badges: bestseller | new | restocked   (Sold Out and -X% are computed from stock / prices)
   occasions: daily | office | evening | wedding     moods: fresh | warm | bold | soft */
var PRODUCTS = [
  /* ---- Real Classical Scents bottles (photographed). Notes, prices and stock are demo values: edit before launch. ---- */
  {
    id: 1, slug: 'royal', name: 'Royal', gender: 'unisex', collection: 'prive', type: 'extrait', family: 'Oriental',
    topNotes: ['Saffron', 'Bergamot', 'Pink Pepper'], heartNotes: ['Oud', 'Rose', 'Cedar'], baseNotes: ['Amber', 'Vanilla', 'Musk'],
    keyNotes: ['Saffron', 'Oud', 'Amber'], longevity: 14, sillage: 4,
    sizes: [{ ml: 30, price: 2950, originalPrice: null }, { ml: 50, price: 4450, originalPrice: 5250 }, { ml: 100, price: 6950, originalPrice: null }],
    badges: ['bestseller'], rating: 4.9, reviewCount: 236, stock: 32,
    description: 'Saffron and smoky oud poured over golden amber, in a bottle that fades from black to honey. Royal is the scent you wear when the evening matters and you intend to be remembered.',
    howToWear: 'Two sprays on the neck and one on the chest. Let it settle for ten minutes; the oud softens and the amber stays for the rest of the night.',
    occasions: ['evening', 'wedding'], moods: ['bold', 'warm'], image: 'royal', accent: '#a8762e', photos: ['royal-1.png', 'royal-2.jpg', 'royal-3.jpg']
  },
  {
    id: 2, slug: 'queen', name: 'Queen', gender: 'women', collection: 'signature', type: 'extrait', family: 'Floral',
    topNotes: ['Raspberry', 'Pink Pepper', 'Mandarin'], heartNotes: ['Rose', 'Peony', 'Jasmine'], baseNotes: ['Vanilla', 'White Musk', 'Sandalwood'],
    keyNotes: ['Rose', 'Raspberry', 'Vanilla'], longevity: 10, sillage: 3,
    sizes: [{ ml: 30, price: 2650, originalPrice: null }, { ml: 50, price: 3950, originalPrice: null }, { ml: 100, price: 6250, originalPrice: null }],
    badges: ['new'], rating: 4.8, reviewCount: 118, stock: 40,
    description: 'Juicy raspberry and pink pepper open onto a bouquet of rose and peony, softened by vanilla musk. Bright, feminine and confident, like its rose-to-sapphire bottle.',
    howToWear: 'Spray on wrists, neck and the hem of a dupatta. Two sprays are plenty for daytime; add one more for an evening event.',
    occasions: ['wedding', 'daily'], moods: ['soft', 'bold'], image: 'queen', accent: '#b0406a', photos: ['queen-1.png', 'queen-2.jpg', 'queen-3.jpg']
  },
  {
    id: 3, slug: 'alpha', name: 'Alpha', gender: 'men', collection: 'signature', type: 'extrait', family: 'Woody',
    topNotes: ['Bergamot', 'Black Pepper', 'Cardamom'], heartNotes: ['Lavender', 'Vetiver', 'Geranium'], baseNotes: ['Cedarwood', 'Amberwood', 'Tonka'],
    keyNotes: ['Pepper', 'Vetiver', 'Cedarwood'], longevity: 12, sillage: 3,
    sizes: [{ ml: 30, price: 2650, originalPrice: null }, { ml: 50, price: 3950, originalPrice: 4650 }, { ml: 100, price: 6250, originalPrice: null }],
    badges: ['bestseller'], rating: 4.8, reviewCount: 204, stock: 45,
    description: 'Peppered bergamot and cardamom over a dry heart of vetiver and lavender, finishing on polished cedar and amberwood. A sharp, grown-up signature for the office and well beyond it.',
    howToWear: 'Two sprays on the collar and one on the back of the neck. It projects cleanly for the first hours, then sits close and woody into the evening.',
    occasions: ['office', 'daily', 'evening'], moods: ['bold', 'fresh'], image: 'alpha', accent: '#6f5c86', photos: ['alpha-1.png', 'alpha-2.jpg', 'alpha-3.jpg']
  },
  {
    id: 4, slug: 'divine', name: 'Divine', gender: 'unisex', collection: 'signature', type: 'extrait', family: 'Amber',
    topNotes: ['Pear', 'Mandarin', 'Neroli'], heartNotes: ['Orange Blossom', 'Jasmine', 'Honey'], baseNotes: ['Vanilla', 'Sandalwood', 'Benzoin'],
    keyNotes: ['Honey', 'Orange Blossom', 'Vanilla'], longevity: 11, sillage: 3,
    sizes: [{ ml: 30, price: 2850, originalPrice: null }, { ml: 50, price: 4250, originalPrice: null }, { ml: 100, price: 6750, originalPrice: null }],
    badges: ['new'], rating: 4.8, reviewCount: 97, stock: 38,
    description: 'Golden honey and orange blossom glowing over creamy sandalwood and vanilla, as warm as the liquid in its clear glass. Soft enough for every day, rich enough to be noticed.',
    howToWear: 'Spray on pulse points and once on a scarf or shawl. Divine clings to fabric beautifully, so you will still catch it the next morning.',
    occasions: ['daily', 'evening'], moods: ['warm', 'soft'], image: 'divine', accent: '#c9953c', photos: ['divine-1.png', 'divine-2.jpg', 'divine-3.jpg']
  }
];

/* Gift sets / bundles. items reference product ids; price is the set price, compareAt is the
   sum of the pieces bought separately (used for the "Save X%" badge). */
var BUNDLES = [
  { id: 'bundle-discovery', slug: 'signature-four', name: 'The Signature Four', subtitle: 'Alpha, Queen, Divine and Royal in 10ml sprays', items: [3, 2, 4, 1],
    price: 3950, compareAt: 4950, image: 'images/bundle-discovery.jpg', stock: 40,
    description: 'All four house signatures in 10ml travel sprays, boxed in black and gold. The easiest way to find yours before choosing a full bottle.' },
  { id: 'bundle-oud-trio', slug: 'royal-divine-duo', name: 'Royal & Divine', subtitle: 'Royal 50ml and Divine 50ml', items: [1, 4],
    price: 7650, compareAt: 8700, image: 'images/bundle-oud-trio.jpg', stock: 15,
    description: 'Smoky saffron oud and golden honey amber, boxed together. Our most-gifted pairing for Eid and weddings.' },
  { id: 'bundle-duo', slug: 'his-and-hers-duo', name: 'His & Hers Duo', subtitle: 'Alpha 50ml and Queen 50ml', items: [3, 2],
    price: 6950, compareAt: 7900, image: 'images/bundle-duo.jpg', stock: 25,
    description: 'A sharp woody signature for him and a rosy floral for her, boxed together with a handwritten card. The anniversary gift that gets used every day.' }
];

/* productId must match the product the review talks about. featured reviews appear on the home page carousel. */
var REVIEWS = [
  { productId: 1,  name: 'Hamza R.',   city: 'Karachi',    rating: 5, featured: true,  quote: 'Wore Royal to my cousin\u2019s valima and three people asked what it was before dinner. Still on my kurta the next morning.' },
  { productId: 2,  name: 'Mahnoor S.', city: 'Karachi',    rating: 5, featured: true,  quote: 'Queen is rosy, juicy and so feminine. I get compliments at work, and the pink-to-blue bottle looks stunning on my dresser.' },
  { productId: 3,  name: 'Ahmed S.',   city: 'Islamabad',  rating: 5, featured: true,  quote: 'Alpha is my office scent now. Peppery and woody, never loud, and it lasts from morning meetings to dinner.' },
  { productId: 4,  name: 'Ayesha K.',  city: 'Lahore',     rating: 5, featured: true,  quote: 'Divine smells expensive in the best way. Warm honey and vanilla that lingers on my scarf for days.' },
  { productId: 1,  name: 'Bilal A.',   city: 'Rawalpindi', rating: 5, featured: true,  quote: 'Royal is the only perfume I have bought twice. The saffron opening is unreal and the amber lasts well past midnight.' },
  { productId: 2,  name: 'Sana M.',    city: 'Lahore',     rating: 5, featured: true,  quote: 'Queen is my wedding-season scent. Sweet without being childish, and it stays on my dupatta all evening.' },
  { productId: 3,  name: 'Taha J.',    city: 'Hyderabad',  rating: 5, featured: false, quote: 'Alpha lasts through a full shift and the drive home. Clean, woody and exactly as described.' },
  { productId: 4,  name: 'Hira B.',    city: 'Multan',     rating: 4, featured: false, quote: 'Divine is soft, warm and honeyed. I wish the 30ml were a little bigger because I reach for it every day.' },
];

/* Data validation: runs once on load and reports problems in the console without breaking the page. */
(function validateProducts() {
  var ids = {}, slugs = {}, problems = [];
  PRODUCTS.forEach(function (p) {
    if (ids[p.id]) problems.push('Duplicate product id ' + p.id);
    if (slugs[p.slug]) problems.push('Duplicate slug ' + p.slug);
    ids[p.id] = slugs[p.slug] = true;
    if (!p.sizes || !p.sizes.length) problems.push(p.name + ' has no sizes');
    (p.sizes || []).forEach(function (s) {
      if (!(s.price > 0)) problems.push(p.name + ' ' + s.ml + 'ml has an invalid price');
      if (s.originalPrice !== null && !(s.originalPrice > s.price)) problems.push(p.name + ' ' + s.ml + 'ml originalPrice must be higher than price');
    });
    if (!(p.rating > 0 && p.rating <= 5)) problems.push(p.name + ' has an invalid rating');
  });
  BUNDLES.forEach(function (b) {
    if (!(b.price > 0) || !(b.compareAt > b.price)) problems.push(b.name + ' has an invalid price');
    b.items.forEach(function (id) { if (!ids[id]) problems.push(b.name + ' references missing product ' + id); });
  });
  REVIEWS.forEach(function (r) { if (!ids[r.productId]) problems.push('Review by ' + r.name + ' references missing product ' + r.productId); });
  if (problems.length) console.warn('Classical Scents data problems:\n' + problems.join('\n'));
})();
