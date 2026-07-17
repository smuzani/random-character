// V7.5 Tier 2: Clothing system (fashion sense → outfit → flair → accessory).
// Reuses rollRules() from appearance-details.js. The fashion layer adds one
// fashion_* tag; the outfit/flair/accessory layers gate on it, so a character's
// wardrobe agrees with itself the same way tags keep personality coherent.
//
// Data ported from the Bolt prototype (data/aspects/{fashion,outfit,flair,
// accessory}.ts) with its gates repaired rather than copied:
//   - Jeans/Athletic now exclude FELEGANT and FQUIRKY (Bolt's miss left an
//     elegant character in jeans 74% of the time).
//   - Every fashion style has at least one non-gendered outfit, so no pool can
//     come up empty (Bolt's modest/girlish pools were female-only).
//   - Casual/classic/modest/tomboy get flair of their own (texture, not color —
//     only Bolt tropes that *name* a color carry a palette seed).
//   - Bolt's "Stylish Hat" required classic AND quirky at once, which one
//     fashion roll can never satisfy: dead entry, split into two.
//
// The fashion_* tag strings deliberately match Bolt's, because the concept
// map in concept-details.js keys off them (fashion_elegant → 'refined', ...).

const FCASUAL = 'fashion_casual';
const FSHARP = 'fashion_sharp';
const FCLASSIC = 'fashion_classic';
const FELEGANT = 'fashion_elegant';
const FTOUGH = 'fashion_tough';
const FQUIRKY = 'fashion_quirky';
const FETHEREAL = 'fashion_ethereal';
const FVILLAINOUS = 'fashion_villainous';
const FTRADITIONAL = 'fashion_traditional';
const FMODEST = 'fashion_modest';
const FTOMBOY = 'fashion_tomboy';
const FGIRLISH = 'fashion_girlish';

// Personality-gated entries roll alongside an ungated base entry (Bolt's
// pattern): a tough character usually dresses tough, anyone occasionally does.
function fashionRules() {
  return [
    { name: 'Casual', weight: 20, adds: [FCASUAL], texts: [`${p.She} prefers comfortable, practical clothing that puts function over form.`] },
    { name: 'Professional', weight: 15, adds: [FSHARP], texts: [`${p.She} gravitates toward neat, business-appropriate attire that projects competence.`] },
    { name: 'Classic', weight: 12, adds: [FCLASSIC], texts: [`${p.She} favors timeless, well-tailored pieces that never go out of style.`] },
    { name: 'Sharp', weight: 8, adds: [FSHARP], texts: [`${p.She} demands perfectly tailored, cutting-edge fashion that commands respect.`] },
    { name: 'Elegant', weight: 6, requires: [TCLASSY], adds: [FELEGANT], texts: [`${p.She} is drawn to sophisticated, refined clothing that speaks of high-class taste.`] },
    { name: 'Elegant', weight: 3, adds: [FELEGANT], texts: [`${p.She} is drawn to sophisticated, refined clothing that speaks of high-class taste.`] },
    { name: 'Tough', weight: 5, requires: [TTOUGH], adds: [FTOUGH], texts: [`${p.She} prefers rugged, intimidating clothing that projects strength and danger.`] },
    { name: 'Tough', weight: 5, requires: [TAGGRESSIVE], adds: [FTOUGH], texts: [`${p.She} prefers rugged, intimidating clothing that projects strength and danger.`] },
    { name: 'Tough', weight: 3, adds: [FTOUGH], texts: [`${p.She} prefers rugged, intimidating clothing that projects strength and danger.`] },
    { name: 'Quirky', weight: 4, adds: [FQUIRKY], texts: [`${p.She} enjoys unconventional, fun clothing that stands out from the crowd.`] },
    { name: 'Ethereal', weight: 5, requires: [TMYSTERIOUS], adds: [FETHEREAL], texts: [`${p.She} is drawn to otherworldly, flowing garments that seem to transcend the mundane.`] },
    { name: 'Ethereal', weight: 3, adds: [FETHEREAL], texts: [`${p.She} is drawn to otherworldly, flowing garments that seem to transcend the mundane.`] },
    { name: 'Villainous', weight: 3, requires: [THEEL], adds: [FVILLAINOUS], texts: [`${p.She} chooses dramatic, imposing clothing that suggests dark intentions.`] },
    { name: 'Traditional', weight: 4, adds: [FTRADITIONAL], texts: [`${p.She} values cultural heritage and classic designs over modern trends.`] },
    { name: 'Modest', weight: 6, requires: [THUMBLE], adds: [FMODEST], texts: [`${p.She} prefers understated, conservative clothing that doesn't draw attention.`] },
    { name: 'Modest', weight: 6, requires: [TMODEST], adds: [FMODEST], texts: [`${p.She} prefers understated, conservative clothing that doesn't draw attention.`] },
    { name: 'Modest', weight: 3, adds: [FMODEST], texts: [`${p.She} prefers understated, conservative clothing that doesn't draw attention.`] },
    { name: 'Tomboy', weight: 5, excludes: [TMALE], adds: [FTOMBOY], texts: [`${p.She} gravitates toward practical, masculine-influenced clothing over feminine frills.`] },
    { name: 'Girlish', weight: 5, excludes: [TMALE], adds: [FGIRLISH], texts: [`${p.She} is drawn to soft, feminine clothing that emphasizes beauty and grace.`] },
  ];
}

