"""Seed the database with sample healthcare schemes, facilities, and FAQs."""

import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models import HealthcareScheme, HealthcareFacility, FAQ

logger = logging.getLogger(__name__)


SCHEMES_DATA = [
    # ── English ──
    {
        "name": "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PMJAY)",
        "name_local": None,
        "description": "Ayushman Bharat PMJAY is the world's largest health assurance scheme, providing health coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalisation. It covers over 10.74 crore poor and vulnerable families.",
        "eligibility": "• Families identified based on SECC 2011 data\n• Deprived rural families and identified occupational categories in urban areas\n• No restriction on family size, age, or gender\n• Pre-existing diseases covered from day one",
        "documents_required": "• Aadhaar Card\n• Ration Card\n• SECC data verification\n• Income certificate (if applicable)\n• Family ID or household ID",
        "benefits": "• ₹5 lakh health cover per family per year\n• Cashless and paperless treatment at empanelled hospitals\n• Covers 1,929+ medical packages including surgeries, medical tests, and treatments\n• No cap on family size\n• Pre-existing conditions covered",
        "coverage": "Pan-India (All States and Union Territories)",
        "website": "https://pmjay.gov.in",
        "language": "en",
        "category": "Health Insurance",
    },
    {
        "name": "Aarogyasri Health Care Trust",
        "name_local": None,
        "description": "Aarogyasri is a healthcare scheme by the Government of Telangana providing financial protection for families below the poverty line. It covers costs for identified diseases requiring hospitalisation, surgery, or therapy.",
        "eligibility": "• White ration card holders in Telangana\n• Family income below ₹2 lakh per annum\n• Must be a resident of Telangana state",
        "documents_required": "• White Ration Card\n• Aadhaar Card\n• Aarogyasri Health Card\n• Income Certificate\n• Residence proof",
        "benefits": "• Coverage up to ₹5 lakh per family per year\n• Covers 2,446 medical procedures\n• Cashless treatment at network hospitals\n• Follow-up care covered\n• Transport allowance provided",
        "coverage": "Telangana",
        "website": "https://aarogyasri.telangana.gov.in",
        "language": "en",
        "category": "Health Insurance",
    },
    {
        "name": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
        "name_local": None,
        "description": "PMSBY is an accident insurance scheme offering coverage for death or disability due to accidents. It is available to people in the age group of 18 to 70 years with a bank account.",
        "eligibility": "• Age 18 to 70 years\n• Must have a savings bank account\n• Must give consent for auto-debit of premium",
        "documents_required": "• Aadhaar Card\n• Bank account details\n• Nomination form\n• Auto-debit consent form",
        "benefits": "• ₹2 lakh for accidental death\n• ₹2 lakh for total permanent disability\n• ₹1 lakh for partial permanent disability\n• Annual premium of only ₹20",
        "coverage": "Pan-India",
        "website": "https://www.jansuraksha.gov.in",
        "language": "en",
        "category": "Accident Insurance",
    },
    {
        "name": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
        "name_local": None,
        "description": "PMJJBY provides life insurance coverage to people between the ages of 18 to 50 years. It offers a renewable one-year term life insurance at an affordable premium.",
        "eligibility": "• Age 18 to 50 years\n• Must have a savings bank account\n• Consent for auto-debit of premium",
        "documents_required": "• Aadhaar Card\n• Bank account details\n• Good health declaration\n• Nomination form",
        "benefits": "• ₹2 lakh life insurance cover\n• Annual premium of only ₹436\n• Risk coverage for death due to any cause\n• Simple enrollment through bank",
        "coverage": "Pan-India",
        "website": "https://www.jansuraksha.gov.in",
        "language": "en",
        "category": "Life Insurance",
    },
    {
        "name": "Janani Suraksha Yojana (JSY)",
        "name_local": None,
        "description": "JSY promotes institutional delivery among pregnant women from Below Poverty Line (BPL) families. It provides cash assistance for delivery and post-delivery care.",
        "eligibility": "• Pregnant women from BPL families\n• All pregnant women in Low Performing States\n• Age 19 years and above\n• Up to 2 live births",
        "documents_required": "• BPL Card / Ration Card\n• Aadhaar Card\n• JSY Card\n• Bank account details\n• Delivery certificate from institution",
        "benefits": "• Rural: ₹1,400 cash assistance for institutional delivery\n• Urban: ₹1,000 cash assistance for institutional delivery\n• Free delivery at government hospitals\n• Free transport to hospital\n• Free post-natal care",
        "coverage": "Pan-India",
        "website": "https://nhm.gov.in",
        "language": "en",
        "category": "Maternal Health",
    },
    {
        "name": "Rashtriya Bal Swasthya Karyakram (RBSK)",
        "name_local": None,
        "description": "RBSK provides child health screening and early intervention services for children aged 0 to 18 years. It covers 4Ds: Defects at birth, Diseases, Deficiencies, and Development delays.",
        "eligibility": "• All children aged 0 to 18 years\n• Children in government and government-aided schools\n• Children in Anganwadi centres",
        "documents_required": "• Birth certificate\n• School enrollment proof\n• Aadhaar Card (if available)\n• Parent/guardian consent",
        "benefits": "• Free health screening at schools and Anganwadis\n• Early detection of 4Ds (Defects, Diseases, Deficiencies, Delays)\n• Free treatment and corrective surgeries\n• Referral to District Early Intervention Centre\n• Follow-up care",
        "coverage": "Pan-India",
        "website": "https://nhm.gov.in",
        "language": "en",
        "category": "Child Health",
    },
    {
        "name": "Mission Indradhanush",
        "name_local": None,
        "description": "Mission Indradhanush aims to achieve full immunisation coverage for all children under 2 years and pregnant women. It targets unvaccinated and partially vaccinated children in identified areas.",
        "eligibility": "• All children under 2 years of age\n• Pregnant women\n• Focus on identified low-coverage districts",
        "documents_required": "• Child's birth certificate or hospital record\n• Mother and Child Protection (MCP) card\n• Previous vaccination records (if any)",
        "benefits": "• Free vaccination against 12 life-threatening diseases\n• Includes BCG, OPV, Hepatitis B, DPT, Measles, Rubella, JE, Rotavirus, PCV\n• Door-to-door vaccination drives\n• Special sessions in hard-to-reach areas",
        "coverage": "Pan-India",
        "website": "https://nhm.gov.in",
        "language": "en",
        "category": "Immunisation",
    },
    {
        "name": "Ayushman Bharat Health and Wellness Centres (AB-HWC)",
        "name_local": None,
        "description": "AB-HWCs are upgraded versions of Sub Health Centres and Primary Health Centres, providing Comprehensive Primary Health Care (CPHC) closer to communities. They offer free essential drugs and diagnostic services.",
        "eligibility": "• All citizens\n• No income restriction\n• No age restriction",
        "documents_required": "• Aadhaar Card or any valid ID\n• No specific documents required for OPD consultation",
        "benefits": "• Free OPD consultation\n• Free essential medicines\n• Free diagnostic tests\n• Teleconsultation facility\n• Yoga and wellness sessions\n• Screening for NCDs (diabetes, hypertension, cancer)",
        "coverage": "Pan-India",
        "website": "https://ab-hwc.nhp.gov.in",
        "language": "en",
        "category": "Primary Healthcare",
    },
    {
        "name": "National Health Mission (NHM)",
        "name_local": None,
        "description": "NHM is the overarching framework for strengthening India's health systems. It encompasses the National Rural Health Mission (NRHM) and National Urban Health Mission (NUHM), focusing on improving healthcare delivery in underserved areas.",
        "eligibility": "• All citizens, with focus on rural and urban poor\n• Special focus on women, children, and marginalised communities",
        "documents_required": "• Varies by specific programme under NHM\n• Generally: Aadhaar Card, BPL Card, local residence proof",
        "benefits": "• Strengthened primary healthcare infrastructure\n• Free services at government health facilities\n• ASHA workers for community health support\n• Mobile Medical Units\n• 108/102 Ambulance services",
        "coverage": "Pan-India",
        "website": "https://nhm.gov.in",
        "language": "en",
        "category": "Public Health",
    },
    {
        "name": "Pradhan Mantri National Dialysis Programme (PMNDP)",
        "name_local": None,
        "description": "PMNDP provides free dialysis services to poor patients at district hospitals through Public-Private Partnership (PPP) mode. It aims to address the growing burden of chronic kidney disease.",
        "eligibility": "• BPL patients requiring maintenance haemodialysis\n• Patients referred from government health facilities\n• Preference for APL patients under PMJAY",
        "documents_required": "• BPL Card / Ration Card\n• Aadhaar Card\n• Doctor's referral letter\n• Medical reports confirming kidney disease\n• PMJAY card (if applicable)",
        "benefits": "• Free haemodialysis at district hospitals\n• 3 sessions per week\n• Essential medicines during dialysis\n• Regular monitoring and checkups",
        "coverage": "Pan-India (at district hospital level)",
        "website": "https://nhm.gov.in",
        "language": "en",
        "category": "Specialty Care",
    },

    # ── Hindi ──
    {
        "name": "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PMJAY)",
        "name_local": "आयुष्मान भारत",
        "description": "आयुष्मान भारत PMJAY विश्व की सबसे बड़ी स्वास्थ्य बीमा योजना है, जो प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य कवर प्रदान करती है। यह 10.74 करोड़ से अधिक गरीब और कमजोर परिवारों को कवर करती है।",
        "eligibility": "• SECC 2011 डेटा के आधार पर चिन्हित परिवार\n• वंचित ग्रामीण परिवार\n• परिवार के आकार, उम्र या लिंग पर कोई प्रतिबंध नहीं\n• पहले से मौजूद बीमारियां पहले दिन से कवर",
        "documents_required": "• आधार कार्ड\n• राशन कार्ड\n• SECC डेटा सत्यापन\n• आय प्रमाण पत्र (यदि लागू हो)\n• परिवार पहचान पत्र",
        "benefits": "• प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य कवर\n• सूचीबद्ध अस्पतालों में कैशलेस और पेपरलेस उपचार\n• 1,929+ चिकित्सा पैकेज कवर\n• परिवार के आकार पर कोई सीमा नहीं",
        "coverage": "संपूर्ण भारत",
        "website": "https://pmjay.gov.in",
        "language": "hi",
        "category": "स्वास्थ्य बीमा",
    },
    {
        "name": "जननी सुरक्षा योजना (JSY)",
        "name_local": "जननी सुरक्षा योजना",
        "description": "जननी सुरक्षा योजना गरीबी रेखा से नीचे (BPL) परिवारों की गर्भवती महिलाओं में संस्थागत प्रसव को बढ़ावा देती है। यह प्रसव और प्रसवोत्तर देखभाल के लिए नकद सहायता प्रदान करती है।",
        "eligibility": "• BPL परिवारों की गर्भवती महिलाएं\n• 19 वर्ष या उससे अधिक आयु\n• 2 जीवित जन्मों तक",
        "documents_required": "• BPL कार्ड / राशन कार्ड\n• आधार कार्ड\n• JSY कार्ड\n• बैंक खाता विवरण",
        "benefits": "• ग्रामीण: ₹1,400 नकद सहायता\n• शहरी: ₹1,000 नकद सहायता\n• सरकारी अस्पतालों में मुफ्त प्रसव\n• अस्पताल तक मुफ्त परिवहन",
        "coverage": "संपूर्ण भारत",
        "website": "https://nhm.gov.in",
        "language": "hi",
        "category": "मातृ स्वास्थ्य",
    },

    # ── Telugu ──
    {
        "name": "ఆయుష్మాన్ భారత్ - ప్రధాన మంత్రి జన ఆరోగ్య యోజన (PMJAY)",
        "name_local": "ఆయుష్మాన్ భారత్",
        "description": "ఆయుష్మాన్ భారత్ PMJAY ప్రపంచంలోనే అతిపెద్ద ఆరోగ్య బీమా పథకం, ప్రతి కుటుంబానికి సంవత్సరానికి ₹5 లక్షల ఆరోగ్య కవరేజీని అందిస్తుంది. ఇది 10.74 కోట్ల పేద మరియు బలహీన కుటుంబాలను కవర్ చేస్తుంది.",
        "eligibility": "• SECC 2011 డేటా ఆధారంగా గుర్తించబడిన కుటుంబాలు\n• వంచిత గ్రామీణ కుటుంబాలు\n• కుటుంబ పరిమాణం, వయస్సు లేదా లింగంపై పరిమితి లేదు\n• ఇప్పటికే ఉన్న వ్యాధులు మొదటి రోజు నుండి కవర్",
        "documents_required": "• ఆధార్ కార్డ్\n• రేషన్ కార్డ్\n• SECC డేటా ధృవీకరణ\n• ఆదాయ ధృవీకరణ పత్రం\n• కుటుంబ గుర్తింపు పత్రం",
        "benefits": "• ప్రతి కుటుంబానికి సంవత్సరానికి ₹5 లక్షల ఆరోగ్య కవర్\n• నమోదైన ఆసుపత్రులలో క్యాష్‌లెస్ చికిత్స\n• 1,929+ వైద్య ప్యాకేజీలు కవర్\n• కుటుంబ పరిమాణంపై పరిమితి లేదు",
        "coverage": "మొత్తం భారతదేశం",
        "website": "https://pmjay.gov.in",
        "language": "te",
        "category": "ఆరోగ్య బీమా",
    },
    {
        "name": "ఆరోగ్యశ్రీ ఆరోగ్య రక్షణ ట్రస్ట్",
        "name_local": "ఆరోగ్యశ్రీ",
        "description": "ఆరోగ్యశ్రీ తెలంగాణ ప్రభుత్వం ద్వారా దారిద్ర్యరేఖకు దిగువన ఉన్న కుటుంబాలకు ఆర్థిక రక్షణ కల్పించే ఆరోగ్య పథకం. ఆసుపత్రిలో చేరిక, శస్త్రచికిత్స లేదా చికిత్స అవసరమయ్యే గుర్తించబడిన వ్యాధుల ఖర్చులను ఇది కవర్ చేస్తుంది.",
        "eligibility": "• తెలంగాణలో వైట్ రేషన్ కార్డ్ హోల్డర్లు\n• వార్షిక కుటుంబ ఆదాయం ₹2 లక్షల కంటే తక్కువ\n• తెలంగాణ రాష్ట్ర నివాసి అయి ఉండాలి",
        "documents_required": "• వైట్ రేషన్ కార్డ్\n• ఆధార్ కార్డ్\n• ఆరోగ్యశ్రీ హెల్త్ కార్డ్\n• ఆదాయ ధృవీకరణ పత్రం\n• నివాస ధృవీకరణ",
        "benefits": "• ప్రతి కుటుంబానికి సంవత్సరానికి ₹5 లక్షల వరకు కవరేజ్\n• 2,446 వైద్య విధానాలు కవర్\n• నెట్‌వర్క్ ఆసుపత్రులలో క్యాష్‌లెస్ చికిత్స\n• ఫాలో-అప్ కేర్ కవర్\n• రవాణా భత్యం",
        "coverage": "తెలంగాణ",
        "website": "https://aarogyasri.telangana.gov.in",
        "language": "te",
        "category": "ఆరోగ్య బీమా",
    },
]


