import type { ContentPage } from "@/lib/content-types";

export const websiteContent: ContentPage[] = [
  // ─────────────────────────────────────────────
  // HOMEPAGE
  // ─────────────────────────────────────────────
  {
    id: "homepage",
    name: "Homepage",
    description: "7 sections — brand awareness, product intro, trust signals, and B2B conversion.",
    sections: [
      {
        id: "hp-s1",
        name: "S1: Hero",
        blocks: [
          {
            id: "hp-s1-headline",
            type: "heading",
            label: "Headline",
            text: "Sun Protection Your Guests Will Actually Trust",
          },
          {
            id: "hp-s1-subheadline",
            type: "subheading",
            label: "Subheadline",
            text: "Clean, dermatologist-trusted mineral sunscreen — designed for hotels, resorts, stadiums, events, and everyday sun exposure.",
          },
          {
            id: "hp-s1-body",
            type: "body",
            label: "Body Copy",
            text: "Shield by Solvyn solves a simple but overlooked problem: people need sunscreen most in the moments they don't plan for. A sealed, single-use mineral SPF designed to be trusted, hygienic, and effortless — so protection actually happens.",
          },
          {
            id: "hp-s1-moments",
            type: "badge",
            label: "Moments Bar",
            text: "Display as horizontal strip or ticker",
            items: [
              "Hotels",
              "Stadiums",
              "Resorts",
              "Events",
              "Gyms",
              "Travel",
            ],
            note: "Visual bar showing where Shield fits into real life",
          },
          {
            id: "hp-s1-cta-b2b",
            type: "cta",
            label: "CTA — B2B (Primary)",
            text: "Request a Sample Kit",
            note: "Links to /contact or scrolls to partner section",
          },
          {
            id: "hp-s1-cta-dtc",
            type: "cta",
            label: "CTA — DTC (Secondary)",
            text: "Join the Waitlist",
            note: "Links to footer waitlist or /waitlist",
          },
        ],
      },
      {
        id: "hp-s2",
        name: "S2: Our Mission",
        blocks: [
          {
            id: "hp-s2-headline",
            type: "heading",
            label: "Headline",
            text: "Simplifying Sun Protection for Real Life",
          },
          {
            id: "hp-s2-body",
            type: "body",
            label: "Body",
            text: "Solvyn was created to solve an overlooked reality: sun exposure happens everywhere — but sunscreen isn't always available, trusted, or convenient.",
          },
          {
            id: "hp-s2-values",
            type: "list",
            label: "We believe protection should be:",
            text: "We believe protection should be:",
            items: [
              "Easy to access",
              "Safe for sensitive skin",
              "Hygienic in shared environments",
              "Responsible to the planet",
            ],
          },
          {
            id: "hp-s2-bridge",
            type: "body",
            label: "Bridge Line",
            text: "Shield by Solvyn bridges the gap between clinical-grade protection and real-world convenience.",
          },
          {
            id: "hp-s2-closing",
            type: "body",
            label: "Closing Line",
            text: "Healthy skin should be accessible.",
            note: "No CTA in this section — the words do the work here",
          },
        ],
      },
      {
        id: "hp-s3",
        name: "S3: Product Intro — Shield",
        blocks: [
          {
            id: "hp-s3-headline",
            type: "heading",
            label: "Headline",
            text: "Shield by Solvyn",
          },
          {
            id: "hp-s3-subheadline",
            type: "subheading",
            label: "Subheadline",
            text: "Mineral protection. No compromises.",
          },
          {
            id: "hp-s3-body",
            type: "body",
            label: "Description",
            text: "Shield is a 100% mineral, broad-spectrum SPF formulated with non-nano zinc oxide and packaged in a sealed, single-use pouch. It delivers immediate protection without chemical absorption, irritation, or unnecessary additives. Designed for high-exposure environments — not bathroom shelves.",
          },
          {
            id: "hp-s3-badges",
            type: "badge",
            label: "Key Attributes",
            text: "Display as compact badges or minimal grid",
            items: [
              "FDA Broad Spectrum SPF",
              "100% Mineral (Non-Nano Zinc Oxide)",
              "Hypoallergenic & Dermatologist Approved",
              "Reef-Safe & Hawai'i Act 104 Compliant",
              "Heat-Stable for Outdoor Use",
              "Single-Use, Sealed & Tamper-Proof",
            ],
          },
          {
            id: "hp-s3-cta",
            type: "cta",
            label: "CTA",
            text: "Explore Shield",
            note: "Links to /shield product page",
          },
        ],
      },
      {
        id: "hp-s4",
        name: "S4: Why Solvyn",
        blocks: [
          {
            id: "hp-s4-headline",
            type: "heading",
            label: "Headline",
            text: "Why Solvyn",
          },
          {
            id: "hp-s4-supporting",
            type: "body",
            label: "Opening Line",
            text: "Solvyn wasn't created to add another sunscreen to the shelf. It was created to fix why people avoid using sunscreen in the first place.",
          },
          {
            id: "hp-s4-point1",
            type: "step",
            label: "Value Point 1",
            text: "Protection only works if people actually use it",
            items: ["Shield is designed to feel comfortable, lightweight, and easy to wear — so sunscreen becomes something you reach for, not something you avoid."],
          },
          {
            id: "hp-s4-point2",
            type: "step",
            label: "Value Point 2",
            text: "Convenience removes friction",
            items: ["Solvyn fits into real moments — on-the-go, poolside, traveling, or in your bag — making reapplication simple and effortless."],
          },
          {
            id: "hp-s4-point3",
            type: "step",
            label: "Value Point 3",
            text: "Sensitive skin deserves better",
            items: ["Shield is clinically tested, dermatologist approved, hypoallergenic, and suitable for sensitive skin."],
          },
          {
            id: "hp-s4-point4",
            type: "step",
            label: "Value Point 4",
            text: "\"Clean\" should also mean effective",
            items: ["Every Solvyn formula is built with intention and guided by dermatology experts — balancing skin comfort, performance, and real-world protection."],
          },
          {
            id: "hp-s4-point5",
            type: "step",
            label: "Value Point 5",
            text: "High-exposure environments demand higher standards",
            items: ["Shield is designed for long days outdoors — beaches, pools, travel, hotels, and everyday sun exposure."],
          },
          {
            id: "hp-s4-stats-headline",
            type: "subheading",
            label: "Skin Cancer Awareness",
            text: "Skin cancer is the #1 cancer in the U.S.",
          },
          {
            id: "hp-s4-stats",
            type: "list",
            label: "Statistics",
            text: "Key statistics",
            items: [
              "1 in 5 Americans will develop skin cancer",
              "9,500 people are diagnosed daily",
              "Up to 90% is preventable with proper sun protection",
            ],
          },
          {
            id: "hp-s4-waste1",
            type: "step",
            label: "Value Point 6",
            text: "Pay for what you use",
            items: ["Why spend $30 on a 6 oz bottle you'll have to throw away at the airport because of TSA liquid limits? Solvyn is right-sized protection."],
          },
          {
            id: "hp-s4-waste2",
            type: "step",
            label: "Value Point 7",
            text: "Eliminate sunscreen waste",
            items: ["Most people buy an overpriced bottle at a stadium, use 10% of it, and then it expires in their car or gets tossed. Shield is protection that matches the moment."],
          },
        ],
      },
      {
        id: "hp-s5",
        name: "S5: Why We Chose Mineral",
        blocks: [
          {
            id: "hp-s5-headline",
            type: "heading",
            label: "Headline",
            text: "Why We Chose Mineral Sunscreen",
          },
          {
            id: "hp-s5-intro",
            type: "body",
            label: "Opening",
            text: "When we set out to create Shield, we asked a simple question: How should sunscreen work on your skin? There are two ways sunscreen provides protection — some formulas absorb UV rays into the skin, others block the sun before it reaches you. We chose mineral protection because it's the more respectful, skin-first approach — a sunscreen that sits on your skin, not in it.",
          },
          {
            id: "hp-s5-benefit1",
            type: "step",
            label: "Benefit 1",
            text: "Immediate protection",
            items: ["Protection begins the moment you apply it — no waiting period before going outside."],
          },
          {
            id: "hp-s5-benefit2",
            type: "step",
            label: "Benefit 2",
            text: "Works like a physical shield",
            items: ["Reflects UV rays away instead of absorbing them into your skin, creating a protective barrier on the surface."],
          },
          {
            id: "hp-s5-benefit3",
            type: "step",
            label: "Benefit 3",
            text: "Broad-spectrum coverage",
            items: ["Naturally protects against both UVA (aging) and UVB (burning) rays, helping prevent sunburn and long-term skin damage."],
          },
          {
            id: "hp-s5-benefit4",
            type: "step",
            label: "Benefit 4",
            text: "Gentler on sensitive skin",
            items: ["Widely recommended by dermatologists for reactive, post-sun, and easily irritated skin. Feels calmer and more comfortable for daily use."],
          },
          {
            id: "hp-s5-benefit5",
            type: "step",
            label: "Benefit 5",
            text: "Less eye stinging",
            items: ["Especially during workouts, swimming, or sweating — mineral formulas are typically gentler around the eyes."],
          },
          {
            id: "hp-s5-benefit6",
            type: "step",
            label: "Benefit 6",
            text: "Designed for long days outdoors",
            items: ["Ideal for beach days, pool days, travel, and outdoor events where sunscreen stays on your skin for hours."],
          },
          {
            id: "hp-s5-benefit7",
            type: "step",
            label: "Benefit 7",
            text: "Skin-respecting formula",
            items: ["No heavy scent, no greasy finish — just protection that works with your skin, not against it."],
          },
          {
            id: "hp-s5-reef-headline",
            type: "subheading",
            label: "Reef-Safe & Environmental",
            text: "Considering Our Earth — Hawai'i Act 104 Compliant",
          },
          {
            id: "hp-s5-reef-body",
            type: "body",
            label: "Environmental Commitment",
            text: "Shield uses 17.5% non-nano zinc oxide, a mineral UV filter that reflects ultraviolet rays rather than absorbing them into the skin or water. By avoiding restricted chemical filters altogether, Solvyn meets Hawai'i Act 104 requirements, supports reef-safe initiatives, reduces environmental exposure risk, and aligns with ESG and sustainability standards for hospitality and events.",
          },
          {
            id: "hp-s5-advisory-heading",
            type: "subheading",
            label: "Medical Advisory",
            text: "Dr. Eduardo Weiss, MD",
          },
          {
            id: "hp-s5-advisory-creds",
            type: "body",
            label: "Credentials",
            text: "Board-Certified Dermatologist | Fellow, American Academy of Dermatology | 30+ years of clinical experience | Clinical Associate Professor at FIU | Clinical Professor at University of Miami Miller School of Medicine | Director of the Cosmetic Fellowship at Hollywood Dermatology and Cosmetic Surgery Specialists",
          },
          {
            id: "hp-s5-advisory-quote",
            type: "body",
            label: "Positioning Line",
            text: "His guidance ensures Solvyn meets the highest standards of dermatologic safety and efficacy.",
          },
          {
            id: "hp-s5-certs",
            type: "badge",
            label: "Certifications",
            text: "Display as horizontal row of badges or seals",
            items: [
              "Dermatologist Approved",
              "FDA Broad Spectrum",
              "Hawai'i Act 104 Compliant",
              "Reef-Safe",
              "Hypoallergenic",
            ],
          },
          {
            id: "hp-s5-partners",
            type: "list",
            label: "Endorsed By",
            text: "Our Growing Network",
            items: [
              "Hollywood Dermatology and Cosmetic Surgery Specialists",
              "American Society for Mohs Surgery",
            ],
            note: "Add hotel/venue partner logos as they finalize",
          },
        ],
      },
      {
        id: "hp-s6",
        name: "S6: Why Hotels, Resorts & Venues Choose Solvyn",
        blocks: [
          {
            id: "hp-s6-headline",
            type: "heading",
            label: "Headline",
            text: "A Smarter Sunscreen Solution for Hospitality & Events",
          },
          {
            id: "hp-s6-intro",
            type: "body",
            label: "Intro",
            text: "Solvyn is a strategic choice for hotels, resorts, stadiums, and outdoor venues because it improves hygiene, elevates guest satisfaction, and supports sustainability goals — all through one simple amenity.",
          },
          {
            id: "hp-s6-clinical",
            type: "body",
            label: "Clinical Validation",
            text: "Dermatologist-formulated and clinically validated. Unlike generic hotel bulk-buys, Solvyn was developed with leading dermatologists and clinically tested on 100+ volunteers with a 0% irritation rate. This removes the liability of guest allergic reactions common with chemical sunscreens.",
            note: "Key differentiator — display prominently",
          },
          {
            id: "hp-s6-sub1-headline",
            type: "subheading",
            label: "Section 1 — Hygiene",
            text: "1. Superior Hygiene & Operational Control",
          },
          {
            id: "hp-s6-sub1-stat",
            type: "body",
            label: "Contamination Stat",
            text: "A study conducted on behalf of Clean the World found that up to 76% of refillable dispensers in hotels yielded bacterial counts high enough to be considered a health risk.",
            note: "Display as callout stat block — this is a powerful data point",
          },
          {
            id: "hp-s6-sub1-points",
            type: "list",
            label: "Hygiene Benefits",
            text: "For venues that already offer sunscreen, Solvyn represents a significant hygiene upgrade:",
            items: [
              "Tamper-proof & sterile — each pouch is hermetically sealed, ensuring the product remains sterile and effective until the moment of use",
              "Reduced cross-contamination — single-use sachets eliminate shared touchpoints in high-traffic environments such as pools, locker rooms, stadium concourses, and festival grounds",
              "Mess-free maintenance — no dripping pumps, greasy counters, or deck residue — reducing housekeeping and janitorial workload while keeping guest areas clean",
            ],
          },
          {
            id: "hp-s6-sub2-headline",
            type: "subheading",
            label: "Section 2 — Guest Satisfaction",
            text: "2. Boosting Guest & Attendee Satisfaction",
          },
          {
            id: "hp-s6-sub2-points",
            type: "list",
            label: "Guest Experience",
            text: "For venues that don't currently offer sunscreen, Solvyn delivers a high-impact guest experience with minimal operational effort:",
            items: [
              "The \"unexpected care\" moment — guests frequently forget sunscreen or face liquid travel restrictions. Providing a dermatologist-trusted mineral SPF creates a genuine \"save the day\" experience that guests remember and talk about",
              "Premium perception — mineral-grade sunscreen signals wellness, safety, and quality — aligning venues with modern luxury and health-conscious standards",
              "Portable & practical — guests can take protection to the beach, seats, excursions, or departure — extending the venue experience beyond the property",
            ],
          },
          {
            id: "hp-s6-sub3-headline",
            type: "subheading",
            label: "Section 3 — Stadiums & Events",
            text: "3. Stadiums, Festivals & Outdoor Events",
          },
          {
            id: "hp-s6-sub3-body",
            type: "body",
            label: "Events Copy",
            text: "Shield is uniquely suited for large-scale outdoor environments where sun exposure is unavoidable. Ideal for stadiums, concerts, marathons, tournaments, festivals, and corporate outdoor events. Easy distribution. Helps reduce medical complaints related to sunburn and prolonged sun exposure. Enhances duty-of-care standards for organizers, sponsors, and operators.",
          },
          {
            id: "hp-s6-sub4-headline",
            type: "subheading",
            label: "Section 4 — Environmental & Cost",
            text: "4. Environmental & Cost Benefits",
          },
          {
            id: "hp-s6-sub4-points",
            type: "list",
            label: "Cost & Environmental Benefits",
            text: "Benefits beyond guest experience:",
            items: [
              "Reef-safe & regulation compliant — Solvyn meets strict environmental regulations, including Hawai'i Act 104, helping venues remain compliant and environmentally responsible",
              "Reduced linen & towel staining — chemical sunscreens often react with minerals in water, causing yellow staining on towels and uniforms. Mineral-based formulas like Solvyn significantly reduce staining, extending linen lifespan and lowering replacement and laundry costs",
            ],
          },
          {
            id: "hp-s6-cta",
            type: "cta",
            label: "CTA",
            text: "Request a Sample Kit",
            note: "Prominent button — links to contact form or /partners page",
          },
        ],
      },
      {
        id: "hp-s7",
        name: "S7: Footer / Closing CTA",
        blocks: [
          {
            id: "hp-s7-dtc-headline",
            type: "heading",
            label: "DTC Waitlist Headline",
            text: "Be the First to Try Shield at Home",
          },
          {
            id: "hp-s7-dtc-subline",
            type: "subheading",
            label: "DTC Subline",
            text: "We're launching direct-to-consumer soon. Leave your email — we'll let you know.",
          },
          {
            id: "hp-s7-dtc-cta",
            type: "cta",
            label: "DTC CTA",
            text: "Join Waitlist",
            note: "Email input field + button",
          },
          {
            id: "hp-s7-b2b-link",
            type: "cta",
            label: "B2B Reminder",
            text: "Run a hotel, resort, or venue? Let's talk.",
          },
          {
            id: "hp-s7-nav",
            type: "list",
            label: "Footer Navigation",
            text: "Navigation links",
            items: ["About", "Shield", "Partners", "Discover", "Contact"],
          },
          {
            id: "hp-s7-legal",
            type: "body",
            label: "Legal",
            text: "\u00a9 2025 Solvyn. All rights reserved. | Privacy Policy | Terms",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // SHIELD PRODUCT PAGE
  // ─────────────────────────────────────────────
  {
    id: "shield",
    name: "Shield",
    description: "Full product page — hero, key attributes, ingredients, clean commitments, how-to-use, and CTA.",
    sections: [
      {
        id: "shield-hero",
        name: "Hero",
        blocks: [
          {
            id: "shield-hero-headline",
            type: "heading",
            label: "Headline",
            text: "Shield by Solvyn",
          },
          {
            id: "shield-hero-subheadline",
            type: "subheading",
            label: "Subheadline",
            text: "Mineral protection. No compromises.",
          },
          {
            id: "shield-hero-body",
            type: "body",
            label: "Body",
            text: "Designed for high-exposure environments — not bathroom shelves.",
          },
          {
            id: "shield-hero-cta1",
            type: "cta",
            label: "CTA 1",
            text: "Request a Conversation",
          },
          {
            id: "shield-hero-cta2",
            type: "cta",
            label: "CTA 2",
            text: "View Full Ingredient List",
          },
        ],
      },
      {
        id: "shield-attributes",
        name: "Key Attributes",
        blocks: [
          {
            id: "shield-attr-label",
            type: "subheading",
            label: "Section Label",
            text: "Key Attributes",
          },
          {
            id: "shield-attr-heading",
            type: "heading",
            label: "Heading",
            text: "Premium Protection",
          },
          {
            id: "shield-attr-list",
            type: "badge",
            label: "Attributes (6)",
            text: "Display as grid or badge row",
            items: [
              "FDA Broad Spectrum SPF",
              "100% Mineral (Non-Nano Zinc Oxide)",
              "Hypoallergenic & Dermatologist Approved",
              "Reef-Safe & Hawaii Act 104 Compliant",
              "Heat-Stable for Outdoor Use",
              "Single-Use, Sealed & Tamper-Proof",
            ],
          },
        ],
      },
      {
        id: "shield-transparency",
        name: "Transparency / Clean Commitments",
        blocks: [
          {
            id: "shield-trans-label",
            type: "subheading",
            label: "Section Label",
            text: "Transparency Matters",
          },
          {
            id: "shield-trans-heading",
            type: "heading",
            label: "Heading",
            text: "Clean Means Clear",
          },
          {
            id: "shield-trans-body",
            type: "body",
            label: "Body",
            text: "Solvyn is committed to honest formulas and full transparency.",
          },
          {
            id: "shield-trans-commitments",
            type: "list",
            label: "Clean Commitments",
            text: "What we leave out",
            items: [
              "No parabens",
              "No oxybenzone",
              "No octinoxate",
              "No artificial fragrance",
            ],
          },
          {
            id: "shield-trans-closing",
            type: "body",
            label: "Closing Line",
            text: "Just ingredients that work — backed by dermatology.",
          },
          {
            id: "shield-trans-cta",
            type: "cta",
            label: "CTA",
            text: "View Full Ingredient List (INCI)",
          },
        ],
      },
      {
        id: "shield-ingredients",
        name: "Featured Ingredients",
        blocks: [
          {
            id: "shield-ing-label",
            type: "subheading",
            label: "Section Label",
            text: "Featured Ingredients",
          },
          {
            id: "shield-ing-heading",
            type: "heading",
            label: "Heading",
            text: "Thoughtfully Chosen. Dermatologist-Rooted.",
          },
          {
            id: "shield-ing-1",
            type: "step",
            label: "Ingredient 1",
            text: "Zinc Oxide (17.5%)",
            items: ["Non-nano mineral UV protection providing broad-spectrum UVA and UVB defense."],
          },
          {
            id: "shield-ing-2",
            type: "step",
            label: "Ingredient 2",
            text: "Aloe Vera Leaf Juice",
            items: ["Soothing hydration to help comfort sun-exposed skin."],
          },
          {
            id: "shield-ing-3",
            type: "step",
            label: "Ingredient 3",
            text: "Green Tea Extract",
            items: ["Antioxidant protection against environmental stressors."],
          },
          {
            id: "shield-ing-4",
            type: "step",
            label: "Ingredient 4",
            text: "Vitamin E (Tocopherol)",
            items: ["Supports the skin barrier while defending against free-radical damage."],
          },
          {
            id: "shield-ing-5",
            type: "step",
            label: "Ingredient 5",
            text: "Avocado Oil",
            items: ["Nourishing plant lipid that softens and conditions the skin."],
          },
          {
            id: "shield-ing-6",
            type: "step",
            label: "Ingredient 6",
            text: "Shea Butter",
            items: ["Barrier-supporting moisture without heaviness."],
          },
          {
            id: "shield-ing-7",
            type: "step",
            label: "Ingredient 7",
            text: "Mango Seed Butter",
            items: ["Lightweight hydration for a smooth, non-greasy finish."],
          },
        ],
      },
      {
        id: "shield-howto",
        name: "How to Use",
        blocks: [
          {
            id: "shield-howto-label",
            type: "subheading",
            label: "Section Label",
            text: "Application",
          },
          {
            id: "shield-howto-heading",
            type: "heading",
            label: "Heading",
            text: "How to Use Shield",
          },
          {
            id: "shield-howto-sub",
            type: "body",
            label: "Subheading",
            text: "Four simple steps to complete protection",
          },
          {
            id: "shield-howto-step1",
            type: "step",
            label: "Step 1",
            text: "Prep",
            items: ["Apply after your morning skincare routine, before makeup."],
          },
          {
            id: "shield-howto-step2",
            type: "step",
            label: "Step 2",
            text: "Apply",
            items: ["Squeeze entire pouch contents and apply evenly to face and neck."],
          },
          {
            id: "shield-howto-step3",
            type: "step",
            label: "Step 3",
            text: "Protect",
            items: ["Reapply every 2 hours or after swimming, sweating, or towel drying."],
          },
          {
            id: "shield-howto-step4",
            type: "step",
            label: "Step 4",
            text: "Enjoy",
            items: ["Live your life with confidence and complete protection."],
          },
        ],
      },
      {
        id: "shield-cta",
        name: "Closing CTA",
        blocks: [
          {
            id: "shield-cta-heading",
            type: "heading",
            label: "Heading",
            text: "Ready to experience mineral protection?",
          },
          {
            id: "shield-cta-body",
            type: "body",
            label: "Body",
            text: "Connect with us to learn more about Solvyn Shield and how it can transform your sun protection routine.",
          },
          {
            id: "shield-cta-btn",
            type: "cta",
            label: "CTA",
            text: "Request a Conversation",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ABOUT US
  // ─────────────────────────────────────────────
  {
    id: "about",
    name: "About Us",
    description: "Company story, founders, medical advisory board, sustainability, and trust signals.",
    sections: [
      {
        id: "about-hero",
        name: "Hero",
        blocks: [
          {
            id: "about-hero-label",
            type: "subheading",
            label: "Label",
            text: "About Solvyn",
          },
          {
            id: "about-hero-heading",
            type: "heading",
            label: "Heading",
            text: "Created to Fill a Real Gap",
          },
          {
            id: "about-hero-body",
            type: "body",
            label: "Body",
            text: "Most people don't carry sunscreen when they need it most. Solvyn bridges that gap with a clean, single-use solution designed for real life and real environments.",
          },
        ],
      },
      {
        id: "about-origin",
        name: "Why Solvyn Was Created",
        blocks: [
          {
            id: "about-origin-label",
            type: "subheading",
            label: "Label",
            text: "The Beginning",
          },
          {
            id: "about-origin-heading",
            type: "heading",
            label: "Heading",
            text: "Why Solvyn Was Created",
          },
          {
            id: "about-origin-p1",
            type: "step",
            label: "The Dermatologist's Perspective",
            text: "The Dermatologist's Perspective",
            items: ["I grew up in a family of dermatologists. My dinner table conversations weren't just about business — they were about the preventable horror stories my family saw in the clinic every single day."],
          },
          {
            id: "about-origin-p2",
            type: "step",
            label: "The Easily Avoidable Crisis",
            text: "The Easily Avoidable Crisis",
            items: ["I realized that 90% of skin damage and skin cancer is entirely avoidable, yet 1 in 5 Americans will still face a diagnosis. The gap wasn't a lack of education; it was a lack of access."],
          },
          {
            id: "about-origin-p3",
            type: "step",
            label: "The \"Moment of Need\" Problem",
            text: "The \"Moment of Need\" Problem",
            items: ["People don't skip sunscreen because they don't care — they skip it because life happens unexpectedly. You're at the pool, a stadium, or a beach club, and your sunscreen is in a bulky bottle back in the room or at home."],
          },
          {
            id: "about-origin-p4",
            type: "step",
            label: "The Hygiene Barrier",
            text: "The Hygiene Barrier",
            items: ["I saw that communal sunscreen pumps at hotels were often contaminated, degraded by heat, or simply untrustworthy. I knew there had to be a cleaner, safer way."],
          },
          {
            id: "about-origin-p5",
            type: "step",
            label: "A New Standard of Access",
            text: "A New Standard of Access",
            items: ["Solvyn was born to bridge that gap. We created a medical-grade, single-use mineral shield that meets you exactly where you are — so that protection is never a second thought."],
          },
          {
            id: "about-origin-vision",
            type: "body",
            label: "Vision",
            text: "Sun protection is only the first step. Our mission is to dismantle the friction of the entire skincare routine. The routine of the future isn't a shelf of bottles — it's a Solvyn strip in your pocket.",
            note: "Forward-looking vision statement",
          },
        ],
      },
      {
        id: "about-team",
        name: "Founding Team",
        blocks: [
          {
            id: "about-team-label",
            type: "subheading",
            label: "Label",
            text: "Leadership",
          },
          {
            id: "about-team-heading",
            type: "heading",
            label: "Heading",
            text: "Meet the Founders",
          },
          {
            id: "about-team-member1",
            type: "step",
            label: "Founder",
            text: "Chaim Cohen — Founder & CEO",
            items: ["Built Solvyn with a vision of simplifying skincare into something intentional, accessible, and rooted in real-life wellness."],
          },
          {
            id: "about-team-member2",
            type: "step",
            label: "Founding Partner",
            text: "Mark Caraher — Founding Partner & Director of Sales & Marketing",
            items: ["Supports brand development, strategic outreach, and early commercial partnerships."],
          },
        ],
      },
      {
        id: "about-advisory",
        name: "Medical Advisory Board",
        blocks: [
          {
            id: "about-advisory-label",
            type: "subheading",
            label: "Label",
            text: "Clinical Excellence",
          },
          {
            id: "about-advisory-heading",
            type: "heading",
            label: "Heading",
            text: "Medical Advisory Board",
          },
          {
            id: "about-advisory-1",
            type: "step",
            label: "Lead Advisor",
            text: "Dr. Eduardo Weiss, MD",
            items: ["Board-Certified Dermatologist | Fellow, American Academy of Dermatology. An internationally recognized expert in dermatology and Mohs surgery with over 30 years of clinical experience. Born in Caracas, Venezuela, he received his medical degree from Universidad Central de Venezuela and completed his dermatology residency at Jackson Memorial Hospital in Miami, where he served as Chief Resident. Clinical Associate Professor at Florida International University, Clinical Professor at the University of Miami Miller School of Medicine, and Director of the Cosmetic Fellowship at Hollywood Dermatology and Cosmetic Surgery Specialists. His guidance ensures Solvyn meets the highest standards of dermatologic safety and efficacy."],
          },
        ],
      },
      {
        id: "about-sustainability",
        name: "Sustainability & Giving Back",
        blocks: [
          {
            id: "about-sust-heading",
            type: "heading",
            label: "Heading",
            text: "Our Commitments",
          },
          {
            id: "about-sust-env",
            type: "step",
            label: "Sustainability",
            text: "Sustainability Commitment",
            items: ["We use eco-conscious materials and continuously work to reduce waste from large-format bottles and communal dispensers."],
          },
          {
            id: "about-sust-giving",
            type: "list",
            label: "Giving Back",
            text: "A portion of future proceeds will support:",
            items: [
              "Skin cancer research",
              "Community education",
              "Sunscreen access for underserved communities",
            ],
          },
        ],
      },
      {
        id: "about-trust",
        name: "Trust Signals",
        blocks: [
          {
            id: "about-trust-heading",
            type: "heading",
            label: "Heading",
            text: "Trusted & Verified",
          },
          {
            id: "about-trust-badges",
            type: "badge",
            label: "Trust Badges",
            text: "Display as badge grid",
            items: [
              "FDA Broad Spectrum — OTC Monograph",
              "Dermatologist Formulated — Clinical Grade",
              "Hawai'i Act 104 Compliant — Reef Safe",
              "Broad Spectrum SPF 50 — UVA/UVB Protection",
              "Made in USA — Quality Assured",
              "Hypoallergenic — Sensitive Skin Safe",
            ],
          },
          {
            id: "about-trust-endorsed",
            type: "list",
            label: "Endorsed By",
            text: "Endorsed By",
            items: [
              "Hollywood Dermatology and Cosmetic Surgery Specialists",
              "American Society for Mohs Surgery",
            ],
          },
        ],
      },
      {
        id: "about-closing",
        name: "Closing CTA",
        blocks: [
          {
            id: "about-closing-heading",
            type: "heading",
            label: "Heading",
            text: "We are building the future of sun protection — one partnership at a time",
          },
          {
            id: "about-closing-body",
            type: "body",
            label: "Body",
            text: "Whether you are a luxury resort, a wellness spa, an event venue, or a stadium, we would love to partner with you. Together, we can make effective sun protection accessible, convenient, and sustainable.",
          },
          {
            id: "about-closing-cta",
            type: "cta",
            label: "CTA",
            text: "Partner With Solvyn",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // PARTNERS / DISCOVER
  // ─────────────────────────────────────────────
  {
    id: "partners",
    name: "Partners / Discover",
    description: "Partner network showcase and brand discovery content.",
    sections: [
      {
        id: "partners-main",
        name: "Our Growing Network",
        blocks: [
          {
            id: "partners-label",
            type: "subheading",
            label: "Label",
            text: "Trusted By",
          },
          {
            id: "partners-heading",
            type: "heading",
            label: "Heading",
            text: "Our Growing Network",
          },
          {
            id: "partners-body",
            type: "body",
            label: "Body",
            text: "Solvyn partners exclusively with hotels, spas, wellness retreats, resorts, and event venues committed to elevating guest experience through FDA-approved, dermatologist-formulated mineral sunscreen.",
          },
        ],
      },
      {
        id: "partners-amrit",
        name: "Featured Partner",
        blocks: [
          {
            id: "partners-amrit-name",
            type: "heading",
            label: "Partner Name",
            text: "Amrit Resort",
          },
          {
            id: "partners-amrit-badge",
            type: "badge",
            label: "Status",
            text: "Badge label",
            items: ["Founding Partner"],
          },
          {
            id: "partners-amrit-desc",
            type: "body",
            label: "Description",
            text: "Partnering to provide guests with dermatologist-formulated, FDA-approved mineral sunscreen across all wellness and pool areas.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // PRIVACY POLICY
  // ─────────────────────────────────────────────
  {
    id: "privacy-policy",
    name: "Privacy Policy",
    description: "Privacy policy page — data collection, usage, sharing, cookies, and user rights.",
    sections: [
      {
        id: "privacy-intro",
        name: "Introduction",
        blocks: [
          {
            id: "privacy-intro-heading",
            type: "heading",
            label: "Heading",
            text: "Privacy Policy",
          },
          {
            id: "privacy-intro-effective",
            type: "subheading",
            label: "Effective Date",
            text: "Effective Date: March 13, 2026",
          },
          {
            id: "privacy-intro-body",
            type: "body",
            label: "Introduction",
            text: "Solvyn Skin LLC (\"Solvyn,\" \"we,\" \"us,\" or \"our\") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (solvynskin.com), use our services, or interact with us in any way.",
          },
          {
            id: "privacy-intro-scope",
            type: "body",
            label: "Scope",
            text: "This Privacy Policy applies to all information collected through our website, any related services, sales, marketing, or events (collectively, the \"Services\"). By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our Services.",
          },
        ],
      },
      {
        id: "privacy-overview",
        name: "Overview",
        blocks: [
          {
            id: "privacy-overview-heading",
            type: "heading",
            label: "Heading",
            text: "Overview",
          },
          {
            id: "privacy-overview-body",
            type: "body",
            label: "Body",
            text: "Solvyn (\"we,\" \"us,\" or \"our\") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit solvynskin.com, submit an inquiry, join our waitlist, or engage with us as a business partner.",
          },
          {
            id: "privacy-overview-highlight",
            type: "body",
            label: "Highlight",
            text: "We believe transparency is a core ingredient — in our formulas and in how we operate. This policy is written to be read, not just stored.",
            note: "highlight-box",
          },
          {
            id: "privacy-overview-consent",
            type: "body",
            label: "Consent",
            text: "By using our website or providing us with your information, you agree to the practices described in this policy. If you do not agree, please discontinue use of the site.",
          },
        ],
      },
      {
        id: "privacy-collection",
        name: "Information We Collect",
        blocks: [
          {
            id: "privacy-collection-heading",
            type: "heading",
            label: "Heading",
            text: "Information We Collect",
          },
          {
            id: "privacy-collection-personal",
            type: "step",
            label: "Personal Information",
            text: "Personal Information You Provide",
            items: [
              "Contact information: name, email address, phone number, and mailing address (when applicable)",
              "Business information: company name, company location, type of company, job title, and industry",
              "Inquiry details: messages, questions, and any other information you choose to provide when filling out contact forms, requesting sample kits, or submitting partnership inquiries",
              "Any other information you voluntarily provide to us through our website or via email",
            ],
          },
          {
            id: "privacy-collection-auto",
            type: "step",
            label: "Automatically Collected",
            text: "Information Collected Automatically",
            items: [
              "Device information: IP address, browser type and version, operating system, device type, and screen resolution",
              "Usage data: pages visited, time and date of your visit, time spent on pages, clickstream data, referring and exit URLs",
              "Location data: general geographic location based on your IP address (city/region level, not precise location)",
              "Cookies and similar technologies: small data files placed on your device to track usage patterns (see Cookies & Tracking Technologies section below)",
            ],
          },
          {
            id: "privacy-collection-third",
            type: "step",
            label: "Third-Party Information",
            text: "Information from Third Parties",
            items: [
              "Analytics data from Google Analytics, including aggregated website traffic and usage patterns",
              "Information from business partners or hospitality industry contacts who may refer you to us",
            ],
          },
        ],
      },
      {
        id: "privacy-use",
        name: "How We Use Your Information",
        blocks: [
          {
            id: "privacy-use-heading",
            type: "heading",
            label: "Heading",
            text: "How We Use Your Information",
          },
          {
            id: "privacy-use-list",
            type: "list",
            label: "Usage Purposes",
            text: "We use the information we collect to:",
            items: [
              "Respond to inquiries and fulfill sample kit requests",
              "Communicate with business partners and potential hospitality partners",
              "Improve our website, products, and services",
              "Send marketing communications (with your consent)",
              "Comply with legal obligations and protect our rights",
              "Analyze website usage and optimize user experience via Google Analytics",
            ],
          },
        ],
      },
      {
        id: "privacy-legal-basis",
        name: "Legal Basis for Processing",
        blocks: [
          {
            id: "privacy-legal-basis-heading",
            type: "heading",
            label: "Heading",
            text: "Legal Basis for Processing",
          },
          {
            id: "privacy-legal-basis-body",
            type: "body",
            label: "Body",
            text: "We process your personal information based on the following legal grounds:",
          },
          {
            id: "privacy-legal-basis-list",
            type: "list",
            label: "Legal Bases",
            text: "Legal bases for processing:",
            items: [
              "Consent — when you voluntarily submit your information through our contact forms, sample kit requests, or partnership inquiries, you consent to our processing of that information for the stated purposes",
              "Legitimate Interest — we may process your information when it is reasonably necessary to achieve our legitimate business interests, such as improving our website, understanding how our Services are used, and communicating with potential business partners",
              "Legal Obligation — we may process your information when we are legally required to do so, such as in response to a court order, subpoena, or government request",
              "Contractual Necessity — we may process your information as necessary to fulfill a contract or potential business relationship with you",
            ],
          },
        ],
      },
      {
        id: "privacy-sharing",
        name: "Information Sharing",
        blocks: [
          {
            id: "privacy-sharing-heading",
            type: "heading",
            label: "Heading",
            text: "How We Share Your Information",
          },
          {
            id: "privacy-sharing-body",
            type: "body",
            label: "Overview",
            text: "We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We have not sold personal information in the preceding 12 months. We may share your information only in the following limited circumstances:",
          },
          {
            id: "privacy-sharing-list",
            type: "list",
            label: "Sharing Circumstances",
            text: "Sharing circumstances:",
            items: [
              "Service Providers — trusted third parties who assist us in operating our website, hosting our services, and analyzing website usage. This currently includes Google LLC (analytics). These providers are contractually obligated to use your information only as necessary to provide services to us and are prohibited from using it for their own purposes",
              "Legal Requirements — when required by law, regulation, subpoena, court order, or other governmental or legal process",
              "Protection of Rights — when we believe disclosure is necessary to protect our rights, your safety, or the safety of others, investigate fraud, or respond to a government request",
              "Business Transfers — in connection with a merger, acquisition, reorganization, bankruptcy, or sale of all or a portion of our assets, in which case your information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on our website of any change in ownership or uses of your personal information",
              "With Your Consent — when you have given us explicit permission to share your information for a specific purpose",
            ],
          },
        ],
      },
      {
        id: "privacy-cookies",
        name: "Cookies & Tracking",
        blocks: [
          {
            id: "privacy-cookies-heading",
            type: "heading",
            label: "Heading",
            text: "Cookies & Tracking Technologies",
          },
          {
            id: "privacy-cookies-body",
            type: "body",
            label: "Body",
            text: "We use cookies and similar tracking technologies to collect usage information and improve your experience. A cookie is a small data file stored on your device when you visit a website. Cookies help us understand how you interact with our Services so we can improve them.",
          },
          {
            id: "privacy-cookies-types",
            type: "list",
            label: "Types of Cookies",
            text: "We use the following types of cookies:",
            items: [
              "Essential Cookies — necessary for the website to function properly, such as remembering your preferences and enabling basic features like page navigation. These cookies do not collect personal information and cannot be disabled",
              "Analytics Cookies — we use Google Analytics (provided by Google LLC) to understand how visitors interact with our website. These cookies collect information such as pages visited, time spent on pages, general geographic location, referring URLs, browser type, and device information. This data is collected anonymously and is used solely to improve our website and Services. Google Analytics data is processed in accordance with Google's Privacy Policy",
            ],
          },
          {
            id: "privacy-cookies-manage",
            type: "body",
            label: "Managing Cookies",
            text: "You can control and manage cookies through your browser settings. Most browsers allow you to refuse or delete cookies. Please note that disabling cookies may affect the functionality of certain features on our website. You can also opt out of Google Analytics specifically by installing the Google Analytics Opt-out Browser Add-on, available at tools.google.com/dlpage/gaoptout.",
          },
          {
            id: "privacy-cookies-dnt",
            type: "body",
            label: "Do Not Track",
            text: "Some browsers include a \"Do Not Track\" (DNT) feature that signals to websites that you do not want your online activity tracked. Because there is no uniform standard for how DNT signals should be interpreted, our website does not currently respond to DNT browser signals. However, you can opt out of tracking as described above by managing your cookie preferences or using the Google Analytics Opt-out Add-on.",
          },
        ],
      },
      {
        id: "privacy-retention",
        name: "Data Retention",
        blocks: [
          {
            id: "privacy-retention-heading",
            type: "heading",
            label: "Heading",
            text: "Data Retention",
          },
          {
            id: "privacy-retention-body",
            type: "body",
            label: "Body",
            text: "We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. The retention period may vary depending on the context of the processing and our legal obligations.",
          },
          {
            id: "privacy-retention-details",
            type: "list",
            label: "Retention Periods",
            text: "Specifically:",
            items: [
              "Contact form submissions and partnership inquiries are retained for as long as the business relationship is active, plus a reasonable period thereafter to allow for follow-up",
              "Website analytics data collected via Google Analytics is retained according to Google's default data retention settings (currently 14 months)",
              "If you request deletion of your personal information, we will process your request within 45 days, subject to any legal obligations that may require us to retain certain information",
            ],
          },
        ],
      },
      {
        id: "privacy-third-party-links",
        name: "Third-Party Links",
        blocks: [
          {
            id: "privacy-third-party-heading",
            type: "heading",
            label: "Heading",
            text: "Third-Party Links",
          },
          {
            id: "privacy-third-party-body",
            type: "body",
            label: "Body",
            text: "Our website may contain links to third-party websites, services, or content that are not owned or controlled by Solvyn Skin LLC. This includes links to social media platforms such as Instagram. We are not responsible for the privacy practices or the content of these third-party sites. We encourage you to review the privacy policy of every site you visit. This Privacy Policy applies only to our Services and does not apply to any third-party websites or services.",
          },
        ],
      },
      {
        id: "privacy-rights",
        name: "Your Rights",
        blocks: [
          {
            id: "privacy-rights-heading",
            type: "heading",
            label: "Heading",
            text: "Your Rights & Choices",
          },
          {
            id: "privacy-rights-list",
            type: "list",
            label: "Rights",
            text: "Depending on your location, you may have the right to:",
            items: [
              "Access the personal information we hold about you",
              "Request correction of inaccurate information",
              "Request deletion of your personal information",
              "Opt out of marketing communications at any time",
              "Withdraw consent where processing is based on consent",
            ],
          },
          {
            id: "privacy-rights-contact",
            type: "body",
            label: "Contact for Rights",
            text: "To exercise any of these rights, please contact us at info@solvynskin.com. We will respond to your request within a reasonable timeframe and in accordance with applicable law.",
          },
          {
            id: "privacy-rights-communications",
            type: "body",
            label: "Communications Opt-Out",
            text: "If you have provided your phone number through one of our forms, we may use it to contact you regarding your inquiry or partnership request. We will not use your phone number for unsolicited marketing calls or text messages without your express consent. You may opt out of marketing communications at any time by contacting us at info@solvynskin.com or by following the unsubscribe instructions included in any marketing email.",
          },
        ],
      },
      {
        id: "privacy-security",
        name: "Data Security",
        blocks: [
          {
            id: "privacy-security-heading",
            type: "heading",
            label: "Heading",
            text: "Data Security",
          },
          {
            id: "privacy-security-body",
            type: "body",
            label: "Body",
            text: "We take the security of your personal information seriously and implement appropriate technical and organizational measures to protect it against unauthorized access, alteration, disclosure, or destruction. These measures include encrypted data transmission (SSL/TLS), secure hosting infrastructure, access controls that limit who can view personal information, and regular review of our data collection and storage practices.",
          },
          {
            id: "privacy-security-disclaimer",
            type: "body",
            label: "Disclaimer",
            text: "However, no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. In the event of a data breach that affects your personal information, we will notify you and any applicable regulatory authorities as required by law.",
          },
        ],
      },
      {
        id: "privacy-children",
        name: "Children's Privacy",
        blocks: [
          {
            id: "privacy-children-heading",
            type: "heading",
            label: "Heading",
            text: "Children's Privacy",
          },
          {
            id: "privacy-children-body",
            type: "body",
            label: "Body",
            text: "Our website and services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 13, we will take steps to delete it promptly.",
          },
        ],
      },
      {
        id: "privacy-ccpa",
        name: "California Privacy Rights",
        blocks: [
          {
            id: "privacy-ccpa-heading",
            type: "heading",
            label: "Heading",
            text: "California Privacy Rights",
          },
          {
            id: "privacy-ccpa-body",
            type: "body",
            label: "Body",
            text: "If you are a California resident, the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), provides you with additional rights regarding your personal information.",
          },
          {
            id: "privacy-ccpa-categories",
            type: "list",
            label: "CCPA Data Categories",
            text: "In the preceding 12 months, we have collected the following categories of personal information:",
            items: [
              "Identifiers — name, email address, phone number, IP address",
              "Commercial Information — records of services requested, sample kit requests, partnership inquiries",
              "Internet or Network Activity — browsing history on our website, pages visited, interactions with our Services",
              "Geolocation Data — general geographic location derived from IP address (city/region level)",
              "Professional or Employment Information — company name, company location, type of company, job title",
            ],
          },
          {
            id: "privacy-ccpa-rights",
            type: "list",
            label: "CCPA Rights",
            text: "Under the CCPA/CPRA, you have the right to:",
            items: [
              "Right to Know — request that we disclose what personal information we have collected, used, disclosed, and sold about you in the preceding 12 months",
              "Right to Delete — request the deletion of your personal information, subject to certain exceptions",
              "Right to Correct — request correction of inaccurate personal information",
              "Right to Opt Out of Sale or Sharing — we do not sell or share your personal information for cross-context behavioral advertising. No opt-out is necessary",
              "Right to Limit Use of Sensitive Personal Information — we do not collect sensitive personal information as defined by the CCPA",
              "Right to Non-Discrimination — we will not discriminate against you for exercising any of your CCPA rights",
            ],
          },
          {
            id: "privacy-ccpa-contact",
            type: "body",
            label: "CCPA Contact",
            text: "To submit a verifiable consumer request under the CCPA, please contact us at info@solvynskin.com. You may also designate an authorized agent to make a request on your behalf. We will verify your identity before processing your request and respond within 45 days. If we need additional time, we will inform you of the reason and the extension period (up to an additional 45 days).",
          },
        ],
      },
      {
        id: "privacy-governing",
        name: "Governing Law",
        blocks: [
          {
            id: "privacy-governing-heading",
            type: "heading",
            label: "Heading",
            text: "Governing Law",
          },
          {
            id: "privacy-governing-body",
            type: "body",
            label: "Body",
            text: "This Privacy Policy is governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law principles.",
          },
        ],
      },
      {
        id: "privacy-changes",
        name: "Changes & Contact",
        blocks: [
          {
            id: "privacy-changes-heading",
            type: "heading",
            label: "Heading",
            text: "Changes to This Policy",
          },
          {
            id: "privacy-changes-body",
            type: "body",
            label: "Body",
            text: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on our website with a revised effective date.",
          },
          {
            id: "privacy-contact-heading",
            type: "subheading",
            label: "Contact Heading",
            text: "Contact Us",
          },
          {
            id: "privacy-contact-body",
            type: "body",
            label: "Contact Info",
            text: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:",
          },
          {
            id: "privacy-contact-details",
            type: "list",
            label: "Contact Details",
            text: "Contact details:",
            items: [
              "Solvyn Skin LLC",
              "Email: info@solvynskin.com",
              "Website: solvynskin.com",
              "State of Formation: Florida, United States",
            ],
          },
          {
            id: "privacy-contact-response",
            type: "body",
            label: "Response Time",
            text: "We will respond to all privacy-related inquiries within 30 business days.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // TERMS AND CONDITIONS
  // ─────────────────────────────────────────────
  {
    id: "terms-and-conditions",
    name: "Terms & Conditions",
    description: "Terms of use — acceptance, intellectual property, limitation of liability, and governing law.",
    sections: [
      {
        id: "terms-intro",
        name: "Introduction",
        blocks: [
          {
            id: "terms-intro-heading",
            type: "heading",
            label: "Heading",
            text: "Terms & Conditions",
          },
          {
            id: "terms-intro-effective",
            type: "subheading",
            label: "Effective Date",
            text: "Effective Date: March 13, 2026",
          },
          {
            id: "terms-intro-body",
            type: "body",
            label: "Introduction",
            text: "Welcome to solvynskin.com (the \"Website\"), operated by Solvyn Skin LLC (\"Solvyn,\" \"we,\" \"us,\" or \"our\"). By accessing or using our Website, you agree to be bound by these Terms & Conditions (\"Terms\"). If you do not agree with any part of these Terms, you must discontinue use of the Website immediately.",
          },
          {
            id: "terms-intro-scope",
            type: "body",
            label: "Scope",
            text: "These Terms apply to all visitors, users, and others who access or use the Website, including individuals browsing the site, submitting inquiries through our contact forms, requesting sample kits, or engaging with us as potential business partners. These Terms, together with our Privacy Policy, constitute the complete agreement between you and Solvyn Skin LLC regarding your use of the Website.",
          },
          {
            id: "terms-intro-privacy",
            type: "body",
            label: "Privacy Policy Reference",
            text: "Your use of the Website is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using the Website, you acknowledge that you have read and understood our Privacy Policy, which is incorporated into these Terms by reference.",
          },
        ],
      },
      {
        id: "terms-eligibility",
        name: "Eligibility",
        blocks: [
          {
            id: "terms-eligibility-heading",
            type: "heading",
            label: "Heading",
            text: "Eligibility",
          },
          {
            id: "terms-eligibility-body",
            type: "body",
            label: "Body",
            text: "You must be at least 18 years of age to use this Website or submit any information through our contact forms. By using the Website, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are accessing the Website on behalf of a company or other legal entity, you represent and warrant that you have the authority to bind that entity to these Terms, and all references to \"you\" shall refer to both you individually and the entity you represent.",
          },
        ],
      },
      {
        id: "terms-use",
        name: "Use of Website",
        blocks: [
          {
            id: "terms-use-heading",
            type: "heading",
            label: "Heading",
            text: "Use of the Website",
          },
          {
            id: "terms-use-body",
            type: "body",
            label: "Body",
            text: "You may use our Website for lawful purposes only. You agree not to use the Website in any way that violates applicable laws or regulations, or that could harm, disable, or impair the Website or interfere with any other party's use.",
          },
          {
            id: "terms-use-restrictions",
            type: "list",
            label: "Restrictions",
            text: "You agree not to:",
            items: [
              "Reproduce, distribute, or modify any content without our prior written consent",
              "Use automated systems (bots, scrapers) to access the Website",
              "Attempt to gain unauthorized access to any part of the Website",
              "Transmit any viruses, malware, or harmful code",
              "Use the Website for any fraudulent or deceptive purpose",
            ],
          },
        ],
      },
      {
        id: "terms-ip",
        name: "Intellectual Property",
        blocks: [
          {
            id: "terms-ip-heading",
            type: "heading",
            label: "Heading",
            text: "Intellectual Property",
          },
          {
            id: "terms-ip-body",
            type: "body",
            label: "Body",
            text: "All content on this Website — including but not limited to text, graphics, logos, images, photographs, product formulations, trademarks, trade dress, and software — is the property of Solvyn Skin LLC or its licensors and is protected by United States and international copyright, trademark, and other intellectual property laws. \"Solvyn,\" \"Solvyn Skin,\" \"Shield by Solvyn,\" and all associated logos, designs, and trade dress are trademarks or registered trademarks of Solvyn Skin LLC.",
          },
          {
            id: "terms-ip-license",
            type: "body",
            label: "Limited License",
            text: "We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Website for personal, non-commercial purposes. This license does not include the right to collect, aggregate, copy, duplicate, display, or create derivative works from any content on the Website without our prior written consent. Any unauthorized use of our content may violate copyright, trademark, and other applicable laws.",
          },
        ],
      },
      {
        id: "terms-products",
        name: "Product Information",
        blocks: [
          {
            id: "terms-products-heading",
            type: "heading",
            label: "Heading",
            text: "Product Information & Disclaimer",
          },
          {
            id: "terms-products-body",
            type: "body",
            label: "Body",
            text: "We strive to provide accurate and up-to-date product information on our Website, including descriptions, ingredients, SPF ratings, and usage guidelines. However, we do not warrant that product descriptions or other content on the Website is accurate, complete, current, or error-free. Product images are for illustrative purposes only and may differ from the actual product in appearance, packaging, or labeling.",
          },
          {
            id: "terms-products-medical",
            type: "body",
            label: "Medical Disclaimer",
            text: "Solvyn products are cosmetic sunscreen products regulated by the U.S. Food and Drug Administration (FDA). They are not intended to diagnose, treat, cure, or prevent any disease or medical condition. The information provided on this Website does not constitute medical advice. Always read and follow the product label and usage instructions. If you have specific concerns about sun protection, skin sensitivity, allergies, or skin health, consult a qualified healthcare professional or dermatologist before use.",
          },
          {
            id: "terms-products-allergen",
            type: "body",
            label: "Allergen Notice",
            text: "While our products are formulated to be hypoallergenic, individual sensitivities vary. We recommend performing a patch test before first use. Review the full ingredient list on product packaging and discontinue use immediately if irritation occurs. Solvyn Skin LLC is not liable for allergic reactions or skin sensitivities resulting from product use.",
          },
        ],
      },
      {
        id: "terms-inquiries",
        name: "Inquiries & Communications",
        blocks: [
          {
            id: "terms-inquiries-heading",
            type: "heading",
            label: "Heading",
            text: "Inquiries & Communications",
          },
          {
            id: "terms-inquiries-body",
            type: "body",
            label: "Body",
            text: "Our Website provides contact forms, sample kit request forms, and partnership inquiry forms for your convenience. By submitting information through these forms, you represent that all information provided is accurate, current, and complete. We reserve the right to decline or disregard any inquiry at our sole discretion.",
          },
          {
            id: "terms-inquiries-response",
            type: "body",
            label: "Response Disclaimer",
            text: "Submission of an inquiry or sample kit request does not create a binding agreement, contractual obligation, or business relationship between you and Solvyn Skin LLC. We will endeavor to respond to inquiries in a timely manner, but we do not guarantee response times or the availability of sample kits. Any business partnerships or agreements are subject to separate written contracts.",
          },
          {
            id: "terms-inquiries-content",
            type: "body",
            label: "User Content",
            text: "Any information, feedback, ideas, suggestions, or other materials you submit to us through the Website or via email are non-confidential and become the property of Solvyn Skin LLC. We are free to use such materials for any purpose without compensation or attribution to you, unless otherwise agreed in writing.",
          },
        ],
      },
      {
        id: "terms-liability",
        name: "Limitation of Liability",
        blocks: [
          {
            id: "terms-liability-heading",
            type: "heading",
            label: "Heading",
            text: "Limitation of Liability",
          },
          {
            id: "terms-liability-body",
            type: "body",
            label: "Body",
            text: "To the fullest extent permitted by law, Solvyn Skin LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Website or our products. Our total liability shall not exceed the amount you paid to us, if any, in the 12 months preceding the claim.",
          },
        ],
      },
      {
        id: "terms-disclaimer",
        name: "Disclaimer of Warranties",
        blocks: [
          {
            id: "terms-disclaimer-heading",
            type: "heading",
            label: "Heading",
            text: "Disclaimer of Warranties",
          },
          {
            id: "terms-disclaimer-body",
            type: "body",
            label: "Body",
            text: "The Website is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.",
          },
        ],
      },
      {
        id: "terms-indemnification",
        name: "Indemnification",
        blocks: [
          {
            id: "terms-indemnification-heading",
            type: "heading",
            label: "Heading",
            text: "Indemnification",
          },
          {
            id: "terms-indemnification-body",
            type: "body",
            label: "Body",
            text: "You agree to indemnify and hold harmless Solvyn Skin LLC, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Website or violation of these Terms.",
          },
        ],
      },
      {
        id: "terms-thirdparty",
        name: "Third-Party Links",
        blocks: [
          {
            id: "terms-thirdparty-heading",
            type: "heading",
            label: "Heading",
            text: "Third-Party Links",
          },
          {
            id: "terms-thirdparty-body",
            type: "body",
            label: "Body",
            text: "Our Website may contain links to third-party websites. We are not responsible for the content, privacy practices, or availability of these external sites. Accessing third-party links is at your own risk.",
          },
        ],
      },
      {
        id: "terms-governing",
        name: "Governing Law",
        blocks: [
          {
            id: "terms-governing-heading",
            type: "heading",
            label: "Heading",
            text: "Governing Law",
          },
          {
            id: "terms-governing-body",
            type: "body",
            label: "Body",
            text: "These Terms & Conditions shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Miami-Dade County, Florida, and you consent to the personal jurisdiction of such courts.",
          },
          {
            id: "terms-governing-dispute",
            type: "body",
            label: "Dispute Resolution",
            text: "Before initiating any formal legal proceedings, you agree to first contact us at info@solvynskin.com to attempt to resolve the dispute informally. We will endeavor to resolve the matter within thirty (30) days. If the dispute cannot be resolved informally, either party may proceed with legal action in the courts specified above.",
          },
        ],
      },
      {
        id: "terms-severability",
        name: "Severability",
        blocks: [
          {
            id: "terms-severability-heading",
            type: "heading",
            label: "Heading",
            text: "Severability",
          },
          {
            id: "terms-severability-body",
            type: "body",
            label: "Body",
            text: "If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it enforceable, or if modification is not possible, severed from these Terms. The remaining provisions shall continue in full force and effect.",
          },
        ],
      },
      {
        id: "terms-waiver",
        name: "Waiver",
        blocks: [
          {
            id: "terms-waiver-heading",
            type: "heading",
            label: "Heading",
            text: "Waiver",
          },
          {
            id: "terms-waiver-body",
            type: "body",
            label: "Body",
            text: "No waiver of any term or condition of these Terms shall be deemed a further or continuing waiver of such term or any other term. Our failure to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision.",
          },
        ],
      },
      {
        id: "terms-entire",
        name: "Entire Agreement",
        blocks: [
          {
            id: "terms-entire-heading",
            type: "heading",
            label: "Heading",
            text: "Entire Agreement",
          },
          {
            id: "terms-entire-body",
            type: "body",
            label: "Body",
            text: "These Terms, together with our Privacy Policy and any other legal notices published on the Website, constitute the entire agreement between you and Solvyn Skin LLC regarding your use of the Website. These Terms do not govern any separate business agreements, partnership contracts, or commercial arrangements between you and Solvyn Skin LLC, which are subject to their own terms.",
          },
        ],
      },
      {
        id: "terms-changes",
        name: "Changes & Contact",
        blocks: [
          {
            id: "terms-changes-heading",
            type: "heading",
            label: "Heading",
            text: "Changes to These Terms",
          },
          {
            id: "terms-changes-body",
            type: "body",
            label: "Body",
            text: "We reserve the right to update these Terms & Conditions at any time. Changes will be effective immediately upon posting to the Website. Your continued use of the Website after changes are posted constitutes acceptance of the revised Terms.",
          },
          {
            id: "terms-contact-heading",
            type: "subheading",
            label: "Contact Heading",
            text: "Contact Us",
          },
          {
            id: "terms-contact-body",
            type: "body",
            label: "Contact Info",
            text: "If you have any questions, concerns, or requests regarding these Terms & Conditions, please contact us at:",
          },
          {
            id: "terms-contact-details",
            type: "list",
            label: "Contact Details",
            text: "Contact details:",
            items: [
              "Solvyn Skin LLC",
              "Email: info@solvynskin.com",
              "Website: solvynskin.com",
              "State of Formation: Florida, United States",
            ],
          },
        ],
      },
    ],
  },
];