// `value` is the outfit's display name — it's promoted into the <summary> line
// of the Style accordion, so it should read well standing alone.
function outfitRules() {
  return [
    // Universal casual pieces. The exclude list is the repair: Bolt forgot
    // FELEGANT (and FQUIRKY), which buried those styles' own outfits.
    { name: 'jeans', value: 'Jeans and a T-Shirt', weight: 15, excludes: [FCLASSIC, FELEGANT, FQUIRKY, FETHEREAL, FGIRLISH, FTOUGH, FVILLAINOUS, FTRADITIONAL, FMODEST, FSHARP, FTOMBOY], texts: [`${p.She} wears comfortable jeans and a simple t-shirt.`] },
    { name: 'athletic', value: 'Athletic Wear', weight: 10, excludes: [FCLASSIC, FELEGANT, FQUIRKY, FETHEREAL, FGIRLISH, FTOUGH, FVILLAINOUS, FTRADITIONAL, FMODEST, FSHARP, FTOMBOY], texts: [`${p.She} dresses in sporty gear made for movement — track pants and an athletic top.`] },
    { name: 'smartcasualmodern', value: 'Smart Casual', weight: 8, requires: [FCASUAL], texts: [`${p.She} wears a step up from casual — nice pants with a decent shirt or sweater, in modern styling.`] },

    // Classic / professional
    { name: 'smartcasualclassic', value: 'Smart Casual', weight: 8, requires: [FCLASSIC], texts: [`${p.She} wears a step up from casual — nice pants with a decent shirt or sweater, in classic styling.`] },
    { name: 'classicsuit', value: 'Classic Business Suit', weight: 8, requires: [FCLASSIC], texts: [`${p.She} wears a professional suit with matching jacket and pants or skirt, in traditional styling.`] },
    { name: 'businesscasual', value: 'Business Casual', weight: 12, requires: [FSHARP], texts: [`${p.She} wears neat slacks paired with a crisp collared shirt or blouse.`] },
    { name: 'sharpsuit', value: 'Sharp Business Suit', weight: 8, requires: [FSHARP], texts: [`${p.She} wears a professional suit with sharp, modern lines.`] },
    { name: 'whitesuit', value: 'White Suit', weight: 2, requires: [FSHARP], texts: [`${p.She} wears an immaculate white suit that makes a bold, dramatic statement.`] },

    // Elegant / formal
    { name: 'gown', value: 'Evening Gown', weight: 4, requires: [TFEMALE, FELEGANT], texts: [`${p.She} wears an elegant, formal gown suited to upscale events.`] },
    { name: 'lbd', value: 'Little Black Dress', weight: 5, requires: [TFEMALE, FELEGANT], texts: [`${p.She} wears the perfect versatile black dress that works for any occasion.`] },
    { name: 'tuxedo', value: 'Tuxedo', weight: 3, requires: [TMALE, FELEGANT], texts: [`${p.She} wears classic formal wear — a black tuxedo with bow tie.`] },
    // Authored: elegant needs a non-gendered outfit or the pool goes empty
    // under "No gender stereotypes".
    { name: 'eveningwear', value: 'Tailored Evening Wear', weight: 4, requires: [FELEGANT], texts: [`${p.She} wears tailored evening wear — silk, clean lines, nothing off the rack.`] },

    // Tough — Bolt's pool was two entries deep; the jacket is authored.
    { name: 'leatherjacket', value: 'Battered Leather Jacket', weight: 6, requires: [FTOUGH], texts: [`${p.She} wears a battered leather jacket that has clearly outlived several owners.`] },
    { name: 'longcoat', value: 'Longcoat', weight: 3, requires: [FTOUGH], texts: [`${p.She} wears a dramatic, flowing coat that billows impressively in the wind.`] },
    { name: 'overalls', value: 'Work Overalls', weight: 3, requires: [FTOUGH], texts: [`${p.She} wears practical work clothes — ${p.she} isn't afraid of manual labor.`] },

    // Villainous — Bolt's pool was one entry deep; the coat is authored.
    { name: 'darkensemble', value: 'Dark Ensemble', weight: 3, requires: [FVILLAINOUS], texts: [`${p.She} wears an all-black outfit with sharp lines and an intimidating silhouette — perfect for making an entrance.`] },
    { name: 'highcollar', value: 'High-Collared Coat', weight: 4, requires: [FVILLAINOUS], texts: [`${p.She} wears a severe, high-collared coat that frames ${p.his} face like a portrait of someone you shouldn't cross.`] },

    // Quirky — the layers are authored.
    { name: 'hawaiian', value: 'Hawaiian Shirt', weight: 3, requires: [FQUIRKY], texts: [`${p.She} wears a loud, colorful shirt that suggests a fun-loving, relaxed personality.`] },
    { name: 'vintagelayers', value: 'Mismatched Vintage Layers', weight: 4, requires: [FQUIRKY], texts: [`${p.She} wears mismatched vintage layers that shouldn't work together and somehow do.`] },

    // Ethereal
    { name: 'flowingdress', value: 'Flowing Dress', weight: 3, requires: [TFEMALE, FETHEREAL], texts: [`${p.She} wears an otherworldly dress that seems to move with unseen breezes.`] },
    { name: 'robes', value: 'Ethereal Robes', weight: 3, requires: [FETHEREAL], texts: [`${p.She} wears flowing, diaphanous robes that shimmer with an otherworldly light.`] },
    { name: 'celestialcloak', value: 'Celestial Cloak', weight: 2, requires: [FETHEREAL], texts: [`${p.She} wears a mysterious cloak that appears to contain the night sky, fabric shifting like starlight.`] },

    // Traditional — the folk garb is authored (Bolt's pool was one kimono).
    { name: 'kimono', value: 'Traditional Kimono', weight: 2, requires: [FTRADITIONAL], texts: [`${p.She} wears a beautiful, traditional kimono that speaks to cultural heritage.`] },
    { name: 'folkgarb', value: 'Embroidered Folk Garb', weight: 4, requires: [FTRADITIONAL], texts: [`${p.She} wears embroidered folk garb, every stitch of it meaningful to somebody.`] },

    // Modest — the plain clothes are authored (Bolt's pool was female-only).
    { name: 'modestdress', value: 'Modest Dress', weight: 4, requires: [TFEMALE, FMODEST], texts: [`${p.She} wears a conservative, understated dress that doesn't draw unwanted attention.`] },
    { name: 'plainclothes', value: 'Plain, Well-Kept Clothes', weight: 5, requires: [FMODEST], texts: [`${p.She} wears plain, well-kept clothes chosen to be forgotten.`] },

    // Tomboy — the cargo pants are authored.
    { name: 'tankshorts', value: 'Tank Top and Shorts', weight: 4, requires: [FTOMBOY], texts: [`${p.She} wears a practical, no-nonsense combination of tank top and shorts.`] },
    { name: 'cargohoodie', value: 'Cargo Pants and a Hoodie', weight: 5, requires: [FTOMBOY], texts: [`${p.She} wears cargo pants and a hoodie with more pockets than secrets.`] },

    // Girlish — the pastels are authored (Bolt's pool was female-only,
    // but the style itself only excludes TMALE).
    { name: 'sundress', value: 'Sundress', weight: 4, requires: [TFEMALE, FGIRLISH], texts: [`${p.She} wears a light, cheerful sundress made for warm weather.`] },
    { name: 'pastels', value: 'Pastels and Soft Fabrics', weight: 4, requires: [FGIRLISH], texts: [`${p.She} wears soft fabrics in pastel colors, chosen with obvious care.`] },
  ];
}

