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
  { slug: 'signature',    name: 'Signature',      tagline: 'The house classics. Wearable, polished, unmistakable.',  image: 'images/collection-signature.svg' },
  { slug: 'prive',        name: 'Privé',          tagline: 'Limited, intense and dressed for the evening.',          image: 'images/collection-prive.svg' },
  { slug: 'oud-attar',    name: 'Oud & Attar',    tagline: 'Pure oils and deep woods, in the old tradition.',        image: 'images/collection-oud-attar.svg' },
  { slug: 'fresh-citrus', name: 'Fresh & Citrus', tagline: 'Cold-pressed brightness for forty-degree days.',         image: 'images/collection-fresh-citrus.svg' },
  { slug: 'gift-sets',    name: 'Gift Sets',      tagline: 'Curated sets, boxed, wrapped and ready to give.',        image: 'images/collection-gift-sets.svg' }
];

/* gender: men | women | unisex   collection: see COLLECTIONS   type: extrait | attar
   sizes: ml, price (PKR), originalPrice (PKR or null when not on sale)
   badges: bestseller | new | restocked   (Sold Out and -X% are computed from stock / prices)
   occasions: daily | office | evening | wedding     moods: fresh | warm | bold | soft */
var PRODUCTS = [
  {
    id: 1, slug: 'aurum-oud', name: 'Aurum Oud', gender: 'men', collection: 'oud-attar', type: 'extrait', family: 'Woody',
    topNotes: ['Saffron', 'Pink Pepper', 'Bergamot'], heartNotes: ['Cambodian Oud', 'Rose', 'Cedar'], baseNotes: ['Amber', 'Vanilla', 'Sandalwood'],
    keyNotes: ['Oud', 'Amber', 'Vanilla'], longevity: 14, sillage: 4,
    sizes: [{ ml: 30, price: 2950, originalPrice: null }, { ml: 50, price: 4450, originalPrice: 5550 }, { ml: 100, price: 7450, originalPrice: 8950 }],
    badges: ['bestseller'], rating: 4.8, reviewCount: 212, stock: 24,
    description: 'A dense, smoky oud softened by rose and warmed by amber as the evening wears on. Built for Karachi nights, long dinners and the kind of handshake people remember.',
    howToWear: 'Two sprays on the neck and one on the chest before you dress. Let it settle for ten minutes; the rose steps forward and the smoke steps back.',
    occasions: ['evening', 'wedding'], moods: ['bold', 'warm'], image: 'aurum-oud'
  },
  {
    id: 2, slug: 'noor', name: 'Noor', gender: 'women', collection: 'signature', type: 'extrait', family: 'Floral',
    topNotes: ['Bergamot', 'Pear', 'Pink Pepper'], heartNotes: ['Tuberose', 'Jasmine', 'Orange Blossom'], baseNotes: ['White Musk', 'Sandalwood', 'Tonka'],
    keyNotes: ['Tuberose', 'Pear', 'White Musk'], longevity: 10, sillage: 3,
    sizes: [{ ml: 30, price: 2650, originalPrice: null }, { ml: 50, price: 3950, originalPrice: null }, { ml: 100, price: 6450, originalPrice: null }],
    badges: [], rating: 4.7, reviewCount: 168, stock: 40,
    description: 'Luminous white florals opening on crisp pear and settling into a clean, skin-like musk. Noor is the one you reach for when you want to feel put together before you leave the house.',
    howToWear: 'Spray on pulse points and once through the hair. Pairs beautifully with the Rose Attar Absolue on the wrists for evenings.',
    occasions: ['daily', 'office'], moods: ['soft', 'fresh'], image: 'noor'
  },
  {
    id: 3, slug: 'saffron-royale', name: 'Saffron Royale', gender: 'unisex', collection: 'prive', type: 'extrait', family: 'Oriental',
    topNotes: ['Saffron', 'Cardamom', 'Bergamot'], heartNotes: ['Iris', 'Turkish Rose', 'Clove'], baseNotes: ['Amber', 'Benzoin', 'Vetiver'],
    keyNotes: ['Saffron', 'Rose', 'Amber'], longevity: 12, sillage: 4,
    sizes: [{ ml: 30, price: 3200, originalPrice: null }, { ml: 50, price: 4950, originalPrice: null }, { ml: 100, price: 7950, originalPrice: null }],
    badges: ['bestseller'], rating: 4.9, reviewCount: 143, stock: 18,
    description: 'Saffron threads steeped in rose and iris, drying down to a resinous golden amber. Royale is the signature of someone who never needs to raise their voice.',
    howToWear: 'One spray is enough for an office day; three for a shaadi. Apply to clothing for the longest trail.',
    occasions: ['wedding', 'evening'], moods: ['warm', 'bold'], image: 'saffron-royale'
  },
  {
    id: 4, slug: 'citrus-veil', name: 'Citrus Veil', gender: 'unisex', collection: 'fresh-citrus', type: 'extrait', family: 'Citrus',
    topNotes: ['Sicilian Lemon', 'Grapefruit', 'Mint'], heartNotes: ['Neroli', 'Green Tea', 'Petitgrain'], baseNotes: ['White Musk', 'Cedar', 'Ambrette'],
    keyNotes: ['Lemon', 'Green Tea', 'Cedar'], longevity: 7, sillage: 2,
    sizes: [{ ml: 30, price: 2450, originalPrice: null }, { ml: 50, price: 3450, originalPrice: null }, { ml: 100, price: 5450, originalPrice: null }],
    badges: ['new'], rating: 4.6, reviewCount: 54, stock: 60,
    description: 'A cold-pressed burst of lemon and grapefruit over cool green tea, drying down to clean cedar. The first morning of a holiday, bottled for forty-degree afternoons.',
    howToWear: 'Generous sprays after a shower, and keep the 30ml in your bag for a 4pm refresh.',
    occasions: ['daily', 'office'], moods: ['fresh'], image: 'citrus-veil'
  },
  {
    id: 5, slug: 'midnight-musk', name: 'Midnight Musk', gender: 'men', collection: 'signature', type: 'extrait', family: 'Musky',
    topNotes: ['Black Pepper', 'Lavender', 'Bergamot'], heartNotes: ['Geranium', 'Orris', 'Nutmeg'], baseNotes: ['Black Musk', 'Patchouli', 'Amberwood'],
    keyNotes: ['Black Musk', 'Pepper', 'Amberwood'], longevity: 11, sillage: 3,
    sizes: [{ ml: 30, price: 2650, originalPrice: null }, { ml: 50, price: 3950, originalPrice: 4650 }, { ml: 100, price: 6450, originalPrice: null }],
    badges: [], rating: 4.7, reviewCount: 189, stock: 35,
    description: 'Dark, velvety musk sharpened with pepper and lavender, finishing on a long mineral amberwood. Confident on a shirt collar at nine in the morning and still there at midnight.',
    howToWear: 'Two sprays on the collar and one on the back of the neck. Avoid rubbing the wrists together; it flattens the pepper.',
    occasions: ['daily', 'evening', 'office'], moods: ['bold', 'warm'], image: 'midnight-musk'
  },
  {
    id: 6, slug: 'rose-attar-absolue', name: 'Rose Attar Absolue', gender: 'women', collection: 'oud-attar', type: 'attar', family: 'Floral',
    topNotes: ['Taif Rose', 'Pink Pepper'], heartNotes: ['Damask Rose', 'Geranium', 'Saffron'], baseNotes: ['Sandalwood', 'Musk', 'Amber'],
    keyNotes: ['Taif Rose', 'Saffron', 'Sandalwood'], longevity: 16, sillage: 3,
    sizes: [{ ml: 12, price: 2950, originalPrice: null }, { ml: 24, price: 4950, originalPrice: null }],
    badges: [], rating: 4.9, reviewCount: 97, stock: 15,
    description: 'An oil attar built around two roses, bright Taif on top and deep Damask underneath, resting on creamy sandalwood. A single drop on the wrist lasts through the day and into the next morning.',
    howToWear: 'Attars are oil-based: dab one drop on each wrist and behind the ears. Never spray, never rub.',
    occasions: ['wedding', 'daily'], moods: ['soft', 'warm'], image: 'rose-attar-absolue'
  },
  {
    id: 7, slug: 'velvet-amber', name: 'Velvet Amber', gender: 'women', collection: 'prive', type: 'extrait', family: 'Amber',
    topNotes: ['Mandarin', 'Saffron', 'Cinnamon'], heartNotes: ['Orchid', 'Labdanum', 'Jasmine'], baseNotes: ['Amber', 'Vanilla', 'Sandalwood'],
    keyNotes: ['Amber', 'Cinnamon', 'Vanilla'], longevity: 12, sillage: 4,
    sizes: [{ ml: 30, price: 2950, originalPrice: null }, { ml: 50, price: 4650, originalPrice: null }, { ml: 100, price: 7450, originalPrice: null }],
    badges: ['new'], rating: 4.8, reviewCount: 61, stock: 22,
    description: 'Molten amber and vanilla wrapped in cinnamon-spiced mandarin, soft as the inside of a velvet box. Warm enough for a winter shawl and polished enough for a December wedding.',
    howToWear: 'Spray on the inside of a shawl or dupatta as well as the skin; the amber clings to fabric for days.',
    occasions: ['wedding', 'evening'], moods: ['warm', 'soft'], image: 'velvet-amber'
  },
  {
    id: 8, slug: 'sandal-noir', name: 'Sandal Noir', gender: 'men', collection: 'signature', type: 'extrait', family: 'Woody',
    topNotes: ['Cardamom', 'Bergamot', 'Violet Leaf'], heartNotes: ['Mysore Sandalwood', 'Cedar', 'Iris'], baseNotes: ['Vetiver', 'Tonka', 'Incense'],
    keyNotes: ['Sandalwood', 'Cardamom', 'Incense'], longevity: 12, sillage: 3,
    sizes: [{ ml: 30, price: 2850, originalPrice: null }, { ml: 50, price: 4250, originalPrice: null }, { ml: 100, price: 6950, originalPrice: null }],
    badges: ['bestseller'], rating: 4.8, reviewCount: 231, stock: 0,
    description: 'Creamy sandalwood turned sombre with incense and vetiver, cut by a flash of cardamom on top. The office signature that quietly outlasts everyone else’s.',
    howToWear: 'Two sprays on the chest under a shirt. It projects gently and lasts a full working day.',
    occasions: ['office', 'daily'], moods: ['warm', 'bold'], image: 'sandal-noir'
  },
  {
    id: 9, slug: 'jasmine-sahar', name: 'Jasmine Sahar', gender: 'women', collection: 'signature', type: 'extrait', family: 'Floral',
    topNotes: ['Green Mandarin', 'Pear', 'Lily of the Valley'], heartNotes: ['Sambac Jasmine', 'Peony', 'Rose'], baseNotes: ['Musk', 'Cashmeran', 'Cedar'],
    keyNotes: ['Jasmine', 'Peony', 'Musk'], longevity: 9, sillage: 3,
    sizes: [{ ml: 30, price: 2650, originalPrice: null }, { ml: 50, price: 3950, originalPrice: null }, { ml: 100, price: 6450, originalPrice: null }],
    badges: ['new'], rating: 4.6, reviewCount: 38, stock: 30,
    description: 'Sambac jasmine at dawn, dewy and green, carried on soft musk and cashmere woods. Light enough for a Karachi summer and pretty enough to earn compliments on the stairs.',
    howToWear: 'Spray lightly on the neck and wrists in the morning. Reapply once in the afternoon for a fresh lift.',
    occasions: ['daily', 'office'], moods: ['fresh', 'soft'], image: 'jasmine-sahar'
  },
  {
    id: 10, slug: 'ocean-marine', name: 'Ocean Marine', gender: 'men', collection: 'fresh-citrus', type: 'extrait', family: 'Aquatic',
    topNotes: ['Sea Salt', 'Bergamot', 'Mint'], heartNotes: ['Marine Accord', 'Sage', 'Geranium'], baseNotes: ['Driftwood', 'Ambergris', 'Musk'],
    keyNotes: ['Sea Salt', 'Sage', 'Driftwood'], longevity: 8, sillage: 3,
    sizes: [{ ml: 30, price: 2450, originalPrice: null }, { ml: 50, price: 3650, originalPrice: 4250 }, { ml: 100, price: 5950, originalPrice: null }],
    badges: ['restocked'], rating: 4.5, reviewCount: 122, stock: 45,
    description: 'Salt air, cold bergamot and a mineral marine note that reads like a Clifton breeze. Fresh enough for the gym bag and polished enough for a Friday lunch.',
    howToWear: 'Spray freely on the chest and forearms. Best from a 20cm distance so the salt note stays airy.',
    occasions: ['daily', 'office'], moods: ['fresh'], image: 'ocean-marine'
  },
  {
    id: 11, slug: 'smoky-vetiver', name: 'Smoky Vetiver', gender: 'men', collection: 'prive', type: 'extrait', family: 'Green',
    topNotes: ['Grapefruit', 'Pink Pepper', 'Juniper'], heartNotes: ['Haitian Vetiver', 'Cypress', 'Nutmeg'], baseNotes: ['Smoked Wood', 'Leather', 'Oakmoss'],
    keyNotes: ['Vetiver', 'Grapefruit', 'Leather'], longevity: 11, sillage: 3,
    sizes: [{ ml: 30, price: 3200, originalPrice: null }, { ml: 50, price: 4950, originalPrice: null }, { ml: 100, price: 7950, originalPrice: null }],
    badges: ['restocked'], rating: 4.7, reviewCount: 76, stock: 12,
    description: 'Rooty vetiver smoked over cypress and leather, lifted by bitter grapefruit. Dry, grown-up and quietly unusual: the scent of a tailor who never advertises.',
    howToWear: 'Spray on the neck and the lapel of a jacket. Skip the wrists; vetiver reads best from a little distance.',
    occasions: ['office', 'evening'], moods: ['bold', 'fresh'], image: 'smoky-vetiver'
  },
  {
    id: 12, slug: 'vanilla-ember', name: 'Vanilla Ember', gender: 'unisex', collection: 'signature', type: 'extrait', family: 'Gourmand',
    topNotes: ['Bergamot', 'Rum Accord', 'Cardamom'], heartNotes: ['Bourbon Vanilla', 'Tonka', 'Orris'], baseNotes: ['Benzoin', 'Amber', 'Smoky Woods'],
    keyNotes: ['Bourbon Vanilla', 'Rum', 'Benzoin'], longevity: 13, sillage: 4,
    sizes: [{ ml: 30, price: 2850, originalPrice: null }, { ml: 50, price: 4250, originalPrice: 4950 }, { ml: 100, price: 6950, originalPrice: null }],
    badges: ['bestseller'], rating: 4.9, reviewCount: 304, stock: 50,
    description: 'Dark bourbon vanilla warmed by rum and embers, sweet without ever turning sugary. Our most-complimented scent, and the one that gets borrowed from the dresser.',
    howToWear: 'Two sprays on the chest and one in the hair. Layer under Aurum Oud for the deepest winter trail.',
    occasions: ['evening', 'daily'], moods: ['warm', 'soft'], image: 'vanilla-ember'
  },
  {
    id: 13, slug: 'oud-mystique', name: 'Oud Mystique', gender: 'unisex', collection: 'oud-attar', type: 'attar', family: 'Oud',
    topNotes: ['Saffron', 'Dried Fruits'], heartNotes: ['Assam Oud', 'Rose', 'Patchouli'], baseNotes: ['Sandalwood', 'Amber', 'Musk'],
    keyNotes: ['Assam Oud', 'Saffron', 'Rose'], longevity: 18, sillage: 5,
    sizes: [{ ml: 12, price: 3450, originalPrice: null }, { ml: 24, price: 5950, originalPrice: null }],
    badges: ['restocked'], rating: 4.8, reviewCount: 88, stock: 10,
    description: 'A pure, slow-burning oud attar with dried fruits and rose folded into the smoke. One drop, no spray, and the room knows you have arrived.',
    howToWear: 'Dab a single drop on the wrists and chest. It is potent: start with less than you think you need.',
    occasions: ['wedding', 'evening'], moods: ['bold', 'warm'], image: 'oud-mystique'
  },
  {
    id: 14, slug: 'green-fig', name: 'Green Fig', gender: 'unisex', collection: 'fresh-citrus', type: 'extrait', family: 'Green',
    topNotes: ['Fig Leaf', 'Bergamot', 'Blackcurrant'], heartNotes: ['Fig Milk', 'Coconut', 'Jasmine'], baseNotes: ['Cedar', 'Musk', 'Sandalwood'],
    keyNotes: ['Fig Leaf', 'Coconut', 'Cedar'], longevity: 8, sillage: 2,
    sizes: [{ ml: 30, price: 2650, originalPrice: null }, { ml: 50, price: 3950, originalPrice: null }, { ml: 100, price: 6450, originalPrice: null }],
    badges: ['new'], rating: 4.6, reviewCount: 29, stock: 38,
    description: 'Crushed fig leaves, milky fig fruit and a whisper of coconut over soft cedar. Shaded, cool and faintly Mediterranean: a garden in the middle of the city.',
    howToWear: 'Spray on the neck and the inside of the elbows. Wears close to the skin and is safe for the office.',
    occasions: ['daily', 'office'], moods: ['fresh', 'soft'], image: 'green-fig'
  },
  {
    id: 15, slug: 'rani-bouquet', name: 'Rani Bouquet', gender: 'women', collection: 'signature', type: 'extrait', family: 'Floral',
    topNotes: ['Raspberry', 'Bergamot', 'Pink Pepper'], heartNotes: ['Rose', 'Peony', 'Lychee'], baseNotes: ['Patchouli', 'Musk', 'Amber'],
    keyNotes: ['Rose', 'Raspberry', 'Patchouli'], longevity: 9, sillage: 3,
    sizes: [{ ml: 30, price: 2650, originalPrice: null }, { ml: 50, price: 3950, originalPrice: 4650 }, { ml: 100, price: 6450, originalPrice: null }],
    badges: ['restocked'], rating: 4.7, reviewCount: 154, stock: 28,
    description: 'A ruby-red bouquet of rose and peony, juicy with raspberry and lychee and grounded by patchouli. Pretty, modern and made for mehndi season.',
    howToWear: 'Spray on wrists, neck and the hem of a dupatta. Two sprays are plenty for a daytime event.',
    occasions: ['wedding', 'daily'], moods: ['soft', 'bold'], image: 'rani-bouquet'
  },
  {
    id: 16, slug: 'leather-saffron', name: 'Leather Saffron', gender: 'men', collection: 'prive', type: 'extrait', family: 'Leather',
    topNotes: ['Saffron', 'Bergamot', 'Thyme'], heartNotes: ['Suede', 'Iris', 'Oud'], baseNotes: ['Leather', 'Amber', 'Vetiver'],
    keyNotes: ['Saffron', 'Suede', 'Leather'], longevity: 14, sillage: 4,
    sizes: [{ ml: 30, price: 3200, originalPrice: null }, { ml: 50, price: 4950, originalPrice: null }, { ml: 100, price: 7950, originalPrice: null }],
    badges: ['bestseller'], rating: 4.8, reviewCount: 119, stock: 16,
    description: 'Saffron laid over supple suede and a trace of oud, drying to a warm, polished leather. The scent of a well-worn jacket and a very good watch.',
    howToWear: 'One spray on the neck and one on the jacket collar. It is strong; let it bloom for fifteen minutes before judging.',
    occasions: ['evening', 'office'], moods: ['bold', 'warm'], image: 'leather-saffron'
  }
];

