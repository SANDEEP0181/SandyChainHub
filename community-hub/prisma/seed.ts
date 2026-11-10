import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const courses = [
    {
      slug: "web3-basics",
      titleEn: "Web3 fundamentals",
      titleHi: "Web3 की बुनियादी जानकारी",
      descriptionEn: "Understand wallets, blockchains and decentralised apps at a high level.",
      descriptionHi: "Wallet, blockchain और decentralised apps को आसान भाषा में समझें।",
      level: "Beginner",
      durationMin: 8,
      lessons: [
        { order: 1, titleEn: "What is a blockchain?", titleHi: "Blockchain क्या है?", bodyEn: "A blockchain is a shared digital record. Many computers keep copies and agree on updates using a defined process. This lesson is an introduction, not investment advice.", bodyHi: "Blockchain एक साझा digital record है। कई computers इसकी copies रखते हैं और तय प्रक्रिया से updates पर सहमति बनाते हैं। यह lesson केवल परिचय है, निवेश सलाह नहीं।", durationMin: 4 },
        { order: 2, titleEn: "Wallet safety basics", titleHi: "Wallet सुरक्षा की मूल बातें", bodyEn: "Never share recovery phrases or private keys. Check domains carefully, avoid unknown downloads, and ask a trusted adult before making financial decisions.", bodyHi: "Recovery phrase या private key कभी साझा न करें। Website domain जाँचें, अनजान downloads से बचें और आर्थिक फैसलों से पहले भरोसेमंद बड़े व्यक्ति से सलाह लें।", durationMin: 4 }
      ]
    },
    {
      slug: "digital-safety",
      titleEn: "Stay safe online",
      titleHi: "ऑनलाइन सुरक्षित रहें",
      descriptionEn: "Recognise suspicious links, impersonation and unsafe requests.",
      descriptionHi: "संदिग्ध links, नकली पहचान और असुरक्षित requests पहचानें।",
      level: "Safety",
      durationMin: 6,
      lessons: [
        { order: 1, titleEn: "Spot suspicious messages", titleHi: "संदिग्ध messages पहचानें", bodyEn: "Pause before clicking. Check the sender, spelling, destination domain and whether the message creates urgency. Report suspicious content to the platform.", bodyHi: "Click करने से पहले रुकें। Sender, spelling, website domain और message में बनाई गई जल्दबाज़ी जाँचें। संदिग्ध content को platform पर report करें।", durationMin: 3 },
        { order: 2, titleEn: "Protect your account", titleHi: "अपना account सुरक्षित रखें", bodyEn: "Use unique passwords, enable available multi-factor security, keep devices updated and never share one-time codes.", bodyHi: "हर account के लिए अलग password रखें, उपलब्ध multi-factor सुरक्षा चालू करें, device update रखें और one-time code किसी को न बताएँ।", durationMin: 3 }
      ]
    },
    {
      slug: "creator-skills",
      titleEn: "Build your first digital project",
      titleHi: "अपना पहला digital project बनाएँ",
      descriptionEn: "Turn an idea into a clear project brief and learning plan.",
      descriptionHi: "एक विचार को स्पष्ट project brief और learning plan में बदलें।",
      level: "Creator",
      durationMin: 10,
      lessons: [
        { order: 1, titleEn: "Define the problem", titleHi: "समस्या को समझें", bodyEn: "Write one sentence describing who has the problem, what makes it difficult and how you will know the problem is solved.", bodyHi: "एक वाक्य में लिखें कि समस्या किसे है, कठिनाई क्या है और आप कैसे जानेंगे कि समस्या हल हो गई।", durationMin: 5 },
        { order: 2, titleEn: "Plan a small first version", titleHi: "पहला छोटा version plan करें", bodyEn: "Choose one core user task. Build the smallest safe version, test it with a few people and improve it from feedback.", bodyHi: "एक मुख्य user task चुनें। उसका सबसे छोटा सुरक्षित version बनाएँ, कुछ लोगों के साथ test करें और feedback से सुधार करें।", durationMin: 5 }
      ]
    }
  ];

  for (const course of courses) {
    const { lessons, ...data } = course;
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: data,
      create: { ...data, lessons: { create: lessons } }
    });
  }

  const listingSeeds = [
    { title: "Hindi video editing", description: "Sample directory entry for short-form creator services. Contact flow is disabled until identity verification is configured.", category: "Creator service", language: "en" },
    { title: "Beginner digital-skills sessions", description: "Sample directory entry for basic digital-skills learning sessions.", category: "Learning", language: "en" },
    { title: "Local creator network", description: "Sample community directory entry for creators to discover one another.", category: "Community", language: "en" }
  ];
  for (const listing of listingSeeds) {
    const exists = await prisma.listing.findFirst({ where: { title: listing.title } });
    if (!exists) await prisma.listing.create({ data: listing });
  }
}

main().finally(async () => prisma.$disconnect());