// A color flair carries a palette seed exactly like a hair rule does (hue for
// chromatic, family for achromatic — see appearance-details.js). Clothing seeds
// are never pinned: a Fiery Redhead's hair beats her jacket, but among unpinned
// candidates the jacket gets an equal coin flip. Note 'white' — this is the
// only rule in the game that seeds the white family (skin never does).
// The name is what shows in the Style line; "none" rolls print nothing at all.
function flairRules() {
  return [
    { name: 'none', weight: 30, texts: [] },
    { name: 'White Coloring', weight: 4, requires: [FELEGANT], family: 'white', texts: [`Pristine white elements suggest purity, cleanliness, or dramatic contrast.`] },
    { name: 'Black Styling', weight: 4, requires: [FELEGANT], family: 'black', texts: [`Deep black elements add sophistication and mystery.`] },
    { name: 'Black Styling', weight: 5, requires: [FVILLAINOUS], family: 'black', texts: [`Deep black elements add edge.`] },
    { name: 'Red Accents', weight: 3, requires: [FVILLAINOUS], hue: 0, texts: [`Bold red elements demand attention and suggest passion or danger.`] },
    { name: 'Red Accents', weight: 3, requires: [FSHARP], hue: 0, texts: [`Bold red elements demand attention and suggest passion or danger.`] },
    { name: 'Pink Touches', weight: 3, requires: [FGIRLISH], hue: 330, texts: [`Soft or bold pink elements add feminine charm.`] },
    { name: 'Pink Touches', weight: 3, requires: [FQUIRKY], hue: 330, texts: [`Soft or bold pink elements add unexpected confidence.`] },
    { name: 'Purple Elements', weight: 2, requires: [FELEGANT], hue: 275, texts: [`Rich purple details suggest nobility, creativity, or mystique.`] },
    { name: 'Purple Elements', weight: 2, requires: [FETHEREAL], hue: 275, texts: [`Rich purple details suggest nobility, creativity, or mystique.`] },
    { name: 'Spikes and Studs', weight: 6, requires: [FVILLAINOUS], texts: [`Metal spikes, studs, and other intimidating decorative elements.`] },
    { name: 'Spikes and Studs', weight: 2, requires: [FTOUGH], texts: [`Metal spikes, studs, and other intimidating decorative elements.`] },
    { name: 'Ethereal Shimmer', weight: 2, requires: [FETHEREAL], texts: [`The clothing seems to shimmer and flow with otherworldly energy.`] },
    { name: 'Polka Dots', weight: 2, requires: [FQUIRKY], texts: [`Cheerful polka dot patterns add playfulness and retro charm.`] },
    { name: 'Traditional Patterns', weight: 2, requires: [FTRADITIONAL], texts: [`Classic cultural patterns and designs honor heritage.`] },
    { name: 'Metallic Accents', weight: 2, requires: [FSHARP], texts: [`Subtle metallic elements add luxury and sophistication.`] },
    { name: 'Metallic Accents', weight: 2, requires: [FELEGANT], texts: [`Subtle metallic elements add luxury and sophistication.`] },
    // Authored: Bolt left these four styles (≈47% of rolls) with an empty
    // flair pool — "none" at probability 1. Texture, not color; no seeds.
    { name: 'Well-Worn', weight: 4, requires: [FCASUAL], texts: [`Everything is faded and broken in — clothes worn until they fit like memory.`] },
    { name: 'Impeccably Pressed', weight: 3, requires: [FCLASSIC], texts: [`Every crease is deliberate; the ironing board sees daily use.`] },
    { name: 'Mended by Hand', weight: 3, requires: [FMODEST], texts: [`Small, careful repairs everywhere — nothing gets thrown away that can be saved.`] },
    { name: 'Scuffed and Practical', weight: 3, requires: [FTOMBOY], texts: [`Scuffs and frayed hems from actual use, worn without a hint of apology.`] },
  ];
}