FACILITIES_DATA = [
    {
        "name": "Gandhi Hospital",
        "facility_type": "Government General Hospital",
        "address": "Musheerabad, Secunderabad",
        "district": "Hyderabad",
        "state": "Telangana",
        "pincode": "500003",
        "phone": "040-27505566",
        "emergency_phone": "108",
        "services": "Emergency, General Medicine, Surgery, Obstetrics & Gynaecology, Paediatrics, Orthopaedics, ENT, Ophthalmology, Dermatology, Psychiatry, ICU",
        "timings": "24 hours (Emergency), OPD: 9:00 AM - 4:00 PM",
        "latitude": 17.4036,
        "longitude": 78.4825,
    },
    {
        "name": "Osmania General Hospital",
        "facility_type": "Government General Hospital",
        "address": "Afzalgunj, Hyderabad",
        "district": "Hyderabad",
        "state": "Telangana",
        "pincode": "500012",
        "phone": "040-24600146",
        "emergency_phone": "108",
        "services": "Emergency, General Medicine, Surgery, Cardiology, Nephrology, Neurology, Orthopaedics, Urology, ICU, Burns Ward",
        "timings": "24 hours (Emergency), OPD: 9:00 AM - 4:00 PM",
        "latitude": 17.3616,
        "longitude": 78.4747,
    },
    {
        "name": "AIIMS Delhi",
        "facility_type": "Government General Hospital",
        "address": "Sri Aurobindo Marg, Ansari Nagar, New Delhi",
        "district": "New Delhi",
        "state": "Delhi",
        "pincode": "110029",
        "phone": "011-26588500",
        "emergency_phone": "011-26589999",
        "services": "All Super Speciality Services, Emergency, Trauma Centre, OPD, Diagnostics, Research",
        "timings": "24 hours (Emergency), OPD: 8:00 AM - 1:00 PM",
        "latitude": 28.5672,
        "longitude": 77.2100,
    },
    {
        "name": "Safdarjung Hospital",
        "facility_type": "Government General Hospital",
        "address": "Ansari Nagar West, New Delhi",
        "district": "New Delhi",
        "state": "Delhi",
        "pincode": "110029",
        "phone": "011-26707437",
        "emergency_phone": "108",
        "services": "Emergency, General Medicine, Surgery, Orthopaedics, Obstetrics, Paediatrics, ENT, Eye, Dental",
        "timings": "24 hours (Emergency), OPD: 8:00 AM - 12:00 PM",
        "latitude": 28.5685,
        "longitude": 77.2065,
    },
    {
        "name": "PHC Shamshabad",
        "facility_type": "Primary Health Centre",
        "address": "Shamshabad, Rangareddy District",
        "district": "Rangareddy",
        "state": "Telangana",
        "pincode": "501218",
        "phone": "040-24015500",
        "emergency_phone": "108",
        "services": "OPD, Maternal Health, Child Health, Immunisation, Basic Lab Tests, First Aid",
        "timings": "9:00 AM - 5:00 PM (Mon-Sat)",
        "latitude": 17.2543,
        "longitude": 78.4263,
    },
    {
        "name": "PHC Medchal",
        "facility_type": "Primary Health Centre",
        "address": "Medchal, Medchal-Malkajgiri District",
        "district": "Medchal-Malkajgiri",
        "state": "Telangana",
        "pincode": "501401",
        "phone": "040-27901234",
        "emergency_phone": "108",
        "services": "OPD, Ante-natal Care, Post-natal Care, Immunisation, Family Planning, Basic Diagnostics",
        "timings": "9:00 AM - 5:00 PM (Mon-Sat)",
        "latitude": 17.6300,
        "longitude": 78.4800,
    },
    {
        "name": "Community Health Centre Mahbubnagar",
        "facility_type": "Community Health Centre",
        "address": "Mahbubnagar Town, Mahbubnagar District",
        "district": "Mahbubnagar",
        "state": "Telangana",
        "pincode": "509001",
        "phone": "08542-242200",
        "emergency_phone": "108",
        "services": "Emergency, General Medicine, Surgery, Obstetrics, Paediatrics, Dental, X-Ray, Lab",
        "timings": "24 hours (Emergency), OPD: 9:00 AM - 4:00 PM",
        "latitude": 16.7488,
        "longitude": 78.0035,
    },
    {
        "name": "District Hospital Warangal",
        "facility_type": "District Hospital",
        "address": "MGM Hospital Campus, Warangal",
        "district": "Warangal",
        "state": "Telangana",
        "pincode": "506007",
        "phone": "0870-2578585",
        "emergency_phone": "108",
        "services": "Emergency, All General Specialities, ICU, Blood Bank, Dialysis, Radiology",
        "timings": "24 hours",
        "latitude": 17.9784,
        "longitude": 79.5941,
    },
    {
        "name": "PHC Rajendranagar",
        "facility_type": "Primary Health Centre",
        "address": "Rajendranagar, Rangareddy District",
        "district": "Rangareddy",
        "state": "Telangana",
        "pincode": "500030",
        "phone": "040-24014400",
        "emergency_phone": "108",
        "services": "OPD, Maternal Health, Immunisation, NCD Screening, Basic Lab",
        "timings": "9:00 AM - 5:00 PM (Mon-Sat)",
        "latitude": 17.3256,
        "longitude": 78.4512,
    },
    {
        "name": "Ram Manohar Lohia Hospital",
        "facility_type": "Government General Hospital",
        "address": "Baba Kharak Singh Marg, New Delhi",
        "district": "New Delhi",
        "state": "Delhi",
        "pincode": "110001",
        "phone": "011-23365525",
        "emergency_phone": "108",
        "services": "Emergency, General Medicine, Surgery, ENT, Eye, Orthopaedics, Psychiatry, Radiology, ICU",
        "timings": "24 hours (Emergency), OPD: 8:00 AM - 1:00 PM",
        "latitude": 28.6265,
        "longitude": 77.2090,
    },
    {
        "name": "PHC Ghatkesar",
        "facility_type": "Primary Health Centre",
        "address": "Ghatkesar, Medchal-Malkajgiri District",
        "district": "Medchal-Malkajgiri",
        "state": "Telangana",
        "pincode": "501301",
        "phone": "040-29802345",
        "emergency_phone": "108",
        "services": "OPD, Maternal Health, Immunisation, Family Planning, Health Education",
        "timings": "9:00 AM - 5:00 PM (Mon-Sat)",
        "latitude": 17.4500,
        "longitude": 78.6800,
    },
    {
        "name": "Sub Health Centre Ibrahimpatnam",
        "facility_type": "Sub Health Centre",
        "address": "Ibrahimpatnam, Rangareddy District",
        "district": "Rangareddy",
        "state": "Telangana",
        "pincode": "501506",
        "phone": "040-29802100",
        "emergency_phone": "108",
        "services": "Basic OPD, ANM Services, Immunisation, Health Awareness, First Aid",
        "timings": "9:00 AM - 4:00 PM (Mon-Sat)",
        "latitude": 17.1530,
        "longitude": 78.5960,
    },
]


