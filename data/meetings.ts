import type { Meeting } from "@/lib/meetings-types";

export const meetings: Meeting[] = [
  {
    id: "meeting-2026-03-01",
    date: "2026-03-01",
    title: "Team Sync — Product, Website & Instagram Launch",
    attendees: ["Jorge Sunti", "Mark Caraher", "Chaim Cohen"],
    summary:
      "Product development phase is complete — team is now in full execution mode. Discussed pouch design readability fixes, upcoming ingredient order and FDA registration, Instagram hard launch, and homepage build timeline.",
    decisions: [
      "Pouch text should be made bolder, not bigger — avoids layout changes while improving readability",
      "Drug Facts panel on the pouch design needs to be updated — Chaim to send the latest version",
      "GS1 UPC barcode needed for each SKU — required for retail and gift shop sales",
      "Display box prototype designed by Chaim — samples arriving this week for review",
      "Homepage desktop build to be completed first, then tablet and mobile responsive versions",
      "Instagram hard launch starting March 2 — content shoots being scheduled",
      "Jorge to build Instagram content section on SolvynHQ with SEO keywords adapted for social media",
    ],
    actionItems: [
      {
        owner: "Chaim",
        action: "Send updated Drug Facts panel to Jorge",
        status: "pending",
      },
      {
        owner: "Chaim / Mark",
        action: "Get GS1 UPC barcode number (check with Joey)",
        status: "pending",
      },
      {
        owner: "Jorge",
        action:
          "Make pouch text bolder — tagline, Drug Facts, volume text",
        status: "pending",
      },
      {
        owner: "Jorge",
        action: "Finish desktop homepage build",
        status: "pending",
      },
      {
        owner: "Jorge",
        action: "Build Instagram content section on SolvynHQ",
        status: "pending",
      },
      {
        owner: "Jorge",
        action: "Review Chaim's display box prototype design",
        status: "pending",
      },
      {
        owner: "Mark",
        action: "Hard launch Instagram (March 2)",
        status: "pending",
      },
      {
        owner: "Mark / Chaim",
        action: "Schedule content shoot (5-10 videos at Chaim's apartment)",
        status: "pending",
      },
      {
        owner: "All",
        action:
          "Homepage review call once desktop version is ready",
        status: "pending",
      },
    ],
    notes: [
      "Product development phase is officially crossed off — now in execution mode",
      "Ingredients order being placed this week — FDA registration needed with completed artwork",
      "Content strategy: attention-grabbing hooks in first 2 seconds, reef-safe/environmental messaging, bold videos that stop the scroll",
      "Idea: \"A reef disintegrating — this is what you're doing to your oceans. Try mineral sunscreen.\" — crazy hooks work for social",
      "Once homepage is built, design elements can be reused across About, Contact, Privacy, and Terms pages",
      "Chaim interested in learning Claude Code for project management",
    ],
  },
];