function accessoryRules() {
  return [
    { name: 'none', weight: 25, texts: [] },
    { name: 'Regular Glasses', weight: 6, texts: [`${p.She} wears simple, practical eyeglasses that suggest thoughtfulness.`] },
    { name: 'Thick Nerd Glasses', weight: 3, requires: [TNERD], texts: [`${p.She} wears notably thick glasses that immediately mark ${p.him} as a nerd.`] },
    { name: 'Stylish Sunglasses', weight: 6, excludes: [FMODEST, FGIRLISH], texts: [`${p.She} wears cool, mysterious sunglasses — even indoors, for maximum effect.`] },
    { name: 'Mysterious Mask', weight: 4, requires: [FVILLAINOUS], texts: [`${p.She} wears a partial face mask that conceals identity and adds intrigue.`] },
    { name: 'Mysterious Mask', weight: 1, excludes: [FMODEST, FGIRLISH, FVILLAINOUS], texts: [`${p.She} wears a partial face mask that conceals identity and adds intrigue.`] },
    { name: 'Practical Bandana', weight: 2, requires: [FCASUAL], texts: [`${p.She} wears a simple bandana, for protection or as a casual style statement.`] },
    { name: 'Practical Bandana', weight: 2, requires: [FTOUGH], texts: [`${p.She} wears a simple bandana, for protection or as a casual style statement.`] },
    { name: 'Elegant Monocle', weight: 1, requires: [FELEGANT], texts: [`${p.She} wears a monocle that immediately marks ${p.him} as aristocratic.`] },
    { name: 'Elegant Gloves', weight: 2, requires: [FELEGANT], texts: [`${p.She} wears refined gloves that suggest high-class sophistication.`] },
    { name: 'Luxury Watch', weight: 2, requires: [FSHARP], excludes: [TPOOR], texts: [`${p.She} wears an expensive, precision timepiece that announces wealth and status.`] },
    // Bolt required classic AND quirky at once — impossible after a single
    // fashion roll, so the hat never appeared. Split into one entry per style.
    { name: 'Stylish Hat', weight: 3, requires: [FCLASSIC], texts: [`${p.She} wears a fashionable hat that completes the look.`] },
    { name: 'Stylish Hat', weight: 3, requires: [FQUIRKY], texts: [`${p.She} wears a fashionable hat that completes the look.`] },
    { name: 'Statement Earrings', weight: 3, requires: [FQUIRKY], texts: [`${p.She} wears bold, eye-catching earrings that add personality.`] },
    { name: 'Traditional Headpiece', weight: 2, requires: [FTRADITIONAL], texts: [`${p.She} wears cultural headwear that honors heritage and tradition.`] },
    { name: 'Delicate Jewelry', weight: 3, requires: [FGIRLISH], texts: [`${p.She} wears simple, pretty jewelry that adds a feminine touch without being ostentatious.`] },
    { name: 'Simple Religious Necklace', weight: 2, requires: [FMODEST], texts: [`${p.She} wears a modest religious necklace that speaks to faith and humility.`] },
    { name: 'Sports Wristband', weight: 2, requires: [FTOMBOY], texts: [`${p.She} wears a practical athletic wristband — active, no-nonsense.`] },
    { name: 'Flowing Scarf', weight: 2, requires: [FETHEREAL], texts: [`${p.She} wears a lightweight scarf that seems to move with otherworldly grace.`] },
  ];
}

