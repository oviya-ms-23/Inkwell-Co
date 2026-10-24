/**
 * Inkwell & Co. - Product Catalog Data
 * Contains 18 curated items across 8 categories
 */

const PRODUCTS = [
  {
    id: "fic-1",
    name: "The Midnight Library of Alexandria",
    category: "Fiction books",
    price: 18.99,
    originalPrice: 24.99,
    rating: 4.9,
    reviewCount: 142,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80",
    description: "An enchanting tale of forgotten scrolls, time-woven stories, and a magical subterranean library guarded by enigmatic scholars in ancient Egypt.",
    details: {
      author: "Eleanor Vance",
      pages: "384 pages",
      publisher: "Mythos & Quill Press",
      format: "Hardcover with gold-foil dust jacket",
      isbn: "978-0-123456-78-9"
    }
  },
  {
    id: "fic-2",
    name: "Chronicles of the Starlit Valley",
    category: "Fiction books",
    price: 16.50,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 89,
    badge: "New",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
    description: "A sweeping cozy fantasy about a wandering constellation cartographer who stumbles upon a hidden village tucked between twilight mountain ridges.",
    details: {
      author: "Julian K. Thorne",
      pages: "412 pages",
      publisher: "Starlight House",
      format: "Paperback with deckled edges",
      isbn: "978-0-987654-32-1"
    }
  },
  {
    id: "nonfic-1",
    name: "The Mindful Botanist",
    category: "Non-Fiction books",
    price: 22.00,
    originalPrice: 28.00,
    rating: 4.7,
    reviewCount: 64,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=700&q=80",
    description: "A beautifully illustrated guide to discovering wonder, mindfulness, and inner calm through the secrets of plant ecology and wildflower foraging.",
    details: {
      author: "Dr. Maya Lin-Davies",
      pages: "296 pages (Full color illustrations)",
      publisher: "Arbor Vitae Publishing",
      format: "Clothbound Hardcover",
      isbn: "978-1-555555-11-2"
    }
  },
  {
    id: "nonfic-2",
    name: "Quiet Mornings: The Art of Slow Living",
    category: "Non-Fiction books",
    price: 19.95,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 110,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=700&q=80",
    description: "Essays and practical morning rituals for cultivating deliberate stillness, tactile hobbies, and peaceful routines in an over-connected digital world.",
    details: {
      author: "Søren Lindqvist",
      pages: "240 pages",
      publisher: "Nordic Hearth Editions",
      format: "Hardcover with ribbon bookmark",
      isbn: "978-1-444444-22-3"
    }
  },
  {
    id: "child-1",
    name: "The Little Fox Who Loved Tea",
    category: "Children's books",
    price: 14.50,
    originalPrice: null,
    rating: 5.0,
    reviewCount: 95,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=700&q=80",
    description: "Join Pip the curious red fox as he wanders deep into Brambleberry Wood to host the coziest afternoon tea party for hedgehog and badger friends.",
    details: {
      author: "Clara Bell & Arthur Finch",
      pages: "48 pages (Ages 3–8)",
      publisher: "Acorn Pip Books",
      format: "Oversized Matte Hardcover",
      isbn: "978-0-777777-33-4"
    }
  },
  {
    id: "child-2",
    name: "Luna and the Cloud Dragon",
    category: "Children's books",
    price: 15.00,
    originalPrice: 18.50,
    rating: 4.8,
    reviewCount: 42,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=700&q=80",
    description: "A whimsical bedtime picture book filled with soft watercolor dreamscapes about friendship, courage, and catching shooting stars from clouds.",
    details: {
      author: "Hannah Song",
      pages: "40 pages (Ages 4–9)",
      publisher: "Moonbeam Studio",
      format: "Padded Hardcover with silver foil",
      isbn: "978-0-888888-44-5"
    }
  },
  {
    id: "nb-1",
    name: "Botanical Hardcover Dot Grid Journal",
    category: "Notebooks",
    price: 18.50,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 230,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80",
    description: "Premium 160gsm bleed-proof bamboo paper notebook featuring subtle 5mm dot grid, dual silk ribbons, an elastic band, and an expanding back pocket.",
    details: {
      size: "A5 (5.8 x 8.3 in)",
      pages: "192 numbered pages",
      paper: "160 GSM fountain-pen friendly bamboo paper",
      features: "Gold foil stamped linen cover, lay-flat 180° binding"
    }
  },
  {
    id: "nb-2",
    name: "Vintage Linen Bound Sketchbook",
    category: "Notebooks",
    price: 21.00,
    originalPrice: 26.00,
    rating: 4.8,
    reviewCount: 76,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=700&q=80",
    description: "Heavyweight 200gsm cold-pressed cotton paper tailored for gouache, watercolor washes, ink sketching, and charcoal drawings.",
    details: {
      size: "Square 7.5 x 7.5 in",
      pages: "120 pages",
      paper: "200 GSM cold-press cotton blend",
      features: "Natural flax linen spine, deckled edge endsheets"
    }
  },
  {
    id: "nb-3",
    name: "Pocket Kraft Notebook Trio",
    category: "Notebooks",
    price: 11.50,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 54,
    badge: "New",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80",
    description: "Set of three pocket-friendly recycled kraft journals (ruled, dotted, and blank) with copper stitched binding designed for quick thoughts on the go.",
    details: {
      size: "Pocket (3.5 x 5.5 in)",
      pages: "64 pages each (3 pack)",
      paper: "100 GSM recycled wood-free paper",
      features: "Rounded corners, thread-stitched spine"
    }
  },
  {
    id: "pen-1",
    name: "Retro Brass Fountain Pen",
    category: "Pens",
    price: 28.00,
    originalPrice: 34.00,
    rating: 4.9,
    reviewCount: 188,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=700&q=80",
    description: "Solid raw brass hexagonal barrel that patinas uniquely with your touch. Equipped with a stainless steel German iridium fine nib and screw-in converter.",
    details: {
      nib: "Fine (0.5mm) stainless steel nib",
      material: "Solid machined raw brass",
      fillingSystem: "Standard international cartridge / converter included",
      weight: "42g balanced feel"
    }
  },
  {
    id: "pen-2",
    name: "Pastel Gel Ink Pens (Set of 6)",
    category: "Pens",
    price: 12.99,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 135,
    badge: "New",
    image: "https://images.unsplash.com/photo-1585336261026-41ff34e007d4?auto=format&fit=crop&w=700&q=80",
    description: "Silky smooth 0.5mm quick-dry gel ink in six charming muted shades: Sage, Lavender, Peach, Dusty Rose, Buttercup, and Slate.",
    details: {
      pointSize: "0.5mm extra-smooth rollerball",
      ink: "Water-resistant, non-smudge pigment gel",
      grip: "Soft-touch matte silicone barrel",
      colors: "6 curated pastel hues"
    }
  },
  {
    id: "pen-3",
    name: "Dual-Tip Calligraphy Brush Pen",
    category: "Pens",
    price: 8.50,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 67,
    badge: null,
    image: "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=700&q=80",
    description: "Features a flexible nylon brush tip for expressive modern hand-lettering on one end and a durable 0.8mm bullet nib for fine detailing on the other.",
    details: {
      tips: "Flexible Japanese brush + 0.8mm fine bullet tip",
      ink: "Archival black carbon pigment",
      features: "Odorless, water-based, blendable"
    }
  },
  {
    id: "washi-1",
    name: "Cherry Blossom Foil Washi Tape Set",
    category: "Washi tape",
    price: 9.99,
    originalPrice: 14.00,
    rating: 4.9,
    reviewCount: 156,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=700&q=80",
    description: "Boxed collection of four rolls of Japanese washi paper tape highlighted with rose gold and copper foil accents depicting blooming sakura petals.",
    details: {
      quantity: "4 rolls (15mm x 2 rolls, 20mm x 1 roll, 30mm x 1 roll)",
      length: "10 meters per roll",
      material: "Genuine Japanese washi paper",
      features: "Removable, residue-free, tearable by hand"
    }
  },
  {
    id: "washi-2",
    name: "Vintage Celestial & Constellation Tape",
    category: "Washi tape",
    price: 8.50,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 82,
    badge: "New",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=700&q=80",
    description: "Deep midnight indigo tape adorned with gleaming holographic stars, antique moon phases, and astrolabe illustrations for mystical journals.",
    details: {
      quantity: "3 rolls (15mm width)",
      length: "10 meters each roll",
      material: "Japanese washi paper with holographic foil",
      features: "Sticks easily to paper, glass, plastic"
    }
  },
  {
    id: "plan-1",
    name: "Undated Weekly Cozy Life Planner",
    category: "Planners",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.9,
    reviewCount: 210,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=700&q=80",
    description: "Start anytime! A joyful 52-week un-dated planner with weekly goal spreads, habit trackers, cozy prompts, and plenty of space for doodles.",
    details: {
      size: "B5 (7 x 9.8 in)",
      duration: "12 months (52 weeks undated)",
      paper: "140 GSM ivory smooth paper",
      includes: "3 sticker sheets, gold foil corners, pocket"
    }
  },
  {
    id: "plan-2",
    name: "Daily Gratitude & Mindfulness Journal",
    category: "Planners",
    price: 17.50,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 94,
    badge: "New",
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=700&q=80",
    description: "A calming morning-and-evening 5-minute journal designed with encouraging reflections, daily gratitudes, and gentle mindfulness check-ins.",
    details: {
      size: "Compact A5",
      duration: "6 months of guided daily practice",
      binding: "Soft-touch vegan leather hardcover",
      features: "Ribbon bookmark, daily positive quotes"
    }
  },
  {
    id: "stk-1",
    name: "Cozy Coffee & Bookish Sticker Sheet Set",
    category: "Stickers",
    price: 6.50,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 178,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1572944608496-51f450818a69?auto=format&fit=crop&w=700&q=80",
    description: "Set of 4 matte vinyl sticker sheets packed with steaming teacups, towering book stacks, cat naps, and literary puns.",
    details: {
      quantity: "4 kiss-cut sticker sheets (over 80 stickers total)",
      finish: "Velvety matte vinyl finish",
      durability: "Waterproof, UV-resistant, scratch-proof",
      sheetSize: "4 x 6 inches"
    }
  },
  {
    id: "stk-2",
    name: "Woodland Forest Flora & Fauna Stickers",
    category: "Stickers",
    price: 5.99,
    originalPrice: 8.00,
    rating: 4.7,
    reviewCount: 88,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=700&q=80",
    description: "Illustrated whimsical forest creatures: hedgehogs, acorns, mossy mushrooms, ferns, and barn owls painted in warm earthy autumn tones.",
    details: {
      quantity: "3 kiss-cut sheets (65 stickers)",
      finish: "Translucent washi sticker paper",
      features: "Perfect for planner borders and card making",
      sheetSize: "3.8 x 5.8 inches"
    }
  }
];

// Helper functions for products
function getAllProducts() {
  return PRODUCTS;
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getCategories() {
  return [...new Set(PRODUCTS.map(p => p.category))];
}

function getBestsellers(limit = 8) {
  return PRODUCTS.filter(p => p.badge === "Bestseller").concat(
    PRODUCTS.filter(p => p.badge !== "Bestseller")
  ).slice(0, limit);
}

function getRelatedProducts(currentId, limit = 4) {
  const current = getProductById(currentId);
  if (!current) return PRODUCTS.slice(0, limit);
  const sameCategory = PRODUCTS.filter(p => p.category === current.category && p.id !== currentId);
  const otherCategory = PRODUCTS.filter(p => p.category !== current.category && p.id !== currentId);
  return [...sameCategory, ...otherCategory].slice(0, limit);
}
