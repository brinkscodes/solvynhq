import type { SeoResearch } from "@/lib/seo-types";

export const seoResearch: SeoResearch = {
  lastUpdated: "2026-02-28",

  // ─────────────────────────────────────────────
  // COMPETITORS (Cross-referenced: SERP analysis + Ahrefs + manual research)
  // ─────────────────────────────────────────────
  competitors: [
    // ── B2B HOSPITALITY ──
    {
      id: "sunkiss",
      name: "SunKiss (SunKissMe)",
      url: "https://sunkissme.com",
      type: "both",
      description:
        "UAE-based eco-friendly suncare brand — the most direct competitor to Solvyn's B2B hospitality concept. Trusted by 23+ leading hotels. Offers mineral sunscreens, refillable pool/beachside dispensers (Waterside range), and the 'Sunbutler' service.",
      targetKeywords: [
        "natural sunscreen",
        "eco friendly sun cream",
        "luxury hotel amenities",
        "hotel amenities Dubai",
        "reef safe sunscreen",
        "hotel sunscreen amenities",
      ],
      contentAngles: [
        "Eco-friendly suncare for 5-star hotels",
        "Refillable dispensers reducing plastic by 90%",
        "CSR initiative positioning for hotels",
        "Reef-friendly, oxybenzone-free formulations",
      ],
      strengths: [
        "Only dedicated sunscreen brand with explicit B2B hotel positioning",
        "Refillable dispenser system purpose-built for pools and beaches",
        "23+ luxury hotel partnerships as proof points",
        "175% sales increase from hoteliers",
      ],
      weaknesses: [
        "Heavily Middle East/UAE focused — limited Western presence",
        "Small company with limited scale",
        "No mineral-specific messaging (doesn't lead with zinc oxide)",
        "Brand name lacks luxury gravitas",
        "No content marketing or educational hub",
      ],
    },
    {
      id: "goodspread",
      name: "Goodspread",
      url: "https://goodspreadsunscreen.com",
      type: "both",
      description:
        "Single-use sunscreen brand with Hawaii Act 104 compliance page. Format is very similar to Solvyn's. Early stage with very low domain authority (DR 15-20). Closest direct competitor to Solvyn's product format.",
      targetKeywords: [
        "single use sunscreen",
        "sunscreen packets",
        "reef safe sunscreen",
        "hawaii act 104 sunscreen",
      ],
      contentAngles: [
        "Single-use format convenience",
        "Hawaii Act 104 compliance",
        "Basic product pages",
      ],
      strengths: [
        "Single-use format directly comparable to Solvyn",
        "Hawaii Act 104 compliance content already published",
        "First mover in some single-use search terms",
      ],
      weaknesses: [
        "Very low domain authority (DR 15-20, est. 1K-5K organic traffic)",
        "Early stage with minimal content",
        "No luxury or premium positioning",
        "No B2B hospitality strategy",
        "No dermatologist backing",
      ],
    },
    {
      id: "hunter",
      name: "Hunter Amenities International",
      url: "https://www.hunteramenities.com",
      type: "b2b",
      description:
        "One of the world's largest hotel amenity manufacturers (est. 1981), serving Westin, Fairmont, Radisson, Hyatt, St. Regis across 100+ countries. 45+ licensed brands. Does NOT currently offer sunscreen — focused on bath & body amenities.",
      targetKeywords: [
        "hotel amenities",
        "guest amenities",
        "luxury hotel amenities",
        "amenity supplier",
        "hospitality amenities",
      ],
      contentAngles: [
        "45 years of trusted partnership",
        "Global manufacturing expertise and certifications",
        "Luxury brand licensing (45+ brands)",
        "Sustainability and responsible sourcing",
      ],
      strengths: [
        "Massive scale and global distribution (100+ countries)",
        "Deep relationships with major hotel chains",
        "ISO 9001 and ISO 22716 certified",
        "Owns Pharmacopia brand (natural/organic niche)",
      ],
      weaknesses: [
        "No sunscreen/SPF in product portfolio — clear gap",
        "Generic B2B messaging, no brand storytelling",
        "No reef-safe or environmental sun care positioning",
        "Corporate identity, not aspirational",
      ],
    },
    {
      id: "gilchrist",
      name: "Gilchrist & Soames",
      url: "https://hoteliers.gilchristsoames.com",
      type: "b2b",
      description:
        "Luxury hotel toiletry brand with English heritage. Owned by Sysco's Guest Supply. Multiple collections (English Spa, Zero%, Skin Essentials). Does NOT offer sunscreen or SPF products.",
      targetKeywords: [
        "luxury hotel amenities",
        "hotel toiletries",
        "clean beauty hotel amenities",
        "English spa amenities",
      ],
      contentAngles: [
        "'Quiet luxury' — elevating everyday routines",
        "English heritage and refinement",
        "Clean ingredients (Zero% line: no sulfates, parabens, phthalates)",
      ],
      strengths: [
        "Strong luxury hotel penetration globally",
        "Owned by Sysco/Guest Supply (massive distribution)",
        "Multiple collection tiers for different price points",
        "Established brand in upscale hospitality",
      ],
      weaknesses: [
        "No sunscreen or SPF products at all",
        "English branding limits tropical/beach resort appeal",
        "Corporate parent reduces boutique authenticity",
        "Minimal content or SEO depth",
      ],
    },
    {
      id: "ada",
      name: "ADA Cosmetics",
      url: "https://ada-cosmetics.com",
      type: "b2b",
      description:
        "Europe's leading hotel cosmetics manufacturer. 40+ years, 30,000+ customers in 50+ countries. First and only hotel cosmetics manufacturer with entire range Cradle to Cradle Certified Silver. Partners with Balmain, Lalique, Chopard, ELEMIS, Asprey. Does NOT offer sunscreen.",
      targetKeywords: [
        "hotel cosmetics",
        "sustainable hotel amenities",
        "hotel dispenser systems",
        "Cradle to Cradle hotel amenities",
        "luxury hotel brands",
      ],
      contentAngles: [
        "'Redefining Responsibility' — sustainability as core identity",
        "Cradle to Cradle certification (unique in industry)",
        "Ultra-hygienic dispenser innovation",
        "'House of Brands' approach with 4 tiers",
      ],
      strengths: [
        "Cradle to Cradle certified — strongest sustainability credential",
        "Premium brand partnerships (Chopard, Balmain, Lalique)",
        "30,000+ customer base globally",
        "Own manufacturing in Europe and APAC",
      ],
      weaknesses: [
        "No sunscreen or SPF products whatsoever",
        "European-centric — less US/Caribbean resort penetration",
        "No reef-safe or ocean-protection narrative",
        "B2B-heavy website, minimal storytelling",
      ],
    },
    {
      id: "snappyscreen",
      name: "Snap Wellness (SnappyScreen)",
      url: "https://snapwellness.com",
      type: "b2b",
      description:
        "Touchless sunscreen application booth — head-to-toe coverage in 10 seconds. Hotels with SnappyScreen see $26 more/person/day in poolside F&B. Four Seasons Dallas saw $170K year-over-year F&B boost.",
      targetKeywords: [
        "sunscreen booth",
        "touchless sunscreen",
        "hotel pool sunscreen",
        "sunscreen dispenser luxury hotel",
      ],
      contentAngles: [
        "Revenue generation for hotels (quantified ROI)",
        "Guest experience innovation",
        "Skin cancer prevention mission",
        "Luxury resort partnerships",
      ],
      strengths: [
        "Unique product category — no direct booth competitors",
        "Quantified ROI ($170K uplift, $26/person/day)",
        "Four Seasons, Rosewood, Marriott partnerships",
        "PR-worthy and Instagram-worthy",
      ],
      weaknesses: [
        "Hardware-dependent — high upfront cost for hotels",
        "Not a sunscreen brand per se — it's a device",
        "Chemical sunscreen formulation (not mineral)",
        "Does not address in-room or portable needs",
      ],
    },
    {
      id: "pineapple",
      name: "Pineapple Hospitality",
      url: "https://pineapplehospitality.com",
      type: "b2b",
      description:
        "Established hotel amenities supplier distributing Beekman 1802 and other brands. General amenity catalog-style business. DR 35-40, est. 10K-30K organic traffic/mo. No dedicated sunscreen focus.",
      targetKeywords: [
        "hotel amenities",
        "hotel toiletries supplier",
        "eco-friendly hotel amenities",
        "Beekman 1802 hotel amenities",
      ],
      contentAngles: [
        "Product catalog for hotel buyers",
        "Brand partnership distribution",
        "Eco-friendly amenity options",
      ],
      strengths: [
        "Established hotel amenities distribution network",
        "Beekman 1802 brand partnership",
        "Existing relationships with hotel procurement",
      ],
      weaknesses: [
        "No dedicated sunscreen focus — sunscreen is tiny part of catalog",
        "Product catalog-style pages, limited content marketing",
        "No mineral or reef-safe expertise",
        "General supplier — not a specialist",
      ],
    },
    {
      id: "zogics",
      name: "Zogics",
      url: "https://zogics.com",
      type: "b2b",
      description:
        "Broad hotel amenity and facility supplier with wholesale focus. DR 45-50, est. 30K-60K organic traffic/mo. Sunscreen is a tiny part of their massive catalog. Basic SEO with e-commerce catalog approach.",
      targetKeywords: [
        "hotel amenity supplier",
        "wholesale hotel supplies",
        "facility sunscreen",
        "bulk hotel amenities",
      ],
      contentAngles: [
        "E-commerce catalog for bulk buyers",
        "Broad facility supplies range",
        "Wholesale pricing",
      ],
      strengths: [
        "Higher domain authority (DR 45-50) than most B2B competitors",
        "Broad product range attracts hotel procurement traffic",
        "Established wholesale infrastructure",
      ],
      weaknesses: [
        "Sunscreen is buried in a massive product catalog",
        "No mineral or reef-safe focus",
        "Generic supplier positioning",
        "No content marketing or thought leadership",
      ],
    },
    {
      id: "italtrim",
      name: "Italtrim",
      url: "https://www.italtrim.com",
      type: "b2b",
      description:
        "Italian luxury hotel amenity manufacturer. One of the few traditional suppliers that includes sunscreen (SPF 50 + Face & Body). Currently positioned within children's amenity kit rather than flagship adult product.",
      targetKeywords: [
        "luxury hotel amenities",
        "hotel amenity supplier",
        "customized hotel amenities",
        "hotel kids amenities",
      ],
      contentAngles: [
        "Italian luxury design and creativity",
        "Highly customizable solutions (white-label)",
        "Comprehensive product range (30+ products)",
        "Both chain and boutique hotel service",
      ],
      strengths: [
        "Actually offers sunscreen as a hotel amenity (SPF 50)",
        "Italian luxury positioning",
        "Highly customizable (white-label capability)",
        "Ranks on page 1 for 'hotel sunscreen supplier'",
      ],
      weaknesses: [
        "Sunscreen buried in kids' line, not flagship",
        "No reef-safe or mineral positioning",
        "No sustainability certifications",
        "No sunscreen-specific landing page",
      ],
    },
    {
      id: "project-reef",
      name: "Project Reef",
      url: "https://projectreef.com",
      type: "both",
      description:
        "Hawaii-born mineral sunscreen founded by hospitality veteran. Non-nano zinc oxide only active. Four Seasons Resort Maui partnership. Available on Faire wholesale. 1 lb plastic removed with every purchase.",
      targetKeywords: [
        "reef-safe sunscreen",
        "mineral sunscreen",
        "non-nano zinc oxide",
        "ocean-friendly sunscreen",
        "Hawaii sunscreen",
      ],
      contentAngles: [
        "Mission-driven: protecting reefs and people",
        "Hospitality founder background",
        "Non-nano zinc oxide as only active ingredient",
        "Four Seasons partnership as credibility",
      ],
      strengths: [
        "Founder has hospitality background — understands B2B buyer",
        "Four Seasons partnership is powerful social proof",
        "Hawaii origin authentic for reef-safe narrative",
        "Strong environmental mission",
      ],
      weaknesses: [
        "No dedicated B2B hospitality page or program",
        "Small brand with limited distribution",
        "Wholesale only via Faire (passive, not active B2B sales)",
        "No luxury packaging or premium hotel-grade presentation",
      ],
    },
    {
      id: "raw-elements",
      name: "Raw Elements",
      url: "https://www.rawelementsusa.com",
      type: "both",
      description:
        "Certified natural, reef-safe sunscreen founded by a 25-year ocean rescue lifeguard. Non-nano zinc oxide. EWG Verified + Leaping Bunny certified. Used by some Hawaii hotel properties (Aqua-Aston Hotels). DR 35-40, est. 20K-40K organic traffic/mo.",
      targetKeywords: [
        "certified natural sunscreen",
        "reef safe sunscreen",
        "non-nano zinc oxide",
        "organic sunscreen",
        "plastic free sunscreen",
      ],
      contentAngles: [
        "Lifeguard-founded authenticity",
        "Triple-certified (EWG, Leaping Bunny, certified natural)",
        "Founded World Reef Day",
        "Plastic-free packaging pioneer",
      ],
      strengths: [
        "Triple-certified — strongest certification portfolio",
        "Already used by Hawaii hotel properties (Aqua-Aston)",
        "Authentic founder story",
        "Compostable packaging",
      ],
      weaknesses: [
        "No formal hotel amenity program or B2B sales team",
        "Wholesale only via Faire (passive)",
        "Packaging looks outdoorsy/activist, not luxury hotel",
        "No hotel-specific content or case studies",
      ],
    },

    // ── D2C CONSUMER ──
    {
      id: "supergoop",
      name: "Supergoop!",
      url: "https://supergoop.com",
      type: "d2c",
      description:
        "Category-defining SPF brand. 40+ sunscreen formats. Pioneered sunscreen as daily beauty/skincare. 'Suncyclopedia' A-to-Z glossary. 1,600+ ingredient 'No List.' DR 70-75, est. 500K-1M+ organic traffic/mo.",
      targetKeywords: [
        "best sunscreen",
        "everyday sunscreen",
        "invisible sunscreen",
        "mineral sunscreen",
        "SPF skincare",
        "clean sunscreen",
      ],
      contentAngles: [
        "'The Bright Side' blog + 'Sun 101' / 'SPF University' education hub",
        "'Suncyclopedia' — A-to-Z sun protection glossary",
        "'No List' — 1,600+ excluded ingredients",
        "Influencer-heavy lifestyle content",
      ],
      strengths: [
        "Massive product range (40+ SKUs) covering every format",
        "Category-defining brand — made SPF a daily beauty habit",
        "Best-in-class educational content (Suncyclopedia, Sun 101)",
        "Highest organic traffic of any competitor (500K-1M+/mo)",
      ],
      weaknesses: [
        "Not exclusively mineral — chemical-based formulas dilute 'clean' positioning",
        "Premium pricing without luxury brand aesthetic",
        "Playful branding may not appeal to luxury consumers",
        "Not focused on hospitality/B2B at all",
      ],
    },
    {
      id: "coola",
      name: "COOLA",
      url: "https://coola.com",
      type: "d2c",
      description:
        "Organic sunscreen brand with 'Feel-Good SPF' positioning. Every formula 70%+ certified organic (California COPA standards). 'Farm to Face' sustainability storytelling. DR 65-70, est. 200K-400K organic traffic/mo.",
      targetKeywords: [
        "organic sunscreen",
        "mineral sunscreen",
        "reef safe sunscreen",
        "clean sunscreen",
        "fragrance free sunscreen",
      ],
      contentAngles: [
        "'Farm to Face' sustainability storytelling",
        "Organic certification education (COPA compliance)",
        "Hawaii Act 104 compliance content",
        "Glass bottles and sugar-cane resin packaging",
      ],
      strengths: [
        "Organic certification is a genuine differentiator",
        "Strong sustainability story (glass packaging, Farm to Face)",
        "Hawaii compliance content already established",
        "Reef-safe authority positioning",
      ],
      weaknesses: [
        "'Organic' positioning feels more health-food than luxury",
        "Broad product line dilutes mineral focus",
        "Mid-market pricing doesn't commit to luxury tier",
        "SoCal branding may not resonate globally",
      ],
    },
    {
      id: "eltamd",
      name: "EltaMD",
      url: "https://eltamd.com",
      type: "both",
      description:
        "#1 Dermatologist-Recommended Professional Sunscreen Brand. All sunscreens formulated with zinc oxide. 30+ years developing professional skincare. DR 65-70, est. 300K-500K organic traffic/mo.",
      targetKeywords: [
        "dermatologist recommended sunscreen",
        "zinc oxide sunscreen",
        "sunscreen for acne prone skin",
        "tinted mineral sunscreen",
        "professional sunscreen",
      ],
      contentAngles: [
        "'Live Freely' blog (zinc oxide benefits, skincare tips)",
        "Skin Cancer Awareness + Destination Healthy Skin mobile screening",
        "Mineral vs chemical sunscreen education",
        "Dermatologist endorsement-driven",
      ],
      strengths: [
        "#1 dermatologist-recommended — unmatched clinical credibility",
        "All products contain zinc oxide — genuine mineral commitment",
        "Professional-grade trust with consumers",
        "Strong organic traffic (300K-500K/mo)",
      ],
      weaknesses: [
        "Clinical/medical branding is not luxurious or aspirational",
        "Not focused on hospitality/B2B at all",
        "Minimal blog content compared to Supergoop",
        "No sustainability or environmental messaging",
      ],
    },
    {
      id: "laroche",
      name: "La Roche-Posay",
      url: "https://www.laroche-posay.us",
      type: "d2c",
      description:
        "L'Oreal-owned dermo-cosmetics brand. Anthelios sunscreen line is the flagship. Dermatologist-recommended. French thermal spring water. Comprehensive Expert Advice content hub.",
      targetKeywords: [
        "dermatologist recommended sunscreen",
        "sunscreen for sensitive skin",
        "mineral sunscreen for face",
        "tinted mineral sunscreen",
        "anti-aging sunscreen",
      ],
      contentAngles: [
        "Expert Advice / Skincare Tips hub by skin concern",
        "Ingredient & Safety Guide",
        "Dermatologist-backed authority content",
        "Oncology & Skin (skincare during treatment)",
      ],
      strengths: [
        "Unmatched clinical/dermatologist credibility",
        "Best-in-class expert advice content hub",
        "Broad Anthelios range covers every need",
        "L'Oreal R&D investment and distribution",
      ],
      weaknesses: [
        "Pharmaceutical branding lacks luxury aspirational appeal",
        "Not exclusively mineral",
        "Packaging is functional, not beautiful",
        "Price point is mid-market (drugstore-adjacent)",
      ],
    },
    {
      id: "blue-lizard",
      name: "Blue Lizard",
      url: "https://bluelizardsunscreen.com",
      type: "d2c",
      description:
        "Mineral-focused sunscreen brand strong in sensitive skin and baby markets. DR 55-60, est. 100K-200K organic traffic/mo. Mass-market positioning with strong product-focused SEO.",
      targetKeywords: [
        "mineral sunscreen",
        "sensitive skin sunscreen",
        "baby sunscreen",
        "mineral sunscreen for face",
        "blue lizard sunscreen",
      ],
      contentAngles: [
        "Sensitive skin and baby market specialization",
        "Mineral-focused product line",
        "Product-focused content with less educational depth",
      ],
      strengths: [
        "Strong sensitive skin + baby market positioning",
        "Mineral-focused across the line",
        "Good organic traffic (100K-200K/mo)",
      ],
      weaknesses: [
        "Mass market positioning — not premium",
        "Less educational content than top competitors",
        "No luxury or hospitality angle",
        "No B2B strategy",
      ],
    },
    {
      id: "vacation",
      name: "Vacation Inc",
      url: "https://www.vacation.inc",
      type: "d2c",
      description:
        "'The World's Best-Smelling Sunscreen.' Built around nostalgia and 1980s poolside aesthetics. Target's #1 SPF brand. Leaping Bunny certified. DR 35-40, est. 30K-60K organic traffic/mo.",
      targetKeywords: [
        "best smelling sunscreen",
        "coconut sunscreen",
        "retro sunscreen",
        "sunscreen spray",
        "sunscreen mousse",
      ],
      contentAngles: [
        "Retro/nostalgia brand storytelling",
        "Scent-led marketing (coconut, banana, pool water)",
        "'Leisure-Enhancing' formulation philosophy",
        "Minimal SEO content — brand storytelling only",
      ],
      strengths: [
        "Extremely distinctive brand identity",
        "Scent-as-differentiator is unique in category",
        "Strong retail expansion (Target, Ulta)",
        "Fun, shareable brand drives organic social media",
      ],
      weaknesses: [
        "Not mineral-focused — primarily chemical",
        "No educational content or ingredient transparency",
        "'Fun' brand is opposite of luxury/premium",
        "Niche appeal — completely different positioning",
      ],
    },
    {
      id: "sunbum",
      name: "Sun Bum",
      url: "https://www.sunbum.com",
      type: "d2c",
      description:
        "Beach lifestyle brand from Cocoa Beach, FL. 'Hawaii Act 104 Reef Compliant.' Massive retail distribution (Target, Walmart, CVS). DR 65-70, est. 300K-500K organic traffic/mo.",
      targetKeywords: [
        "sunscreen lotion",
        "reef friendly sunscreen",
        "SPF 50 sunscreen",
        "mineral sunscreen stick",
        "kids sunscreen",
      ],
      contentAngles: [
        "Sun Education landing page + Protection Guide (UVA vs UVB)",
        "'Protect the Groms' nonprofit (shade + sunscreen for kids)",
        "Hawaii Act 104 compliance education",
        "Fun lifestyle content + reef education",
      ],
      strengths: [
        "Massive brand awareness and retail distribution",
        "Strong educational content (Sun Education page)",
        "Charitable mission (Protect the Groms)",
        "Hawaii Act 104 compliance content already published",
      ],
      weaknesses: [
        "Mass-market positioning — no luxury appeal",
        "Primarily chemical (mineral limited to sticks)",
        "Beach-bro branding limits appeal",
        "Brand expansion dilutes sunscreen focus",
      ],
    },
    {
      id: "bask",
      name: "Bask Suncare",
      url: "https://basksuncare.com",
      type: "d2c",
      description:
        "'The World's Best Feeling Sunscreen.' Premium, design-forward brand. Founded after family skin cancer loss. 63 product iterations. 10% of proceeds to Skin Protection Foundation.",
      targetKeywords: [
        "best feeling sunscreen",
        "luxury sunscreen",
        "clean sunscreen",
        "reef safe sunscreen",
        "SPF 50 sunscreen",
      ],
      contentAngles: [
        "'The Bask Blog' with sun education articles",
        "Mission story (skin cancer loss, foundation)",
        "'Facial grade ingredients for body' messaging",
        "UV index education and application guides",
      ],
      strengths: [
        "Closest D2C competitor to Solvyn's luxury positioning",
        "Beautiful design and premium packaging",
        "'Best feeling' is a strong sensory differentiator",
        "Mission-driven story adds emotional depth",
      ],
      weaknesses: [
        "Relatively unknown — limited awareness",
        "Not exclusively mineral (offers both chemical and mineral)",
        "No B2B hospitality strategy",
        "No certifications page or ingredient glossary",
      ],
    },
    {
      id: "cocokind",
      name: "Cocokind",
      url: "https://www.cocokind.com",
      type: "d2c",
      description:
        "'Conscious skincare' brand. Pioneer of 'Formula Facts' panels (ingredient concentrations) and 'Sustainability Facts' labels (carbon emissions/use). Non-nano zinc oxide. Available at Target, Ulta, Whole Foods.",
      targetKeywords: [
        "conscious skincare",
        "mineral sunscreen",
        "clean skincare",
        "sustainable skincare",
        "vegan sunscreen",
      ],
      contentAngles: [
        "'Sustainability School' — interactive education",
        "'Transparency Evolved' (Formula Facts, Sustainability Facts)",
        "Carbon footprint measurement and labeling",
        "Blue light and pollution protection messaging",
      ],
      strengths: [
        "Industry-leading transparency (Formula Facts, carbon labels)",
        "Sustainability School is unique differentiating content",
        "Non-nano zinc oxide is specific, trust-building claim",
        "Excellent blog content with sustainability thought leadership",
      ],
      weaknesses: [
        "Anti-aspirational positioning is opposite of luxury",
        "Very limited SPF product range (1-2 products)",
        "Affordable positioning cannibalizes premium perception",
        "Target/Whole Foods distribution signals mass-market",
      ],
    },
    {
      id: "kinfield",
      name: "Kinfield",
      url: "https://kinfield.com",
      type: "d2c",
      description:
        "'Great Essentials for the Great Outdoors.' 100% mineral, reef-safe across the line. Inclusive 'outdoors-ish' positioning. DR 40-45, est. 50K-100K organic traffic/mo. Similar aesthetic but no B2B or derm credentials.",
      targetKeywords: [
        "reef safe sunscreen",
        "mineral sunscreen",
        "clean sunscreen",
        "outdoor skincare",
        "sensitive skin sunscreen",
      ],
      contentAngles: [
        "'Outdoors-ish' inclusive lifestyle content",
        "Product-specific FAQ pages (good for SEO)",
        "'Made Safe for People + Planet' messaging",
        "Eco-conscious packaging and shipping",
      ],
      strengths: [
        "100% mineral, reef-safe across entire line",
        "Inclusive 'outdoors-ish' messaging broadens appeal",
        "Clean, modern DTC branding",
        "Product-specific FAQ pages good for SEO",
      ],
      weaknesses: [
        "Very small product line (3-4 sunscreen SKUs)",
        "Lower SPF (all SPF 35) vs competitors at 50+",
        "No luxury positioning — more functional/accessible",
        "'Outdoor skincare' niche may be too narrow",
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // KEYWORDS BY PAGE (Merged: SERP analysis + Ahrefs volume/KD estimates)
  // Sources cross-referenced: My SERP analysis, Claude.ai Ahrefs research, Google Trends
  // ─────────────────────────────────────────────
  keywords: [
    {
      pageId: "homepage",
      pageName: "Homepage",
      primary: "luxury mineral sunscreen",
      secondary: [
        "premium sunscreen brand",
        "luxury reef safe sunscreen",
        "clean sunscreen",
      ],
      clusters: [
        {
          id: "hp-luxury",
          name: "Luxury & Premium",
          keywords: [
            {
              id: "hp-1",
              term: "luxury sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "2K-4K",
              difficulty: "35-45",
              source: "SERP + Ahrefs",
              notes:
                "Listicles dominate SERPs. Pursue PR/editorial in The Luxury Editor, SPHERE. White space: luxury + mineral + single-use.",
            },
            {
              id: "hp-2",
              term: "premium sunscreen brand",
              intent: "commercial",
              priority: "high",
              volume: "1K-2.5K",
              difficulty: "30-40",
              source: "SERP + Ahrefs",
              notes: "Brand discovery query. Low competition, high intent.",
            },
            {
              id: "hp-3",
              term: "luxury mineral sunscreen brand",
              intent: "commercial",
              priority: "high",
              volume: "<500",
              difficulty: "10-20",
              source: "Gap analysis — no competitor owns this intersection",
              notes:
                "Near-zero competition. Solvyn's exact positioning. Must own this term.",
            },
            {
              id: "hp-4",
              term: "high-end sunscreen",
              intent: "commercial",
              priority: "medium",
              volume: "1K-2K",
              difficulty: "35-45",
              source: "SERP analysis",
              notes: "Overlap with 'luxury sunscreen'. Secondary target.",
            },
          ],
        },
        {
          id: "hp-brand",
          name: "Brand & Trust",
          keywords: [
            {
              id: "hp-5",
              term: "dermatologist trusted sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "2K-4K",
              difficulty: "50-60",
              source: "Ahrefs — Claude.ai research",
              notes:
                "If Dr. Weiss credentials are featured prominently, this becomes attainable. E-E-A-T critical.",
            },
            {
              id: "hp-6",
              term: "clean sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "10K-15K",
              difficulty: "55-65",
              source: "SERP + Ahrefs",
              notes:
                "Ties into clean beauty movement. Medium-high traffic potential.",
            },
            {
              id: "hp-7",
              term: "mineral sunscreen brand",
              intent: "navigational",
              priority: "high",
              volume: "1K-3K",
              difficulty: "40-50",
              source: "Ahrefs",
              notes: "Brand discovery query for mineral-committed brands.",
            },
          ],
        },
      ],
    },
    {
      pageId: "shield",
      pageName: "Shield (Product)",
      primary: "mineral sunscreen SPF 50 packets",
      secondary: [
        "single use sunscreen",
        "zinc oxide sunscreen",
        "reef safe sunscreen packets",
        "sunscreen sachets",
      ],
      clusters: [
        {
          id: "sh-format",
          name: "Single-Use Format (Tier 1 — Lowest Competition, Highest ROI)",
          keywords: [
            {
              id: "sh-1",
              term: "sunscreen packets",
              intent: "transactional",
              priority: "high",
              volume: "3K-5K",
              difficulty: "25-35",
              source: "SERP + Ahrefs (confirmed both sources)",
              notes:
                "LOW competition. Amazon + no-name brands. No luxury player. Solvyn's primary SEO battleground.",
            },
            {
              id: "sh-2",
              term: "single use sunscreen",
              intent: "transactional",
              priority: "high",
              volume: "1.5K-3K",
              difficulty: "15-25",
              source: "SERP + Ahrefs (confirmed both sources)",
              notes:
                "Very low KD. Direct product match. High purchase intent. Confirmed by both research sources.",
            },
            {
              id: "sh-3",
              term: "sunscreen sachets",
              intent: "transactional",
              priority: "high",
              volume: "500-1.5K",
              difficulty: "10-20",
              source: "SERP + Ahrefs (confirmed both sources)",
              notes:
                "Ultra-low competition. Used in hospitality context. Both sources agree on priority.",
            },
            {
              id: "sh-4",
              term: "individual sunscreen packets",
              intent: "transactional",
              priority: "high",
              volume: "500-1.2K",
              difficulty: "10-20",
              source: "SERP + Ahrefs (confirmed both sources)",
              notes: "Very specific, very high intent, near-zero competition.",
            },
            {
              id: "sh-5",
              term: "travel sunscreen",
              intent: "transactional",
              priority: "high",
              volume: "8K-12K",
              difficulty: "55-65",
              source: "SERP + Ahrefs",
              notes: "Broader query. Higher volume but more competitive.",
            },
            {
              id: "sh-6",
              term: "travel size sunscreen",
              intent: "transactional",
              priority: "medium",
              volume: "8K-12K",
              difficulty: "55-65",
              source: "Ahrefs — Claude.ai research",
              notes: "High volume. Broad but relevant. Secondary target.",
            },
            {
              id: "sh-7",
              term: "luxury single use sunscreen packets",
              intent: "transactional",
              priority: "high",
              volume: "<200",
              difficulty: "5-10",
              source: "Long-tail discovery — near-zero competition",
              notes:
                "Exact match for Solvyn's product. Zero competition. Both sources identified this.",
            },
            {
              id: "sh-8",
              term: "reef safe sunscreen packets",
              intent: "transactional",
              priority: "high",
              volume: "<500",
              difficulty: "10-15",
              source: "Long-tail discovery — both sources",
            },
            {
              id: "sh-9",
              term: "SPF 50 sunscreen sachets",
              intent: "transactional",
              priority: "high",
              volume: "<300",
              difficulty: "5-10",
              source: "Long-tail discovery",
            },
            {
              id: "sh-10",
              term: "mineral sunscreen sachets bulk",
              intent: "transactional",
              priority: "high",
              volume: "<200",
              difficulty: "5-10",
              source: "Long-tail discovery",
            },
            {
              id: "sh-11",
              term: "TSA friendly sunscreen packets",
              intent: "transactional",
              priority: "medium",
              volume: "<300",
              difficulty: "10-15",
              source: "People Also Ask",
            },
            {
              id: "sh-12",
              term: "eco-friendly sunscreen sachets",
              intent: "transactional",
              priority: "medium",
              volume: "<200",
              difficulty: "5-10",
              source: "Long-tail discovery",
            },
          ],
        },
        {
          id: "sh-product",
          name: "Product Core (High Volume, High Competition)",
          keywords: [
            {
              id: "sh-13",
              term: "mineral sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "65K-80K",
              difficulty: "75-85",
              source: "SERP + Ahrefs + Trends (all 3 confirm)",
              notes:
                "Massive volume. 52%+ of sunscreen revenue now mineral. 10.6% YoY growth. Essential for on-page SEO but too competitive for organic ranking short-term.",
            },
            {
              id: "sh-14",
              term: "zinc oxide sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "22K-30K",
              difficulty: "65-75",
              source: "SERP + Ahrefs + Trends (all 3 confirm)",
              notes:
                "Market growing to $8.78B by 2035. 70% of new launches use non-nano zinc oxide.",
            },
            {
              id: "sh-15",
              term: "reef safe sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "18K-25K",
              difficulty: "55-65",
              source: "SERP + Ahrefs + Trends (all 3 confirm)",
              notes:
                "Searches up 86% YoY. Reef-safe market growing at 10.5% CAGR. Strong tie to hospitality angle (Hawaii/Mexico laws).",
            },
            {
              id: "sh-16",
              term: "mineral SPF 50",
              intent: "transactional",
              priority: "high",
              volume: "4K-7K",
              difficulty: "60-70",
              source: "SERP + Ahrefs",
              notes: "Important for product page. Competitive but essential.",
            },
            {
              id: "sh-17",
              term: "best mineral sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "14K-20K",
              difficulty: "80-90",
              source: "Ahrefs — Claude.ai research",
              notes:
                "Very high competition. Important for presence in roundups, not direct ranking.",
            },
            {
              id: "sh-18",
              term: "non toxic sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "8K-12K",
              difficulty: "50-60",
              source: "SERP + Ahrefs",
              notes:
                "20% of US consumers believe traditional sunscreens are toxic. Growing concern. Medium KD.",
            },
            {
              id: "sh-19",
              term: "dermatologist recommended sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "12K-18K",
              difficulty: "75-85",
              source: "Ahrefs — Claude.ai research",
              notes:
                "Very competitive (EltaMD, La Roche-Posay own this). Valuable if Dr. Weiss endorsement is featured. None of top results show sachet format.",
            },
            {
              id: "sh-20",
              term: "broad spectrum mineral sunscreen",
              intent: "commercial",
              priority: "medium",
              volume: "2K-4K",
              difficulty: "40-50",
              source: "Ahrefs",
              notes: "Medium competition. Good supporting keyword.",
            },
            {
              id: "sh-21",
              term: "mineral sunscreen for face and body",
              intent: "commercial",
              priority: "medium",
              volume: "3K-5K",
              difficulty: "50-60",
              source: "SERP analysis",
            },
          ],
        },
        {
          id: "sh-clean",
          name: "Clean & Sensitive Skin",
          keywords: [
            {
              id: "sh-22",
              term: "sensitive skin sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "15K-22K",
              difficulty: "70-80",
              source: "Ahrefs — Claude.ai research",
              notes:
                "Very high volume. Competitive. Dermatologist roundups dominate SERPs.",
            },
            {
              id: "sh-23",
              term: "hypoallergenic sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "5K-8K",
              difficulty: "50-60",
              source: "SERP + Ahrefs",
              notes:
                "Dominated by Eucerin, CeraVe. Important product claim if valid for Solvyn.",
            },
            {
              id: "sh-24",
              term: "chemical free sunscreen",
              intent: "commercial",
              priority: "medium",
              volume: "6K-9K",
              difficulty: "50-60",
              source: "SERP + Ahrefs",
              notes: "Consumers search this phrase despite being technically inaccurate.",
            },
            {
              id: "sh-25",
              term: "paraben free sunscreen",
              intent: "commercial",
              priority: "medium",
              volume: "2K-4K",
              difficulty: "40-50",
              source: "SERP analysis",
            },
            {
              id: "sh-26",
              term: "reef friendly sunscreen",
              intent: "commercial",
              priority: "medium",
              volume: "6K-9K",
              difficulty: "45-55",
              source: "Ahrefs",
              notes: "Alternative phrasing to 'reef safe'. Sun Bum uses this.",
            },
            {
              id: "sh-27",
              term: "mineral sunscreen no white cast",
              intent: "commercial",
              priority: "medium",
              volume: "5K-8K",
              difficulty: "45-55",
              source: "Ahrefs — Claude.ai research",
              notes:
                "Common consumer concern. PAA: 'Does mineral sunscreen leave a white cast?'",
            },
            {
              id: "sh-28",
              term: "Hawaii compliant sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "1K-2.5K",
              difficulty: "20-30",
              source: "SERP + Ahrefs (both sources flag as low-comp sweet spot)",
              notes:
                "Low competition. Regulatory angle directly relevant to hospitality buyers.",
            },
          ],
        },
        {
          id: "sh-ingredients",
          name: "Ingredients",
          keywords: [
            {
              id: "sh-29",
              term: "non nano zinc oxide sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "2K-4K",
              difficulty: "30-40",
              source: "Ahrefs + Trends",
              notes:
                "70% of new launches use non-nano. Technical differentiator for Solvyn's formula.",
            },
            {
              id: "sh-30",
              term: "oxybenzone free sunscreen",
              intent: "commercial",
              priority: "medium",
              volume: "2K-4K",
              difficulty: "35-45",
              source: "Ahrefs — Claude.ai research",
              notes: "Shield's clean formulation as differentiator.",
            },
            {
              id: "sh-31",
              term: "aloe vera sunscreen",
              intent: "commercial",
              priority: "medium",
              volume: "2K-4K",
              difficulty: "40-50",
              source: "SERP analysis",
              notes: "Relevant if aloe vera is in Solvyn's formula.",
            },
          ],
        },
      ],
    },
    {
      pageId: "partners",
      pageName: "Partners (B2B)",
      primary: "hotel sunscreen supplier",
      secondary: [
        "resort sunscreen amenities",
        "hospitality sunscreen",
        "hotel amenity sunscreen",
      ],
      clusters: [
        {
          id: "pa-hospitality",
          name: "B2B Hospitality (Tier 1 — Highest-Value, Near-Zero Competition)",
          keywords: [
            {
              id: "pa-1",
              term: "hotel sunscreen supplier",
              intent: "transactional",
              priority: "high",
              volume: "100-300",
              difficulty: "10-20",
              source: "SERP + Ahrefs (confirmed both sources)",
              notes:
                "No brand owns this query. Fragmented SERPs (editorial + general suppliers). $1K-$50K+ contract value per lead. First-mover wins.",
            },
            {
              id: "pa-2",
              term: "hotel amenity sunscreen",
              intent: "transactional",
              priority: "high",
              volume: "50-200",
              difficulty: "5-15",
              source: "Ahrefs — Claude.ai research (new keyword)",
              notes:
                "Even lower competition than 'hotel sunscreen supplier'. Very high B2B value.",
            },
            {
              id: "pa-3",
              term: "resort sunscreen amenities",
              intent: "commercial",
              priority: "high",
              volume: "50-150",
              difficulty: "5-10",
              source: "SERP + Ahrefs (confirmed both sources)",
              notes: "Fragmented results. Solvyn can own this immediately.",
            },
            {
              id: "pa-4",
              term: "bulk sunscreen for hotels",
              intent: "transactional",
              priority: "high",
              volume: "100-300",
              difficulty: "10-20",
              source: "Ahrefs — Claude.ai research (new keyword)",
            },
            {
              id: "pa-5",
              term: "hospitality sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "30-100",
              difficulty: "5-10",
              source: "SERP + Ahrefs (confirmed both sources)",
            },
            {
              id: "pa-6",
              term: "sunscreen for guests",
              intent: "commercial",
              priority: "high",
              volume: "50-150",
              difficulty: "5-10",
              source: "Ahrefs — Claude.ai research (new keyword)",
            },
            {
              id: "pa-7",
              term: "spa sunscreen products",
              intent: "commercial",
              priority: "high",
              volume: "50-200",
              difficulty: "15-25",
              source: "Ahrefs — Claude.ai research (new keyword)",
            },
            {
              id: "pa-8",
              term: "hotel room amenities sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "20-80",
              difficulty: "5-10",
              source: "SERP analysis",
              notes: "Niche and specific. Near zero dedicated competition.",
            },
            {
              id: "pa-9",
              term: "mineral sunscreen hospitality",
              intent: "commercial",
              priority: "high",
              volume: "10-50",
              difficulty: "5-10",
              source: "Ahrefs — Claude.ai research (new — uncontested)",
              notes: "Wide open. Zero dedicated competitor pages.",
            },
            {
              id: "pa-10",
              term: "reef safe sunscreen hotel",
              intent: "commercial",
              priority: "high",
              volume: "30-100",
              difficulty: "5-10",
              source: "Ahrefs — Claude.ai research (new — uncontested)",
            },
            {
              id: "pa-11",
              term: "single use sunscreen for hotels",
              intent: "transactional",
              priority: "high",
              volume: "10-50",
              difficulty: "5-10",
              source: "Ahrefs — Claude.ai research (new — uncontested)",
            },
            {
              id: "pa-12",
              term: "hotel guest sunscreen program",
              intent: "commercial",
              priority: "high",
              volume: "10-30",
              difficulty: "5-10",
              source: "Ahrefs — Claude.ai research (new — wide open)",
            },
            {
              id: "pa-13",
              term: "sunscreen amenity for resorts",
              intent: "transactional",
              priority: "high",
              volume: "20-60",
              difficulty: "5-10",
              source: "Ahrefs — Claude.ai research (new — wide open)",
            },
            {
              id: "pa-14",
              term: "luxury hotel sunscreen supplier",
              intent: "transactional",
              priority: "high",
              volume: "<50",
              difficulty: "5-10",
              source: "Long-tail discovery — near-zero competition",
            },
            {
              id: "pa-15",
              term: "Hawaii compliant hotel sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "<100",
              difficulty: "5-10",
              source: "Long-tail discovery — both sources",
              notes: "Regulatory angle. Hawaii, Mexico, Caribbean laws.",
            },
            {
              id: "pa-16",
              term: "eco-friendly hotel sunscreen amenity",
              intent: "commercial",
              priority: "high",
              volume: "<100",
              difficulty: "5-10",
              source: "Long-tail discovery",
              notes: "73% of guests say sustainability matters in hotel choice.",
            },
            {
              id: "pa-17",
              term: "branded sunscreen for resorts",
              intent: "commercial",
              priority: "medium",
              volume: "<50",
              difficulty: "5-10",
              source: "Long-tail discovery",
            },
          ],
        },
        {
          id: "pa-broader",
          name: "Broader B2B (Higher Volume, More Competition)",
          keywords: [
            {
              id: "pa-18",
              term: "luxury hotel amenities",
              intent: "commercial",
              priority: "medium",
              volume: "1K-3K",
              difficulty: "45-55",
              source: "SERP + Ahrefs",
              notes: "High volume but very broad. General suppliers dominate.",
            },
            {
              id: "pa-19",
              term: "hotel room amenities supplier",
              intent: "transactional",
              priority: "medium",
              volume: "500-1.5K",
              difficulty: "30-40",
              source: "Ahrefs",
            },
            {
              id: "pa-20",
              term: "eco friendly hotel amenities",
              intent: "commercial",
              priority: "medium",
              volume: "500-1.5K",
              difficulty: "35-45",
              source: "Ahrefs — Claude.ai research",
            },
            {
              id: "pa-21",
              term: "sustainable hotel toiletries",
              intent: "commercial",
              priority: "medium",
              volume: "200-500",
              difficulty: "25-35",
              source: "Ahrefs — Claude.ai research",
            },
          ],
        },
        {
          id: "pa-events",
          name: "B2B Events",
          keywords: [
            {
              id: "pa-22",
              term: "event sunscreen",
              intent: "transactional",
              priority: "high",
              volume: "50-200",
              difficulty: "5-15",
              source: "SERP + Ahrefs",
            },
            {
              id: "pa-23",
              term: "welcome kit sunscreen",
              intent: "transactional",
              priority: "high",
              volume: "20-80",
              difficulty: "5-10",
              source: "SERP + Ahrefs (confirmed both sources)",
            },
            {
              id: "pa-24",
              term: "sunscreen for stadium events",
              intent: "commercial",
              priority: "high",
              volume: "20-80",
              difficulty: "5-10",
              source: "Ahrefs — Claude.ai research (new — uncontested)",
              notes: "Nobody covers this. Unique B2B content opportunity.",
            },
            {
              id: "pa-25",
              term: "corporate gift sunscreen",
              intent: "transactional",
              priority: "medium",
              volume: "50-150",
              difficulty: "10-20",
              source: "SERP analysis",
            },
            {
              id: "pa-26",
              term: "destination wedding sunscreen packets",
              intent: "transactional",
              priority: "medium",
              volume: "200-500",
              difficulty: "10-20",
              source: "Ahrefs — Claude.ai research",
            },
            {
              id: "pa-27",
              term: "poolside sunscreen",
              intent: "commercial",
              priority: "medium",
              volume: "100-300",
              difficulty: "10-20",
              source: "Ahrefs — Claude.ai research",
            },
          ],
        },
      ],
    },
    {
      pageId: "discover",
      pageName: "Discover (Education Hub)",
      primary: "mineral vs chemical sunscreen",
      secondary: [
        "why mineral sunscreen is better",
        "reef safe sunscreen ingredients",
        "hawaii sunscreen law",
      ],
      clusters: [
        {
          id: "di-education",
          name: "Core Educational (High Volume)",
          keywords: [
            {
              id: "di-1",
              term: "mineral vs chemical sunscreen",
              intent: "informational",
              priority: "high",
              volume: "12K-18K",
              difficulty: "60-70",
              source: "SERP + Ahrefs (confirmed both sources)",
              notes:
                "Competitive (Cleveland Clinic, MD Anderson). Differentiate with luxury hospitality angle + Dr. Weiss authority.",
            },
            {
              id: "di-2",
              term: "why mineral sunscreen is better",
              intent: "informational",
              priority: "high",
              volume: "3K-5K",
              difficulty: "45-55",
              source: "Ahrefs — Claude.ai research",
              notes: "Directly aligns with Shield positioning. Medium KD — achievable.",
            },
            {
              id: "di-3",
              term: "what is mineral sunscreen",
              intent: "informational",
              priority: "high",
              volume: "3K-5K",
              difficulty: "40-50",
              source: "Ahrefs — Claude.ai research",
              notes: "Beginner-friendly content. Trust builder.",
            },
            {
              id: "di-4",
              term: "how does mineral sunscreen work",
              intent: "informational",
              priority: "high",
              volume: "2K-4K",
              difficulty: "35-45",
              source: "Ahrefs — Claude.ai research",
              notes: "Visual content opportunity. 'Why Mineral' page.",
            },
            {
              id: "di-5",
              term: "is zinc oxide sunscreen safe",
              intent: "informational",
              priority: "high",
              volume: "4K-7K",
              difficulty: "40-50",
              source: "Ahrefs — Claude.ai research",
              notes: "Dermatologist authority + transparency messaging. FAQ content.",
            },
            {
              id: "di-6",
              term: "sunscreen chemicals to avoid",
              intent: "informational",
              priority: "high",
              volume: "4K-7K",
              difficulty: "40-50",
              source: "Ahrefs — Claude.ai research",
              notes: "Transparency positioning. Supports ingredient standards page.",
            },
            {
              id: "di-7",
              term: "best sunscreen ingredients",
              intent: "informational",
              priority: "medium",
              volume: "3K-5K",
              difficulty: "50-60",
              source: "Ahrefs — Claude.ai research",
            },
            {
              id: "di-8",
              term: "what SPF should I use",
              intent: "informational",
              priority: "medium",
              volume: "5K-8K",
              difficulty: "55-65",
              source: "Ahrefs — Claude.ai research",
            },
          ],
        },
        {
          id: "di-reef",
          name: "Reef-Safe & Regulatory (High Strategic Value)",
          keywords: [
            {
              id: "di-9",
              term: "reef safe sunscreen ingredients",
              intent: "informational",
              priority: "high",
              volume: "3K-5K",
              difficulty: "35-45",
              source: "SERP + Ahrefs (confirmed both sources)",
              notes:
                "Dual purpose: SEO + B2B sales enablement. Hospitality angle + Hawaii/Mexico laws.",
            },
            {
              id: "di-10",
              term: "hawaii act 104 sunscreen",
              intent: "informational",
              priority: "high",
              volume: "1K-2.5K",
              difficulty: "15-25",
              source: "Ahrefs — Claude.ai (flagged as low-comp sweet spot)",
              notes:
                "Low KD. Solvyn as compliance leader. Educate B2B partners. Only Sun Bum + Coola have consumer-facing pages.",
            },
            {
              id: "di-11",
              term: "hawaii sunscreen law",
              intent: "informational",
              priority: "high",
              volume: "2K-4K",
              difficulty: "20-30",
              source: "Ahrefs — Claude.ai research",
              notes: "Position as authority on reef-safe compliance.",
            },
            {
              id: "di-12",
              term: "zinc oxide sunscreen benefits",
              intent: "informational",
              priority: "high",
              volume: "2K-4K",
              difficulty: "35-45",
              source: "SERP analysis",
              notes: "Directly supports Solvyn's product story.",
            },
            {
              id: "di-13",
              term: "eco friendly sunscreen ingredients",
              intent: "informational",
              priority: "medium",
              volume: "1K-2.5K",
              difficulty: "30-40",
              source: "Ahrefs — Claude.ai research",
            },
          ],
        },
        {
          id: "di-b2b",
          name: "B2B Educational (Unique — No Competitors)",
          keywords: [
            {
              id: "di-14",
              term: "why are hotels switching to mineral sunscreen",
              intent: "informational",
              priority: "high",
              volume: "<100",
              difficulty: "5-10",
              source: "Long-tail discovery — both sources agree",
              notes:
                "Zero competition. Serves both SEO and B2B pipeline. Nobody is writing this content.",
            },
            {
              id: "di-15",
              term: "reef safe sunscreen laws for hotels",
              intent: "informational",
              priority: "high",
              volume: "<200",
              difficulty: "5-10",
              source: "Long-tail discovery — both sources agree",
              notes: "Perfect for hotel procurement managers. Hawaii, Mexico, Caribbean, Palau, USVI.",
            },
            {
              id: "di-16",
              term: "hotel sunscreen for guests",
              intent: "informational",
              priority: "high",
              volume: "30-100",
              difficulty: "5-10",
              source: "Ahrefs — Claude.ai research (new — uncontested)",
              notes: "Address hotelier pain points. Hygiene angle.",
            },
            {
              id: "di-17",
              term: "sunscreen towel staining hotels",
              intent: "informational",
              priority: "high",
              volume: "100-300",
              difficulty: "5-10",
              source: "Ahrefs — Claude.ai research (unique find)",
              notes:
                "Brilliant niche angle. Mineral sunscreen stains less than chemical. Cost savings for housekeeping. Only scattered forum mentions exist.",
            },
            {
              id: "di-18",
              term: "sunscreen for outdoor events",
              intent: "informational",
              priority: "high",
              volume: "200-500",
              difficulty: "10-20",
              source: "Ahrefs — Claude.ai research",
              notes: "Guide for event organizers. Stadium/festival distribution.",
            },
            {
              id: "di-19",
              term: "skin cancer prevention sunscreen",
              intent: "informational",
              priority: "medium",
              volume: "2K-4K",
              difficulty: "45-55",
              source: "Ahrefs — Claude.ai research",
              notes: "1 in 5 Americans stat. Dermatologist backing needed.",
            },
            {
              id: "di-20",
              term: "destination wedding sunscreen",
              intent: "commercial",
              priority: "medium",
              volume: "200-500",
              difficulty: "10-20",
              source: "Ahrefs + SERP",
              notes: "Welcome kit / amenity bag positioning for event planners.",
            },
          ],
        },
      ],
    },
    {
      pageId: "about",
      pageName: "About",
      primary: "premium mineral sunscreen brand",
      secondary: [
        "luxury sunscreen brand",
        "dermatologist formulated sunscreen",
        "sustainable sunscreen brand",
      ],
      clusters: [
        {
          id: "ab-brand",
          name: "Brand Discovery",
          keywords: [
            {
              id: "ab-1",
              term: "luxury mineral sunscreen brand",
              intent: "navigational",
              priority: "high",
              volume: "<500",
              difficulty: "10-20",
              source: "Gap analysis — both sources confirm",
              notes: "This intersection is Solvyn's unique position. No competitor occupies it.",
            },
            {
              id: "ab-2",
              term: "premium sunscreen brand",
              intent: "commercial",
              priority: "high",
              volume: "1K-2.5K",
              difficulty: "30-40",
              source: "SERP + Ahrefs",
            },
            {
              id: "ab-3",
              term: "dermatologist formulated sunscreen",
              intent: "commercial",
              priority: "high",
              volume: "1K-3K",
              difficulty: "40-50",
              source: "Ahrefs — Claude.ai research",
              notes:
                "Dr. Eduardo Weiss credentials are key E-E-A-T signal. Feature prominently on About page.",
            },
            {
              id: "ab-4",
              term: "sustainable sunscreen company",
              intent: "informational",
              priority: "medium",
              volume: "500-1K",
              difficulty: "25-35",
              source: "Trends — sustainability in hospitality growing 30% YoY",
            },
          ],
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // META TAGS (Best-of merge from both research sources)
  // ─────────────────────────────────────────────
  metaTags: [
    {
      pageId: "homepage",
      pageName: "Homepage",
      title: "Solvyn — Luxury Mineral Sunscreen for Hotels & Resorts",
      titleLength: 56,
      description:
        "Dermatologist-trusted mineral sunscreen in single-use packets. Reef-safe SPF 50 protection crafted for luxury hospitality and discerning travelers.",
      descriptionLength: 153,
      h1: "Luxury Mineral Sunscreen, Reimagined",
    },
    {
      pageId: "shield",
      pageName: "Shield (Product)",
      title: "Shield SPF 50 — Mineral Sunscreen Packets | Solvyn",
      titleLength: 51,
      description:
        "100% mineral broad-spectrum SPF 50 in a sealed single-use pouch. Non-nano zinc oxide, hypoallergenic, reef-safe. Dermatologist-approved protection.",
      descriptionLength: 153,
      h1: "Shield — SPF 50 Mineral Protection",
    },
    {
      pageId: "partners",
      pageName: "Partners (B2B)",
      title: "Hotel Sunscreen Supplier — Luxury Resort Amenities | Solvyn",
      titleLength: 59,
      description:
        "Premium mineral sunscreen amenity for hotels, resorts, spas, and events. Sealed single-use pouches. Reef-safe, hygienic, dermatologist-trusted.",
      descriptionLength: 150,
      h1: "Sunscreen Amenities for Luxury Hospitality",
    },
    {
      pageId: "about",
      pageName: "About",
      title: "About Solvyn — Dermatologist-Rooted Sun Protection",
      titleLength: 51,
      description:
        "Meet the founders and medical advisory board behind Solvyn. Clean mineral formulas backed by dermatology, crafted for hotels, resorts, and real life.",
      descriptionLength: 153,
      h1: "Protection Worth Sharing",
    },
    {
      pageId: "discover",
      pageName: "Discover (Education Hub)",
      title: "Mineral vs Chemical Sunscreen — Why Mineral Matters | Solvyn",
      titleLength: 60,
      description:
        "Expert guides on mineral sunscreen, reef-safe ingredients, Hawaii Act 104 compliance, and sun protection for hospitality and everyday life.",
      descriptionLength: 141,
      h1: "Discover Why Mineral Sunscreen Matters",
    },
    {
      pageId: "contact",
      pageName: "Contact",
      title: "Contact Solvyn — Hotel Sunscreen Partnership Inquiries",
      titleLength: 55,
      description:
        "Request a conversation about Solvyn Shield for your hotel, resort, or event. Join our waitlist for at-home mineral sunscreen.",
      descriptionLength: 128,
      h1: "Let's Talk Sun Protection",
    },
  ],

  // ─────────────────────────────────────────────
  // CONTENT GAPS (Merged from both sources — deduplicated + new finds added)
  // ─────────────────────────────────────────────
  contentGaps: [
    {
      pageId: "site-wide",
      pageName: "Site-Wide Opportunities",
      gaps: [
        {
          id: "sw-1",
          topic: "'Why Mineral' Education Page",
          reason:
            "The #1 educational content piece in the sunscreen category. Both research sources flag this as highest priority. Medical sites (Cleveland Clinic, MD Anderson) own it now — Solvyn can differentiate with luxury + hospitality angle + Dr. Weiss authority.",
          action:
            "Create a dedicated 'Why Mineral' page. Position mineral as skin-first approach. Cite Dr. Weiss credentials. Include hospitality angle (why resorts are switching).",
          priority: "high",
          competitorExample:
            "Supergoop: 'Sun 101' / 'SPF University'; EltaMD: 'Live Freely' blog; COOLA: organic education",
        },
        {
          id: "sw-2",
          topic: "Blog / Education Hub (Discover)",
          reason:
            "Every major competitor has educational content driving organic traffic. Both sources identify this as critical. Ahrefs data shows 12K-18K monthly searches for 'mineral vs chemical sunscreen' alone.",
          action:
            "Launch with 5 foundational articles: (1) Mineral vs chemical sunscreen, (2) Reef-safe regulations for hotels, (3) Zinc oxide benefits, (4) Hawaii Act 104 guide, (5) Sunscreen towel staining — the hidden cost for hotels.",
          priority: "high",
          competitorExample:
            "Supergoop: 'The Bright Side' + 'Suncyclopedia'; Sun Bum: 'Sun Education'; La Roche-Posay: 'Expert Advice'",
        },
        {
          id: "sw-3",
          topic: "FAQ Page",
          reason:
            "Addresses purchase objections and captures long-tail searches. PAA data shows dozens of questions: 'Is mineral sunscreen better?' 'Does it leave white cast?' 'Are packets TSA approved?'",
          action:
            "Create FAQ covering top PAA questions. Schema markup for FAQ rich snippets. Split into D2C questions and B2B questions.",
          priority: "high",
          competitorExample:
            "Kinfield: per-product FAQ pages; Sun Bum: 'Ask the Bum'; La Roche-Posay: skin concern FAQs",
        },
        {
          id: "sw-4",
          topic: "Ingredient Standards / 'What We Never Use' Page",
          reason:
            "20% of US consumers believe traditional sunscreens are toxic. Both Supergoop and COOLA have 1,600+ ingredient exclusion lists. Builds trust with ingredient-conscious consumers.",
          action:
            "Create page listing excluded ingredients (parabens, oxybenzone, octinoxate, etc.) with brief explanations. Include 'What We Use' section highlighting zinc oxide, aloe vera, etc.",
          priority: "medium",
          competitorExample:
            "Supergoop: 1,600+ 'No List'; COOLA: 1,600+ restricted; Cocokind: 'Formula Facts' panels",
        },
        {
          id: "sw-5",
          topic: "Sustainability / Environmental Impact Page",
          reason:
            "73% of hotel guests say sustainability matters. 67% of Millennials/Gen Z prefer eco-labeled amenities. 90% would choose a hotel for green initiatives. Increasingly table stakes.",
          action:
            "Dedicated page: reef-safe formulation, packaging sustainability, environmental commitments, certifications. Use as B2B selling point.",
          priority: "medium",
          competitorExample:
            "COOLA: 'Farm to Face'; Cocokind: carbon labels + 'Sustainability School'; ADA: Cradle to Cradle",
        },
        {
          id: "sw-6",
          topic: "Certifications / Trust Badges Page",
          reason:
            "B2B procurement teams need verification. Consolidating certifications builds credibility for both B2B and D2C.",
          action:
            "List all certs: reef-safe, cruelty-free, dermatologist-tested, any organic/clean certs. Include logos. Add Dr. Weiss medical advisory info.",
          priority: "medium",
          competitorExample:
            "COOLA: PETA, COPA, EcoCert; Vacation: Leaping Bunny; Raw Elements: EWG Verified + Leaping Bunny",
        },
      ],
    },
    {
      pageId: "partners",
      pageName: "Partners (B2B) — Critical Gaps",
      gaps: [
        {
          id: "pa-g1",
          topic: "Mineral Sunscreen for Hospitality — Definitive Guide",
          reason:
            "NOBODY covers this. Both research sources flag as the single biggest content opportunity. Wide open niche with B2B conversion value of $1K-$50K+ per lead.",
          action:
            "Create the definitive long-form guide for hotel procurement officers. Cover: why sunscreen as amenity, mineral vs chemical for guests, hygiene benefits of sealed packets, compliance, ROI.",
          priority: "high",
          competitorExample: "Nobody — Solvyn would be first. Wide open.",
        },
        {
          id: "pa-g2",
          topic: "Stadium / Concert / Event Sunscreen Distribution",
          reason:
            "NOBODY covers this. Ahrefs research identified this as a critical gap. Event organizers have duty-of-care obligations for sun safety at outdoor events.",
          action:
            "Create guide for event organizers: sun safety duty of care, distribution logistics, branded packet opportunities, case study format.",
          priority: "high",
          competitorExample: "Nobody — wide open. Zero dedicated content exists.",
        },
        {
          id: "pa-g3",
          topic: "Sunscreen Amenity ROI Calculator / Case Study",
          reason:
            "Hotel procurement needs quantified business justification. SnappyScreen proves hotels see measurable F&B uplift. No sunscreen brand provides this data in an accessible format.",
          action:
            "Create interactive ROI calculator or downloadable PDF. Inputs: room count, occupancy rate, pool/beach access. Output: guest satisfaction lift, sustainability branding value, cost per room.",
          priority: "high",
          competitorExample:
            "SnappyScreen: quantified ROI ($170K uplift, $26/person/day F&B boost)",
        },
        {
          id: "pa-g4",
          topic: "Regulatory Compliance Content",
          reason:
            "Hotels in Hawaii, Mexico, Caribbean need reef-safe due to local laws. Only consumer-facing pages exist (Sun Bum, Coola). No B2B-focused compliance guide for procurement.",
          action:
            "Create B2B compliance guide by destination. Gated PDF + blog post. Position Solvyn as the compliance solution for hospitality.",
          priority: "high",
        },
        {
          id: "pa-g5",
          topic: "Sunscreen Towel Staining — The Hidden Cost",
          reason:
            "Unique B2B angle found by Ahrefs research. Only scattered forum mentions exist. Mineral sunscreen stains less than chemical. Direct cost savings for hotel housekeeping.",
          action:
            "Create data-backed article: 'Mineral vs Chemical Sunscreen Staining: What Hotels Need to Know.' Include laundry cost data, stain comparison, housekeeping ROI.",
          priority: "high",
          competitorExample: "Nobody — only scattered forum mentions. Solvyn would be first.",
        },
        {
          id: "pa-g6",
          topic: "Case Studies / Hotel Testimonials",
          reason:
            "B2B buyers need social proof. Most competitors lack hotel-specific case studies.",
          action:
            "Create case study template. As partnerships develop, publish 'How [Hotel] Enhanced Guest Experience with Solvyn.'",
          priority: "medium",
          competitorExample:
            "Project Reef: Four Seasons Maui; SunKiss: 23+ hotel partnerships",
        },
        {
          id: "pa-g7",
          topic: "Custom Branding / White-Label Options",
          reason:
            "Hotels want branded amenities. Italtrim and ADA offer white-label for bath products. No sunscreen brand offers this specifically.",
          action:
            "Add 'Custom Branding' section showing co-branded packet options. Include mockups.",
          priority: "medium",
          competitorExample: "Italtrim: customizable white-label; ADA: tiered brand approach",
        },
      ],
    },
    {
      pageId: "shield",
      pageName: "Shield (Product)",
      gaps: [
        {
          id: "sh-g1",
          topic: "Ingredient Transparency Section",
          reason:
            "Brands like Badger and Babo rank for ingredient queries by leading with transparency. Consumer trust depends on knowing what's inside. Cocokind's 'Formula Facts' panels show exact concentrations.",
          action:
            "Add prominent ingredients section to product page. Highlight zinc oxide, aloe vera, premium ingredients with brief benefits for each.",
          priority: "high",
          competitorExample:
            "Cocokind: 'Formula Facts' panels; EltaMD: zinc oxide in every product",
        },
        {
          id: "sh-g2",
          topic: "Format Comparison — Why Single-Use Packets",
          reason:
            "No competitor explains WHY packets are better. PAA: 'How much sunscreen is in a single packet?' 'Are sunscreen packets TSA approved?' This content captures high-intent format queries.",
          action:
            "Add section: precise SPF dosing, hygienic (no shared tubes), TSA-friendly, less waste than half-used bottles, portability.",
          priority: "high",
        },
        {
          id: "sh-g3",
          topic: "Dermatologist Endorsement / Dr. Weiss Feature",
          reason:
            "Dermatologist recommendations dominate sensitive skin and best sunscreen searches. Dr. Eduardo Weiss provides genuine E-E-A-T authority. None of top results feature sachet format.",
          action:
            "Feature Dr. Weiss prominently. Add 'dermatologist-approved' badge. Create authored content under his name for E-E-A-T signals.",
          priority: "high",
          competitorExample:
            "EltaMD: '#1 Dermatologist-Recommended'; La Roche-Posay: dermatologist-recommended",
        },
      ],
    },
    {
      pageId: "discover",
      pageName: "Discover (Education Hub)",
      gaps: [
        {
          id: "di-g1",
          topic: "Reef-Safe Regulations Guide (B2B + D2C)",
          reason:
            "The intersection of reef-safe regulations and hospitality is poorly served. Hotels need this info but no brand creates B2B-focused content. Both research sources flag as highest priority educational content.",
          action:
            "Comprehensive guide: 'Reef-Safe Sunscreen Laws by Destination' — Hawaii Act 104, Mexico, Caribbean, Palau, USVI. Include implications for hotel procurement + traveler tips.",
          priority: "high",
          competitorExample:
            "Sun Bum: Hawaii Act 104 page (consumer-only); Stream2Sea: Palau approval; Coola: Hawaii compliance",
        },
        {
          id: "di-g2",
          topic: "'Why Hotels Are Switching to Mineral' Article",
          reason:
            "Serves dual purpose: SEO targeting hotel procurement + educational content for conscious consumers. Zero competition. Both sources agree this is unique to Solvyn.",
          action:
            "Write article with regulatory, environmental, and guest experience angles. Include data on staining reduction, reef compliance, guest satisfaction.",
          priority: "high",
        },
        {
          id: "di-g3",
          topic: "UV Protection for High-Activity Environments",
          reason:
            "Only fitness/outdoor sites cover this. Position Shield for gyms, pools, outdoor venues, festivals. Addresses B2B event planner needs.",
          action:
            "Blog post series targeting venue operators. Stadium sun safety, pool deck protection, outdoor festival distribution.",
          priority: "medium",
          competitorExample: "Nobody covers this for venue/event operators.",
        },
        {
          id: "di-g4",
          topic: "Best Reef-Safe Sunscreen 2026 Roundup",
          reason:
            "Seasonal content opportunity. Major publications publish these annually. Getting Shield included in roundups is critical. Having Solvyn's own roundup establishes authority.",
          action:
            "Publish roundup timed for spring 2026 (March-April) to be indexed before May-June peak. Include Shield with disclosure.",
          priority: "medium",
        },
        {
          id: "di-g5",
          topic: "Ingredient Glossary (Simplified Suncyclopedia)",
          reason:
            "Supergoop's Suncyclopedia builds authority and captures long-tail searches. No other brand has replicated this effectively.",
          action:
            "Create 'Sun Protection Glossary' covering: zinc oxide, broad spectrum, UVA/UVB, SPF ratings, reef-safe vs reef-friendly, oxybenzone, octinoxate.",
          priority: "low",
          competitorExample: "Supergoop: 'Suncyclopedia' A-to-Z glossary",
        },
      ],
    },
    {
      pageId: "about",
      pageName: "About",
      gaps: [
        {
          id: "ab-g1",
          topic: "Brand Story — Dr. Weiss + Founders Narrative",
          reason:
            "Every successful brand has a compelling origin story. Dr. Eduardo Weiss provides the dermatologist authority angle. Founder stories create emotional connection critical for luxury positioning.",
          action:
            "Feature Dr. Weiss credentials prominently (E-E-A-T). Include founder bios (Chaim Cohen, Mark Caraher). Tell the 'why' story — why Solvyn exists.",
          priority: "high",
          competitorExample:
            "Bask: skin cancer loss story; Project Reef: hospitality veteran; Raw Elements: 25-year lifeguard",
        },
        {
          id: "ab-g2",
          topic: "Medical Advisory Board / Science Page",
          reason:
            "Dr. Weiss endorsement is a competitive advantage that no B2B hospitality competitor has. E-E-A-T signals are critical for health/science content rankings.",
          action:
            "Create Medical Advisory section. Dr. Weiss bio, credentials, authored quotes. Optionally: link to authored Discover articles.",
          priority: "high",
          competitorExample:
            "EltaMD: Destination Healthy Skin sponsorship; La Roche-Posay: dermatologist authority hub",
        },
      ],
    },
    {
      pageId: "homepage",
      pageName: "Homepage",
      gaps: [
        {
          id: "hp-g1",
          topic: "Social Proof / As Seen In / Trust Signals",
          reason:
            "Competitor homepages display hotel partnerships, press logos, derm endorsements. Trust signals are critical for both B2B (procurement) and D2C (purchase confidence).",
          action:
            "Add 'Trusted By' section with hotel partner logos once established. Add 'Dermatologist-Trusted' badge with Dr. Weiss. Add B2B CTA prominently.",
          priority: "high",
          competitorExample:
            "SunKiss: '23+ leading hotels'; SnappyScreen: Four Seasons, Rosewood, Marriott logos",
        },
        {
          id: "hp-g2",
          topic: "Dual-Audience CTA (B2B + D2C)",
          reason:
            "Solvyn serves both hospitality B2B and conscious consumers. Homepage must route both audiences efficiently. Claude.ai research specifically notes this.",
          action:
            "Include clear B2B CTA ('Partner With Us') alongside D2C path. Both above the fold.",
          priority: "medium",
        },
      ],
    },
  ],
};