// Rolls the full wardrobe and returns:
//   outfit:  'Sharp Business Suit' | null   — promoted into the <summary> line
//   lines:   [sentence, ...]                — fashion/outfit/flair/accessory prose
//   seedCandidates: [{seed, pinned:false}]  — color flairs, for pickSeed()
//   tags:    Set                            — charTags + fashion_* adds, for the
//                                             concept generator downstream
// "None" rolls for flair/accessory contribute no line: absence stays silent.
function rollClothing(charTags) {
  const tags = new Set(charTags);
  const lines = [];
  const seedCandidates = [];
  let outfit = null;

  const layers = [
    { rules: fashionRules() },
    { rules: outfitRules(), isOutfit: true },
    { rules: flairRules(), color: true },
    { rules: accessoryRules() },
  ];
  layers.forEach(function (layer) {
    const r = rollRules(layer.rules, tags);
    if (!r) return;
    (r.adds || []).forEach(t => tags.add(t));
    if (layer.isOutfit) outfit = r.value;
    if (layer.color) {
      const seed = ruleSeed(r);
      if (seed) seedCandidates.push({ seed: seed, pinned: false });
    }
    if (r.texts.length) lines.push(randomArray(r.texts));
  });
  return { outfit: outfit, lines: lines, seedCandidates: seedCandidates, tags: tags };
}
