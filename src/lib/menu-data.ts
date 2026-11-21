// Menu seed. No prices are shown on the site: customers ask for prices on WhatsApp.
// Edit here and bump SCHEMA_VERSION in db.ts to re-seed (orders and reservations are kept).
export type MenuSeed = {
  slug: string;
  name: string;
  category: "bottle" | "drinks" | "kitchen";
  sub: string;
  desc: string;
  image: string | null;
  tag: string | null;
};

const M = "/images/bottles/";

export const CATEGORIES = [
  { id: "bottle", label: "Bottle Service" },
  { id: "drinks", label: "Cocktails & Drinks" },
  { id: "kitchen", label: "Kitchen & Bites" },
] as const;

export const MENU: MenuSeed[] = [
  // Bottle service
  { slug: "martell-blue-swift", name: "Martell Blue Swift 70cl", category: "bottle", sub: "Cognac", desc: "VSOP cognac finished in bourbon casks. Smooth, warm and the NOMAD favourite.", image: `${M}martell-blue-swift.png`, tag: "House favourite" },
  { slug: "martell-vs", name: "Martell VS 70cl", category: "bottle", sub: "Cognac", desc: "Fine cognac with fresh fruity notes. Perfect for sharing at the table.", image: `${M}martell-vs.png`, tag: null },
  { slug: "martell-vsop", name: "Martell VSOP 70cl", category: "bottle", sub: "Cognac", desc: "Aged in red-barrel oak for a rounder, richer finish.", image: `${M}martell-vsop.png`, tag: null },
  { slug: "martell-xo", name: "Martell XO 70cl", category: "bottle", sub: "Cognac", desc: "Extra old cognac with deep dried-fruit and spice. Made for big nights.", image: `${M}martell-xo.png`, tag: "Premium" },
  { slug: "hennessy-vs-70", name: "Hennessy VS 70cl", category: "bottle", sub: "Cognac", desc: "The classic Very Special cognac, served with mixers and ice.", image: `${M}hennessy-vs.png`, tag: null },
  { slug: "hennessy-vs-1l", name: "Hennessy VS 1L", category: "bottle", sub: "Cognac", desc: "The big bottle for a big table.", image: `${M}hennessy-vs-1l.png`, tag: "Big bottle" },
  { slug: "don-julio-reposado", name: "Don Julio Reposado 70cl", category: "bottle", sub: "Tequila", desc: "100% blue agave tequila rested in oak. Sip it or shoot it.", image: `${M}don-julio-reposado.png`, tag: null },
  { slug: "don-julio-1942", name: "Don Julio 1942 70cl", category: "bottle", sub: "Tequila", desc: "Ultra-premium anejo tequila in its signature gift box.", image: `${M}don-julio-1942.png`, tag: "Top shelf" },
  { slug: "jw-red-label", name: "Johnnie Walker Red Label 70cl", category: "bottle", sub: "Whisky", desc: "Bold blended Scotch whisky. A table favourite with cola or soda.", image: `${M}johnnie-walker-red.png`, tag: null },
  { slug: "jw-double-black", name: "Johnnie Walker Double Black 70cl", category: "bottle", sub: "Whisky", desc: "Intense, smoky blended Scotch whisky.", image: `${M}johnnie-walker-double-black.png`, tag: null },
  { slug: "prosecco-extra-dry", name: "Prosecco Extra Dry 75cl", category: "bottle", sub: "Bubbly", desc: "Crisp Italian sparkling wine for toasts and birthdays.", image: `${M}prosecco.png`, tag: "Celebrate" },
  { slug: "luc-belaire-luxe", name: "Luc Belaire Luxe", category: "bottle", sub: "Bubbly", desc: "French sparkling wine in the white and gold bottle. The party-table classic.", image: `${M}luc-belaire-luxe.png`, tag: "Celebrate" },
  { slug: "luc-belaire-rose-alcohol-removed", name: "Luc Belaire Rare Rosé (Alcohol-Removed)", category: "bottle", sub: "Bubbly", desc: "Sparkling rosé with the alcohol removed, in the signature black bottle. Same toast, no alcohol.", image: `${M}luc-belaire-rose-alcohol-removed.png`, tag: null },
  { slug: "luc-belaire-collection", name: "Luc Belaire Collection", category: "bottle", sub: "Bubbly", desc: "Gold, Rosé, Luxe Rosé, Luxe and Bleu. Ask us which colours are available tonight.", image: `${M}luc-belaire-collection.png`, tag: "Pick your colour" },
  { slug: "clase-azul-reposado", name: "Clase Azul Reposado", category: "bottle", sub: "Tequila", desc: "Ultra-premium reposado tequila in the hand-painted ceramic decanter.", image: `${M}clase-azul-reposado.png`, tag: "Top shelf" },
  // Cocktails & drinks
  { slug: "blue-swift-tonic", name: "Blue Swift & Tonic", category: "drinks", sub: "Cocktails", desc: "Martell Blue Swift, tonic, citrus and ice. Light, long and dangerous.", image: null, tag: "Signature" },
  { slug: "don-julio-paloma", name: "Don Julio Paloma", category: "drinks", sub: "Cocktails", desc: "Don Julio Reposado, grapefruit, lime and a salted rim.", image: null, tag: null },
  { slug: "mojito", name: "Classic Mojito", category: "drinks", sub: "Cocktails", desc: "White rum, fresh mint, lime and soda.", image: null, tag: null },
  { slug: "margarita", name: "Margarita", category: "drinks", sub: "Cocktails", desc: "Tequila, triple sec and lime with a salted rim.", image: null, tag: null },
  { slug: "long-island", name: "Long Island Iced Tea", category: "drinks", sub: "Cocktails", desc: "Five spirits, lemon and cola. Strong and smooth.", image: null, tag: null },
  { slug: "espresso-martini", name: "Espresso Martini", category: "drinks", sub: "Cocktails", desc: "Vodka, coffee liqueur and fresh espresso. Keeps the night going.", image: null, tag: null },
  { slug: "old-fashioned", name: "Old Fashioned", category: "drinks", sub: "Cocktails", desc: "Whisky, bitters, sugar and orange peel.", image: null, tag: null },
  { slug: "virgin-mojito", name: "Virgin Mojito", category: "drinks", sub: "Mocktails", desc: "Fresh mint, lime and soda. No alcohol.", image: null, tag: null },
  { slug: "shot-don-julio", name: "Don Julio Reposado Shot", category: "drinks", sub: "Shots", desc: "A single shot, served with salt and lime.", image: null, tag: null },
  { slug: "shot-martell-vs", name: "Martell VS Shot", category: "drinks", sub: "Shots", desc: "A single shot of Martell VS.", image: null, tag: null },
  { slug: "shot-jw-red", name: "Johnnie Walker Red Shot", category: "drinks", sub: "Shots", desc: "A single shot of Johnnie Walker Red Label.", image: null, tag: null },
  { slug: "nile-special", name: "Nile Special", category: "drinks", sub: "Beer & Soft", desc: "Uganda's own lager, served ice cold.", image: null, tag: null },
  { slug: "club-pilsner", name: "Club Pilsner", category: "drinks", sub: "Beer & Soft", desc: "Crisp Ugandan pilsner, served ice cold.", image: null, tag: null },
  { slug: "heineken", name: "Heineken", category: "drinks", sub: "Beer & Soft", desc: "Premium lager, ice cold.", image: null, tag: null },
  { slug: "guinness", name: "Guinness", category: "drinks", sub: "Beer & Soft", desc: "The dark classic, smooth and creamy.", image: null, tag: null },
  { slug: "red-bull", name: "Red Bull", category: "drinks", sub: "Beer & Soft", desc: "Energy drink to mix or sip.", image: null, tag: null },
  { slug: "soda-water", name: "Soda or Water", category: "drinks", sub: "Beer & Soft", desc: "Assorted sodas and bottled water for your mixers.", image: null, tag: null },
  // Kitchen & bites
  { slug: "pizza-beef", name: "Beef & Pepper Pizza", category: "kitchen", sub: "Pizza", desc: "Stone-baked with minced beef, peppers and melted cheese. Made to share.", image: "/images/20-pizza-01.jpg", tag: "Popular" },
  { slug: "pizza-chicken", name: "Chicken Pizza", category: "kitchen", sub: "Pizza", desc: "Spiced chicken, green and red peppers and bubbling cheese.", image: "/images/21-pizza-02.jpg", tag: null },
  { slug: "chicken-wings", name: "Chicken Wings (8 pcs)", category: "kitchen", sub: "Bites", desc: "Crispy wings tossed in your choice of hot, BBQ or garlic.", image: null, tag: null },
  { slug: "beef-samosas", name: "Beef Samosas (6 pcs)", category: "kitchen", sub: "Bites", desc: "Golden, crunchy and served with chilli sauce.", image: null, tag: null },
  { slug: "muchomo", name: "Beef Muchomo Skewers", category: "kitchen", sub: "Bites", desc: "Grilled Kampala-style beef skewers with kachumbari.", image: null, tag: "Local favourite" },
  { slug: "fish-fingers", name: "Fish Fingers & Chips", category: "kitchen", sub: "Bites", desc: "Crumbed fish fingers with chips and tartar sauce.", image: null, tag: null },
  { slug: "chips-kachumbari", name: "Chips & Kachumbari", category: "kitchen", sub: "Sides", desc: "Hot crispy chips with fresh tomato and onion salad.", image: null, tag: null },
  { slug: "nachos", name: "Loaded Nachos", category: "kitchen", sub: "Sides", desc: "Tortilla chips, melted cheese, salsa and jalapenos.", image: null, tag: null },
  { slug: "chicken-tikka", name: "Chicken Tikka", category: "kitchen", sub: "Bites", desc: "Spiced and grilled chicken pieces with mint chutney.", image: null, tag: null },
  { slug: "mixed-grill", name: "Mixed Grill Platter", category: "kitchen", sub: "Sharing", desc: "Beef, chicken and sausages with chips and salad. Feeds the table.", image: null, tag: "Sharing" },
];