FAQS_DATA = [
    # ── English FAQs ──
    {
        "question": "What is Ayushman Bharat PMJAY?",
        "answer": "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PMJAY) is the world's largest health insurance scheme funded by the Government of India. It provides health coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalisation to over 10.74 crore poor and vulnerable families.",
        "category": "Healthcare Schemes",
        "language": "en",
        "order_index": 1,
    },
    {
        "question": "How can I check if I am eligible for PMJAY?",
        "answer": "You can check your eligibility for PMJAY by:\n1. Visiting the official website: https://pmjay.gov.in\n2. Calling the helpline: 14555 or 1800-111-565\n3. Visiting your nearest Common Service Centre (CSC)\n4. Visiting the nearest empanelled hospital\nYou need your Aadhaar number or ration card number to check eligibility.",
        "category": "Healthcare Schemes",
        "language": "en",
        "order_index": 2,
    },
    {
        "question": "What documents do I need to get an Ayushman Bharat card?",
        "answer": "To get an Ayushman Bharat card, you typically need:\n• Aadhaar Card\n• Ration Card\n• Mobile number linked to Aadhaar\n• Family details\nVisit your nearest Common Service Centre (CSC) or empanelled hospital with these documents. The card is issued free of cost.",
        "category": "Healthcare Schemes",
        "language": "en",
        "order_index": 3,
    },
    {
        "question": "What is a Primary Health Centre (PHC)?",
        "answer": "A Primary Health Centre (PHC) is a government health facility that provides basic healthcare services to rural and urban communities. PHCs offer services like OPD consultations, maternal and child health care, immunisation, family planning, and treatment of common illnesses. They are usually the first point of contact for healthcare in rural areas.",
        "category": "Healthcare Facilities",
        "language": "en",
        "order_index": 4,
    },
    {
        "question": "What should I do in a medical emergency?",
        "answer": "In a medical emergency:\n1. Call 112 (National Emergency Number) or 108 (Ambulance)\n2. If possible, rush to the nearest government hospital emergency ward\n3. Emergency treatment is FREE at all government hospitals\n4. Carry your Aadhaar card and any health cards (PMJAY, Aarogyasri) if available\n5. Do not delay seeking help for chest pain, difficulty breathing, severe bleeding, or loss of consciousness",
        "category": "Emergency",
        "language": "en",
        "order_index": 5,
    },
    {
        "question": "What vaccinations should my child receive?",
        "answer": "Under the Universal Immunisation Programme, your child should receive vaccines against:\n• BCG (at birth) — Tuberculosis\n• OPV (multiple doses) — Polio\n• Hepatitis B (at birth + follow-up)\n• DPT (multiple doses) — Diphtheria, Pertussis, Tetanus\n• Measles & Rubella (9 months, 16-24 months)\n• Japanese Encephalitis (in endemic areas)\n• Rotavirus, PCV\n\nAll vaccinations are FREE at government hospitals and PHCs. Carry your child's MCP (Mother and Child Protection) card.",
        "category": "Preventive Healthcare",
        "language": "en",
        "order_index": 6,
    },
    {
        "question": "How can I prevent common diseases?",
        "answer": "Basic preventive healthcare tips:\n• Wash hands with soap before eating and after using the toilet\n• Drink clean, boiled or filtered water\n• Eat a balanced diet with fruits and vegetables\n• Exercise regularly (at least 30 minutes daily)\n• Get regular health checkups\n• Keep your surroundings clean\n• Use mosquito nets to prevent malaria and dengue\n• Complete all recommended vaccinations\n• Avoid tobacco and excessive alcohol",
        "category": "Preventive Healthcare",
        "language": "en",
        "order_index": 7,
    },

    # ── Hindi FAQs ──
    {
        "question": "आयुष्मान भारत PMJAY क्या है?",
        "answer": "आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (PMJAY) भारत सरकार द्वारा वित्त पोषित विश्व की सबसे बड़ी स्वास्थ्य बीमा योजना है। यह 10.74 करोड़ से अधिक गरीब और कमजोर परिवारों को प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य कवर प्रदान करती है।",
        "category": "स्वास्थ्य योजनाएं",
        "language": "hi",
        "order_index": 1,
    },
    {
        "question": "मेडिकल इमरजेंसी में क्या करें?",
        "answer": "मेडिकल इमरजेंसी में:\n1. 112 (राष्ट्रीय आपातकालीन नंबर) या 108 (एम्बुलेंस) पर कॉल करें\n2. निकटतम सरकारी अस्पताल के इमरजेंसी वार्ड में जाएं\n3. सभी सरकारी अस्पतालों में आपातकालीन उपचार मुफ्त है\n4. अपना आधार कार्ड और स्वास्थ्य कार्ड साथ ले जाएं",
        "category": "आपातकालीन",
        "language": "hi",
        "order_index": 2,
    },

    # ── Telugu FAQs ──
    {
        "question": "ఆయుష్మాన్ భారత్ PMJAY అంటే ఏమిటి?",
        "answer": "ఆయుష్మాన్ భారత్ ప్రధాన మంత్రి జన ఆరోగ్య యోజన (PMJAY) భారత ప్రభుత్వం ద్వారా నిధులు సమకూర్చబడిన ప్రపంచంలోనే అతిపెద్ద ఆరోగ్య బీమా పథకం. ఇది 10.74 కోట్ల పేద మరియు బలహీన కుటుంబాలకు ప్రతి కుటుంబానికి సంవత్సరానికి ₹5 లక్షల ఆరోగ్య కవరేజీని అందిస్తుంది.",
        "category": "ఆరోగ్య పథకాలు",
        "language": "te",
        "order_index": 1,
    },
    {
        "question": "వైద్య అత్యవసర పరిస్థితిలో ఏమి చేయాలి?",
        "answer": "వైద్య అత్యవసర పరిస్థితిలో:\n1. 112 (జాతీయ అత్యవసర నంబర్) లేదా 108 (అంబులెన్స్) కు కాల్ చేయండి\n2. సమీపంలోని ప్రభుత్వ ఆసుపత్రి ఎమర్జెన్సీ వార్డుకు వెళ్ళండి\n3. అన్ని ప్రభుత్వ ఆసుపత్రులలో అత్యవసర చికిత్స ఉచితం\n4. మీ ఆధార్ కార్డ్ మరియు ఆరోగ్య కార్డులను తీసుకెళ్ళండి",
        "category": "అత్యవసరం",
        "language": "te",
        "order_index": 2,
    },
]


async def seed_database(db: AsyncSession):
    """Seed the database with initial data if tables are empty."""

    # Check if data already exists
    scheme_count = await db.execute(select(func.count(HealthcareScheme.id)))
    if scheme_count.scalar() > 0:
        logger.info("Database already seeded. Skipping.")
        return

    logger.info("Seeding database with initial data...")

    # Seed healthcare schemes
    for scheme_data in SCHEMES_DATA:
        scheme = HealthcareScheme(**scheme_data)
        db.add(scheme)

    # Seed healthcare facilities
    for facility_data in FACILITIES_DATA:
        facility = HealthcareFacility(**facility_data)
        db.add(facility)

    # Seed FAQs
    for faq_data in FAQS_DATA:
        faq = FAQ(**faq_data)
        db.add(faq)

    await db.commit()
    logger.info(
        f"Seeded {len(SCHEMES_DATA)} schemes, "
        f"{len(FACILITIES_DATA)} facilities, "
        f"{len(FAQS_DATA)} FAQs"
    )