/* Gift sets / bundles. items reference product ids; price is the set price, compareAt is the
   sum of the pieces bought separately (used for the "Save X%" badge). */
var BUNDLES = [
  { id: 'bundle-discovery', slug: 'discovery-set', name: 'Discovery Set', subtitle: 'Six 10ml travel sprays', items: [1, 3, 5, 12, 16, 2],
    price: 4950, compareAt: 6500, image: 'images/bundle-discovery.svg', stock: 40,
    description: 'Six of our most-loved extraits in 10ml sprays, boxed in black and gold. The right way to find your signature before committing to a full bottle.' },
  { id: 'bundle-oud-trio', slug: 'oud-trio', name: 'The Oud Trio', subtitle: 'Aurum Oud 50ml, Oud Mystique 12ml, Rose Attar Absolue 12ml', items: [1, 13, 6],
    price: 8950, compareAt: 10850, image: 'images/bundle-oud-trio.svg', stock: 12,
    description: 'Three expressions of oud and rose: a smoky extrait and two pure attars. Our most-gifted set for Eid and weddings.' },
  { id: 'bundle-duo', slug: 'his-and-hers-duo', name: 'His & Hers Duo', subtitle: 'Midnight Musk 50ml and Noor 50ml', items: [5, 2],
    price: 6750, compareAt: 7900, image: 'images/bundle-duo.svg', stock: 25,
    description: 'A dark musk for him and a luminous white floral for her, boxed together with a handwritten card. The anniversary gift that gets used every day.' }
];

