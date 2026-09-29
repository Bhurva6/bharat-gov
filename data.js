/* Bharat.gov — concept demo data. Real Government of India schemes & services,
   organised by life-event like america.gov. Links point to the genuine official portals. */

window.BHARAT_DATA = {
  // Life-event categories (the america.gov "topic" grid)
  categories: [
    { id: "money",     icon: "💰", key: "cat_money",     color: "#0A2A66" },
    { id: "health",    icon: "🏥", key: "cat_health",    color: "#138808" },
    { id: "education", icon: "🎓", key: "cat_education", color: "#6A1B9A" },
    { id: "jobs",      icon: "💼", key: "cat_jobs",      color: "#C62828" },
    { id: "housing",   icon: "🏠", key: "cat_housing",   color: "#00695C" },
    { id: "travel",    icon: "🛂", key: "cat_travel",    color: "#1565C0" },
    { id: "family",    icon: "👪", key: "cat_family",    color: "#AD1457" },
    { id: "farmers",   icon: "🌾", key: "cat_farmers",   color: "#2E7D32" },
    { id: "benefits",  icon: "🤝", key: "cat_benefits",  color: "#E65100" },
    { id: "identity",  icon: "🪪", key: "cat_identity",  color: "#4527A0" }
  ],

  // Featured schemes — shown as big cards, and used to ground the AI assistant
  schemes: [
    { cat: "identity", name: "Aadhaar (UIDAI)",            emoji: "🪪", url: "https://uidai.gov.in",              blurb: "Your 12-digit unique identity. Enrol, update address, download e-Aadhaar, lock biometrics." },
    { cat: "identity", name: "DigiLocker",                  emoji: "📁", url: "https://www.digilocker.gov.in",     blurb: "Store & share government documents digitally — driving licence, marksheets, PAN, RC." },
    { cat: "identity", name: "UMANG",                       emoji: "📱", url: "https://web.umang.gov.in",          blurb: "One app for 2000+ central & state services — EPFO, gas booking, PAN, pension & more." },
    { cat: "money",    name: "UPI / BHIM",                  emoji: "💸", url: "https://www.bhimupi.org.in",        blurb: "Instant, free bank-to-bank payments 24×7. Pay any merchant or person with a UPI ID." },
    { cat: "money",    name: "PAN & Income Tax e-Filing",   emoji: "🧾", url: "https://www.incometax.gov.in",      blurb: "Apply for PAN, file your ITR, check refunds and link PAN with Aadhaar." },
    { cat: "money",    name: "Jan Dhan Yojana (PMJDY)",     emoji: "🏦", url: "https://pmjdy.gov.in",              blurb: "Zero-balance bank account for every household, with RuPay card & accident cover." },
    { cat: "health",   name: "Ayushman Bharat (PM-JAY)",    emoji: "🏥", url: "https://pmjay.gov.in",              blurb: "Health cover up to ₹5 lakh per family per year for secondary & tertiary hospitalisation." },
    { cat: "health",   name: "CoWIN / ABHA Health ID",      emoji: "💉", url: "https://abha.abdm.gov.in",          blurb: "Create your ABHA health ID and carry your medical records across hospitals digitally." },
    { cat: "farmers",  name: "PM-KISAN",                     emoji: "🌾", url: "https://pmkisan.gov.in",            blurb: "₹6,000 a year income support to eligible farmer families in three equal instalments." },
    { cat: "farmers",  name: "Kisan Credit Card (KCC)",     emoji: "🚜", url: "https://www.myscheme.gov.in",       blurb: "Short-term crop loans at subsidised interest for farmers, fisheries & animal husbandry." },
    { cat: "housing",  name: "PM Awas Yojana (PMAY)",       emoji: "🏠", url: "https://pmaymis.gov.in",            blurb: "Financial assistance for a pucca house — urban & rural — with interest subsidy on home loans." },
    { cat: "housing",  name: "Ujjwala Yojana (PMUY)",       emoji: "🔥", url: "https://www.pmuy.gov.in",           blurb: "Free LPG connection to women from low-income households for clean cooking fuel." },
    { cat: "education",name: "National Scholarship Portal",  emoji: "🎓", url: "https://scholarships.gov.in",       blurb: "One-stop portal for central & state scholarships — pre-matric, post-matric, merit & minority." },
    { cat: "education",name: "Skill India (PMKVY)",         emoji: "🛠️", url: "https://www.skillindia.gov.in",     blurb: "Free short-term skill training & certification to make youth job-ready." },
    { cat: "jobs",     name: "e-Shram (Unorganised Workers)",emoji: "👷", url: "https://eshram.gov.in",            blurb: "National database & ID for gig, migrant & informal workers — unlocks welfare & insurance." },
    { cat: "jobs",     name: "Startup India",               emoji: "🚀", url: "https://www.startupindia.gov.in",   blurb: "Recognition, tax benefits & funding support for new startups and founders." },
    { cat: "jobs",     name: "Mudra Loans (PMMY)",          emoji: "📈", url: "https://www.mudra.org.in",          blurb: "Collateral-free loans up to ₹10 lakh for small & micro non-farm businesses." },
    { cat: "travel",   name: "Passport Seva",               emoji: "🛂", url: "https://www.passportindia.gov.in",  blurb: "Apply for or renew your passport, book an appointment & track application status." },
    { cat: "travel",   name: "FASTag & Vahan/Sarathi",      emoji: "🚗", url: "https://parivahan.gov.in",          blurb: "Driving licence, vehicle registration (RC), FASTag & road-tax — all online." },
    { cat: "family",   name: "Sukanya Samriddhi Yojana",    emoji: "👧", url: "https://www.india.gov.in",          blurb: "High-interest small savings scheme for a girl child's education & marriage." },
    { cat: "family",   name: "Beti Bachao Beti Padhao",     emoji: "💗", url: "https://wcd.gov.in",                blurb: "National programme to protect, educate & empower the girl child." },
    { cat: "benefits", name: "Atal Pension Yojana (APY)",   emoji: "🧓", url: "https://www.npscra.nsdl.co.in",     blurb: "Guaranteed pension of ₹1,000–₹5,000/month after 60 for unorganised-sector workers." },
    { cat: "benefits", name: "EPFO Member Portal",          emoji: "🧾", url: "https://www.epfindia.gov.in",       blurb: "Check PF balance, withdraw, transfer & manage your provident fund and pension online." },
    { cat: "benefits", name: "myScheme (Eligibility Finder)",emoji: "🧭", url: "https://www.myscheme.gov.in",      blurb: "Answer a few questions and discover every government scheme you're eligible for." }
  ],

  // Quick-access popular services (the strip of chips)
  popular: [
    { name: "Pay a bill with UPI",        url: "https://www.bhimupi.org.in" },
    { name: "Renew passport",             url: "https://www.passportindia.gov.in" },
    { name: "Download e-Aadhaar",         url: "https://myaadhaar.uidai.gov.in" },
    { name: "File Income Tax return",     url: "https://www.incometax.gov.in" },
    { name: "Book LPG cylinder",          url: "https://web.umang.gov.in" },
    { name: "Check PF balance",           url: "https://www.epfindia.gov.in" },
    { name: "Apply for PM-KISAN",         url: "https://pmkisan.gov.in" },
    { name: "Find my scheme",             url: "https://www.myscheme.gov.in" },
    { name: "Get a driving licence",      url: "https://parivahan.gov.in" },
    { name: "Complaint on CPGRAMS",       url: "https://pgportal.gov.in" }
  ],

  // States / UTs for the "your state" section (subset shown, all searchable)
  states: [
    "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana",
    "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
    "Manipur","Meghalaya","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Jammu & Kashmir","Ladakh"
  ]
};
