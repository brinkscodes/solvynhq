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
            text: "Protection That Meets You Where Life Happens",
          },
          {
            id: "hp-s1-subheadline",
            type: "subheading",
            label: "Subheadline",
            text: "Clean, dermatologist-trusted mineral sunscreen — designed for hotels, resorts, events, and everyday sun exposure.",
          },
          {
            id: "hp-s1-cta-b2b",
            type: "cta",
            label: "CTA — B2B (Primary)",
            text: "Request a Conversation",
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
        name: "S2: Brand Mission / Our Philosophy",
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
            text: "Solvyn was created to solve an overlooked reality: sun exposure happens everywhere — but sunscreen isn't always available, trusted, or convenient. We believe protection should be easy to access, safe for sensitive skin, hygienic in shared environments, and responsible to the planet.",
          },
          {
            id: "hp-s2-closing",
            type: "body",
            label: "Closing Line",
            text: "Healthy skin should be accessible — not a luxury.",
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
            text: "Shield is a 100% mineral, broad-spectrum SPF formulated with non-nano zinc oxide and packaged in a sealed, single-use pouch. Designed for high-exposure environments — not bathroom shelves.",
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
              "Sealed & Tamper-Proof",
            ],
          },
          {
            id: "hp-s3-cta",
            type: "cta",
            label: "CTA",
            text: "Learn More",
            note: "Links to /shield product page",
          },
        ],
      },
      {
        id: "hp-s4",
        name: "S4: Why It Matters (Differentiation)",
        blocks: [
          {
            id: "hp-s4-headline",
            type: "heading",
            label: "Headline",
            text: "Solvyn wasn't created to add another sunscreen to the shelf. It was created to fix why people avoid sunscreen in the first place.",
          },
          {
            id: "hp-s4-point1",
            type: "step",
            label: "Value Point 1",
            text: "Protection only works if people use it",
            items: ["Shield is designed to feel comfortable, lightweight, and easy to wear."],
          },
          {
            id: "hp-s4-point2",
            type: "step",
            label: "Value Point 2",
            text: "Convenience removes friction",
            items: ["Fits into real moments — on-the-go, poolside, traveling — making reapplication effortless."],
          },
          {
            id: "hp-s4-point3",
            type: "step",
            label: "Value Point 3",
            text: "Sensitive skin deserves better",
            items: ["Clinically tested, dermatologist approved, hypoallergenic, suitable for sensitive skin."],
          },
          {
            id: "hp-s4-point4",
            type: "step",
            label: "Value Point 4",
            text: "Reef-safe by design",
            items: ["Hawai'i Act 104 compliant. No oxybenzone. No octinoxate. Mineral protection that respects the environment."],
          },
        ],
      },
      {
        id: "hp-s5",
        name: "S5: Trust & Credibility",
        blocks: [
          {
            id: "hp-s5-advisory-heading",
            type: "subheading",
            label: "Sub-block A — Medical Advisory",
            text: "Dr. Eduardo Weiss, MD",
          },
          {
            id: "hp-s5-advisory-creds",
            type: "body",
            label: "Credentials",
            text: "Board-Certified Dermatologist | Fellow, American Academy of Dermatology | 30+ years of clinical experience | Clinical Associate Professor at FIU | Clinical Professor at University of Miami Miller School of Medicine",
          },
          {
            id: "hp-s5-advisory-quote",
            type: "body",
            label: "Positioning Line",
            text: "Dr. Weiss's guidance ensures Solvyn meets the highest standards of dermatologic safety and efficacy.",
          },
          {
            id: "hp-s5-certs",
            type: "badge",
            label: "Sub-block B — Certifications",
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
            label: "Sub-block C — Partners",
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
        name: "S6: B2B Value Proposition",
        blocks: [
          {
            id: "hp-s6-headline",
            type: "heading",
            label: "Headline",
            text: "A Smarter Sunscreen Solution for Hospitality & Events",
          },
          {
            id: "hp-s6-point1",
            type: "step",
            label: "Benefit 1",
            text: "Superior hygiene",
            items: ["Sealed, single-use sachets eliminate shared touchpoints and cross-contamination."],
          },
          {
            id: "hp-s6-point2",
            type: "step",
            label: "Benefit 2",
            text: "Guest satisfaction",
            items: ["The \"save the day\" amenity guests remember and talk about."],
          },
          {
            id: "hp-s6-point3",
            type: "step",
            label: "Benefit 3",
            text: "Operational simplicity",
            items: ["No dripping pumps, no mess, reduced housekeeping workload."],
          },
          {
            id: "hp-s6-point4",
            type: "step",
            label: "Benefit 4",
            text: "Sustainability alignment",
            items: ["Reef-safe, regulation-compliant, supports ESG goals."],
          },
          {
            id: "hp-s6-point5",
            type: "step",
            label: "Benefit 5",
            text: "Cost efficiency",
            items: ["Reduces linen staining from chemical sunscreens, extending towel and uniform lifespan."],
          },
          {
            id: "hp-s6-cta",
            type: "cta",
            label: "CTA",
            text: "Request a Conversation",
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
            text: "Be the first to experience Solvyn at home.",
          },
          {
            id: "hp-s7-dtc-subline",
            type: "subheading",
            label: "DTC Subline",
            text: "Join the waitlist for our upcoming launch.",
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
            text: "Interested in partnering? Let's talk →",
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
            text: "© 2025 Solvyn. All rights reserved. | Privacy Policy | Terms",
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
    description: "Company story, mission pillars, team bios, medical advisory board, sustainability, and trust signals.",
    sections: [
      {
        id: "about-hero",
        name: "Hero",
        blocks: [
          {
            id: "about-hero-label",
            type: "subheading",
            label: "Label",
            text: "Our Story",
          },
          {
            id: "about-hero-heading",
            type: "heading",
            label: "Heading",
            text: "Reimagining Sun Protection For Modern Hospitality",
          },
          {
            id: "about-hero-body",
            type: "body",
            label: "Body",
            text: "Born from a real need and built with purpose. Solvyn delivers FDA-approved, dermatologist-formulated mineral sunscreen to hotels, resorts, spas, and events worldwide.",
          },
        ],
      },
      {
        id: "about-origin",
        name: "Origin Story",
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
            text: "A Problem That Needed Solving",
          },
          {
            id: "about-origin-p1",
            type: "body",
            label: "Paragraph 1",
            text: "It started with a simple observation: guests at luxury hotels, resorts, and spas consistently asked for sunscreen—but rarely found it when they needed it most.",
          },
          {
            id: "about-origin-p2",
            type: "body",
            label: "Paragraph 2",
            text: "By the pool, at outdoor events, during spa treatments. The disconnect was clear. Travelers do not pack sunscreen. Guests forget to bring it. And venues were left offering bulky bottles that were inconvenient, unhygienic, and wasteful.",
          },
          {
            id: "about-origin-p3",
            type: "body",
            label: "Paragraph 3 (Emphasis)",
            text: "We knew there had to be a better way. So we built it.",
            note: "Displayed in Olive Green for emphasis",
          },
        ],
      },
      {
        id: "about-pillars",
        name: "Mission Pillars",
        blocks: [
          {
            id: "about-pillars-heading",
            type: "heading",
            label: "Heading",
            text: "What Drives Us",
          },
          {
            id: "about-pillars-sub",
            type: "body",
            label: "Subheading",
            text: "Every decision we make is guided by three core commitments",
          },
          {
            id: "about-pillar-1",
            type: "step",
            label: "Pillar 1",
            text: "Purpose-Built Solution",
            items: ["Designed specifically for hospitality environments. Single-use pouches that are convenient, hygienic, and perfectly portioned for guests on the go."],
          },
          {
            id: "about-pillar-2",
            type: "step",
            label: "Pillar 2",
            text: "Environmental Responsibility",
            items: ["Reef-safe formula, eco-conscious packaging, and a commitment to reducing waste from oversized bottles and plastic pollution."],
          },
          {
            id: "about-pillar-3",
            type: "step",
            label: "Pillar 3",
            text: "Access for All",
            items: ["A portion of proceeds supports skin cancer research, community education, and sunscreen availability for underserved populations."],
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
            text: "Meet the Founding Team",
          },
          {
            id: "about-team-sub",
            type: "body",
            label: "Subheading",
            text: "A diverse group of entrepreneurs, hospitality veterans, and scientists united by a vision to transform sun protection",
          },
          {
            id: "about-team-member1",
            type: "step",
            label: "Team Member 1",
            text: "Sarah Chen — Co-Founder & CEO",
            items: ["15+ years in luxury hospitality operations. Former VP at Four Seasons, where she identified the critical gap in guest sun protection solutions."],
          },
          {
            id: "about-team-member2",
            type: "step",
            label: "Team Member 2",
            text: "Dr. Marcus Williams — Co-Founder & Chief Science Officer",
            items: ["Board-certified dermatologist with a focus on photoprotection and skin cancer prevention. Published researcher and clinical practitioner."],
          },
          {
            id: "about-team-member3",
            type: "step",
            label: "Team Member 3",
            text: "James Rodriguez — Co-Founder & COO",
            items: ["Supply chain and operations expert. Built sustainable distribution networks for premium wellness brands across North America."],
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
            id: "about-advisory-sub",
            type: "body",
            label: "Subheading",
            text: "Our formulation and safety standards are guided by leading dermatologists, oncologists, and photoprotection researchers",
          },
          {
            id: "about-advisory-1",
            type: "step",
            label: "Board Member 1",
            text: "Dr. Emily Patterson, MD, FAAD — Board-Certified Dermatologist, Stanford Health",
            items: ["Focus: Photoaging & Skin Cancer Prevention"],
          },
          {
            id: "about-advisory-2",
            type: "step",
            label: "Board Member 2",
            text: "Dr. David Kim, MD, PhD — Dermatologic Surgeon, Mayo Clinic",
            items: ["Focus: Mohs Surgery & Melanoma Research"],
          },
          {
            id: "about-advisory-3",
            type: "step",
            label: "Board Member 3",
            text: "Dr. Priya Patel, MD — Pediatric Dermatologist, Children's Hospital LA",
            items: ["Focus: Pediatric Sun Protection & Sensitive Skin"],
          },
          {
            id: "about-advisory-4",
            type: "step",
            label: "Board Member 4",
            text: "Dr. Robert Thompson, MD, MPH — Dermatologic Oncologist, MD Anderson Cancer Center",
            items: ["Focus: UV Radiation & Cancer Prevention"],
          },
        ],
      },
      {
        id: "about-sustainability",
        name: "Sustainability & Community",
        blocks: [
          {
            id: "about-sust-heading",
            type: "heading",
            label: "Heading",
            text: "Our Commitments",
          },
          {
            id: "about-sust-env1",
            type: "step",
            label: "Environmental — Hawaii Act 104",
            text: "Hawaii Act 104 Compliant",
            items: ["Our mineral-based formula is reef-safe and ocean-friendly, free from oxybenzone and octinoxate."],
          },
          {
            id: "about-sust-env2",
            type: "step",
            label: "Environmental — Packaging",
            text: "Eco-Conscious Packaging",
            items: ["We continuously optimize materials, prioritizing recyclable and biodegradable options."],
          },
          {
            id: "about-sust-env3",
            type: "step",
            label: "Environmental — Waste",
            text: "Waste Reduction",
            items: ["Single-use pouches reduce waste compared to half-empty bottles left poolside."],
          },
          {
            id: "about-sust-com1",
            type: "step",
            label: "Community — Research",
            text: "Research Support",
            items: ["A portion of our proceeds funds skin cancer research and UV protection studies."],
          },
          {
            id: "about-sust-com2",
            type: "step",
            label: "Community — Education",
            text: "Education Programs",
            items: ["We partner with schools and community centers to provide free sun safety education."],
          },
          {
            id: "about-sust-com3",
            type: "step",
            label: "Community — Access",
            text: "Underserved Communities",
            items: ["Sunscreen donation programs ensure access for those who need it most."],
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
            label: "Trust Badges (8)",
            text: "Display as badge grid",
            items: [
              "FDA Approved — OTC Monograph",
              "Dermatologist Formulated — Clinical Grade",
              "Hawaii 104 Compliant — Reef Safe",
              "Broad Spectrum SPF 50 — UVA/UVB Protection",
              "Partner Network — 500+ Venues",
              "Made in USA — Quality Assured",
              "Cruelty Free — Never Tested on Animals",
              "Hypoallergenic — Sensitive Skin Safe",
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
];