/* productId must match the product the review talks about. featured reviews appear on the home page carousel. */
var REVIEWS = [
  { productId: 1,  name: 'Hamza R.',   city: 'Karachi',    rating: 5, featured: true,  quote: 'Wore Aurum Oud to my cousin’s valima and three people asked what it was before dinner. Still on my kurta the next morning.' },
  { productId: 12, name: 'Sana M.',    city: 'Lahore',     rating: 5, featured: true,  quote: 'Vanilla Ember is cosy without being sweet. My husband keeps borrowing it, so I bought the 100ml.' },
  { productId: 3,  name: 'Ayesha K.',  city: 'Islamabad',  rating: 5, featured: true,  quote: 'Saffron Royale smells expensive in the best way. The saffron opening is unreal and the amber lasts all day.' },
  { productId: 16, name: 'Bilal A.',   city: 'Rawalpindi', rating: 5, featured: true,  quote: 'Leather Saffron is my office scent now. Smooth suede, never loud, and the 50ml was delivered in two days.' },
  { productId: 2,  name: 'Mahnoor S.', city: 'Karachi',    rating: 5, featured: true,  quote: 'Noor is clean, fresh and so easy to wear. I get compliments at work and it never gives me a headache.' },
  { productId: 8,  name: 'Usman T.',   city: 'Faisalabad', rating: 5, featured: true,  quote: 'Sandal Noir is pure class. Creamy sandalwood with that smoky edge; waiting for the restock to buy a backup.' },
  { productId: 5,  name: 'Taha J.',    city: 'Hyderabad',  rating: 5, featured: false, quote: 'Midnight Musk lasts through a full shift and the drive home. Peppery, dark and exactly as described.' },
  { productId: 13, name: 'Fahad N.',   city: 'Peshawar',   rating: 5, featured: false, quote: 'One drop of Oud Mystique and nothing else is needed. Real oud depth, not the synthetic kind.' },
  { productId: 6,  name: 'Hira B.',    city: 'Multan',     rating: 5, featured: false, quote: 'Rose Attar Absolue is my wedding-season staple. Two roses, no sharpness, and it stays on the dupatta for days.' },
  { productId: 4,  name: 'Zain Q.',    city: 'Karachi',    rating: 4, featured: false, quote: 'Citrus Veil is the freshest thing I own. Perfect for Karachi heat; I just wish the 30ml lasted a little longer.' },
  { productId: 7,  name: 'Rabia F.',   city: 'Sialkot',    rating: 5, featured: false, quote: 'Velvet Amber is warm, cinnamon-sweet and lasts beautifully on a shawl. Already planning the 100ml.' },
  { productId: 10, name: 'Ali H.',     city: 'Gujranwala', rating: 4, featured: false, quote: 'Ocean Marine feels like sea air. Light, salty and clean. Great value for a daily.' },
  { productId: 9,  name: 'Nimra A.',   city: 'Lahore',     rating: 5, featured: false, quote: 'Jasmine Sahar is soft and dewy, exactly what morning jasmine smells like. Lovely for the office.' },
  { productId: 14, name: 'Omar L.',    city: 'Islamabad',  rating: 5, featured: false, quote: 'Green Fig is unusual and cool, like fig leaves after rain. Nobody at my office has anything like it.' },
  { productId: 15, name: 'Sadia R.',   city: 'Karachi',    rating: 5, featured: false, quote: 'Rani Bouquet is juicy and rosy and got me compliments at every mehndi this season.' },
  { productId: 11, name: 'Daniyal M.', city: 'Quetta',     rating: 5, featured: false, quote: 'Smoky Vetiver is dry, grown-up and completely different from the usual sweet stuff. Lasts about ten hours on me.' }
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
