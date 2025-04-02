
export const professionalData = {
  // Define categories with their display information
  categories: [
    { type: "inspector", label: "Home Inspectors" },
    { type: "structural", label: "Structural Engineers" },
    { type: "roofing", label: "Roof Inspectors" },
    { type: "electrical", label: "Electricians" },
    { type: "plumbing", label: "Plumbers" },
    { type: "hvac", label: "HVAC Technicians" },
    { type: "chimney", label: "WETT Inspectors" },
    { type: "pest", label: "Pest Inspectors" },
    { type: "mold", label: "Mold Specialists" },
    { type: "asbestos", label: "Asbestos & Lead" },
    { type: "radon", label: "Radon Testing" },
    { type: "septic", label: "Septic Inspectors" },
    { type: "well", label: "Well Water Testing" },
    { type: "oil", label: "Oil Tank Inspectors" },
    { type: "pool", label: "Pool Inspectors" },
    { type: "contractor", label: "General Contractors" },
  ],
  
  // Define all professionals
  professionals: [
    // Home Inspectors
    {
      id: "pillar-to-post",
      category: "inspector",
      name: "Pillar To Post Home Inspectors",
      expertise: "Residential Home Inspections",
      phone: "(604) 462-7020",
      email: "info@pillartopost.com",
      address: "26410 127 Ave, Maple Ridge, BC V2W 1C6",
      serviceArea: "Greater Vancouver and Fraser Valley"
    },
    {
      id: "amerispec",
      category: "inspector",
      name: "AmeriSpec Inspection Services",
      expertise: "Comprehensive Home Inspections",
      phone: "(604) 430-0343",
      email: "vancouver@amerispec.ca",
      address: "#300-3665 Kingsway, Vancouver, BC V5R 5W2"
    },
    {
      id: "buyers-choice",
      category: "inspector",
      name: "A Buyer's Choice Home Inspections",
      expertise: "Franchise Home Inspections",
      phone: "(778) 846-8646",
      email: "richmondsouth@abuyerschoice.com",
      address: "8091 Alanmore Pl, Richmond, BC V7C 2B6"
    },
    {
      id: "bc-home-inspectors",
      category: "inspector",
      name: "BC Home Inspectors Inc.",
      expertise: "Full-Service Residential Inspections",
      phone: "(604) 555-1111",
      email: "info@bchomeinspectors.com",
      address: "1122 Main St, Vancouver, BC V6B 2Y7"
    },
    {
      id: "coastal-home-inspectors",
      category: "inspector",
      name: "Coastal Home Inspectors",
      expertise: "Detailed Structural & System Checks",
      phone: "(250) 555-2222",
      email: "contact@coastalinspectors.ca",
      address: "789 Seaside Ave, Victoria, BC V8W 1A2"
    },
    {
      id: "elite-home-inspections",
      category: "inspector",
      name: "Elite Home Inspections",
      expertise: "Advanced Home & Energy Inspections",
      phone: "(604) 555-3333",
      email: "support@elitehomeinspect.ca",
      address: "4567 Birch St, Surrey, BC V3S 4R5"
    },
    {
      id: "inspectpro-bc",
      category: "inspector",
      name: "InspectPro BC",
      expertise: "Technology-Driven Home Inspections",
      phone: "(604) 555-4444",
      email: "info@inspectprobc.ca",
      address: "321 Oak Blvd, Vancouver, BC V6E 3N8"
    },
    {
      id: "homewise-inspections",
      category: "inspector",
      name: "Homewise Inspections",
      expertise: "Comprehensive Property Inspections",
      phone: "(778) 555-5555",
      email: "info@homewiseinspections.ca",
      address: "987 Willow Dr, Kelowna, BC V1Y 2H3"
    },
    {
      id: "precision-home-inspections",
      category: "inspector",
      name: "Precision Home Inspections",
      expertise: "Thorough Residential Inspections",
      phone: "(604) 555-6666",
      email: "contact@precisionhome.ca",
      address: "234 Pine St, Victoria, BC V8V 3P4"
    },
    {
      id: "west-coast-home-inspection",
      category: "inspector",
      name: "West Coast Home Inspection",
      expertise: "Reliable & Accredited Home Inspections",
      phone: "(604) 555-7777",
      email: "service@westcoasthomeinspection.ca",
      address: "123 Maple Ave, Vancouver, BC V6A 1B2"
    },

    // Structural Engineers
    {
      id: "gtech-engineering",
      category: "structural",
      name: "GTech Engineering Corp.",
      expertise: "Residential Structural Assessments",
      phone: "(604) 200-1520",
      email: "info@gtechengineering.ca",
      address: "1688 152nd St Unit 404, Surrey, BC V4A 4N2"
    },
    {
      id: "mercury-consulting",
      category: "structural",
      name: "Mercury Consulting Inc.",
      expertise: "Structural & Foundation Analysis",
      phone: "(250) 215-4731",
      email: "info@mercurystructural.com",
      address: "2500 Granville St, Kelowna, BC V1Y 1A1"
    },
    {
      id: "structsure-engineering",
      category: "structural",
      name: "StructSure Engineering",
      expertise: "Structural Evaluation & Design",
      phone: "(604) 555-8888",
      email: "contact@structsure.ca",
      address: "7890 Engineering Rd, Vancouver, BC V6E 5K1"
    },
    
    // Add at least one professional for each category
    // Roof Inspectors
    {
      id: "penfolds-roofing",
      category: "roofing",
      name: "Penfolds Roofing & Solar",
      expertise: "Roof Inspections & Solar Roofing Installations",
      phone: "(604) 254-4663",
      email: "info@penfoldsroofing.com",
      address: "2230 Hartley Ave, Coquitlam, BC V3K 6X3"
    },
    
    // Electricians
    {
      id: "houle-electric",
      category: "electrical",
      name: "Houle Electric Ltd.",
      expertise: "Residential Electrical Services",
      phone: "(604) 434-2681",
      email: "hello@houle.ca",
      address: "5050 North Fraser Way, Burnaby, BC V5J 0H1"
    },
    
    // Plumbers
    {
      id: "milani-plumbing",
      category: "plumbing",
      name: "Milani Plumbing, Heating & AC",
      expertise: "Full-Service Residential Plumbing & Sewer Inspections",
      phone: "(604) 888-8888",
      email: "customerservice@milani.ca",
      address: "5526 Kingsway, Burnaby, BC V5H 2G2"
    },
    
    // HVAC Technicians
    {
      id: "gandy-installations",
      category: "hvac",
      name: "Gandy Installations Ltd.",
      expertise: "Residential HVAC Installations & Inspections",
      phone: "(604) 534-5555",
      email: "info@gandyhvac.ca",
      address: "20363 62 Ave, Langley, BC V3A 5E6"
    },
    
    // WETT Inspectors
    {
      id: "santas-chimney",
      category: "chimney",
      name: "Santa's Chimney Services",
      expertise: "WETT-Certified Chimney & Fireplace Inspections",
      phone: "(778) 340-0324",
      email: "info@santaschimney.ca",
      address: "North Vancouver, BC (serving Metro Vancouver)"
    },
    
    // Pest Inspectors
    {
      id: "orkin-canada",
      category: "pest",
      name: "Orkin Canada (Burnaby Branch)",
      expertise: "Residential Pest Control & Inspections",
      phone: "(604) 409-8544",
      email: "info@orkin.ca",
      address: "7061 Gilley Ave, Burnaby, BC V5J 4X1"
    },
    
    // Mold Specialists
    {
      id: "pinchin-ltd",
      category: "mold",
      name: "Pinchin Ltd. (Richmond Office)",
      expertise: "Mold Inspection & Indoor Air Quality Testing",
      phone: "(604) 244-8101",
      email: "info@pinchin.com",
      address: "13775 Commerce Pkwy Suite 200, Richmond, BC V6V 2V4"
    },
    
    // Asbestos & Lead
    {
      id: "keystone-environmental",
      category: "asbestos",
      name: "Keystone Environmental Ltd.",
      expertise: "Asbestos Surveys & Lead Paint Testing",
      phone: "(604) 430-0671",
      email: "info@keystoneenvironmental.ca",
      address: "320–4400 Dominion St, Burnaby, BC V5G 4G3"
    },
    
    // Radon Testing
    {
      id: "radon-environmental",
      category: "radon",
      name: "Radon Environmental Management Corp.",
      expertise: "Radon Testing & Mitigation",
      phone: "(778) 327-4717",
      email: "info@radoncorp.com",
      address: "#450–1040 W Georgia St, Vancouver, BC V6E 4H1"
    },
    
    // Septic Inspectors
    {
      id: "coast-mountain",
      category: "septic",
      name: "Coast Mountain Earth Sciences",
      expertise: "Septic System Inspections & Pumping Services",
      phone: "(604) 555-7373",
      email: "info@coastmountainenv.ca",
      address: "Maple Ridge, BC (exact address available upon inquiry)"
    },
    
    // Well Water Testing
    {
      id: "wellcheck-bc",
      category: "well",
      name: "WellCheck BC",
      expertise: "Residential Well Inspections & Water Testing",
      phone: "(604) 555-8282",
      email: "info@wellcheckbc.ca",
      address: "123 Well Rd, Vancouver, BC V6E 1M8"
    },
    
    // Oil Tank Inspectors
    {
      id: "tanktech-environmental",
      category: "oil",
      name: "TankTech Environmental Services",
      expertise: "Underground Oil Tank Detection & Scanning",
      phone: "(604) 555-9282",
      email: "info@tanktech.ca",
      address: "233 West Windsor Rd, North Vancouver, BC V7N 2N2"
    },
    
    // Pool Inspectors
    {
      id: "west-coast-pool",
      category: "pool",
      name: "West Coast Pool & Spa Ltd.",
      expertise: "Residential Pool & Spa Inspections & Safety Reviews",
      phone: "(604) 555-1020",
      email: "info@wcpoolspa.ca",
      address: "1139 W 14th St, North Vancouver, BC V7P 1J9"
    },
    
    // General Contractors
    {
      id: "my-house-design",
      category: "contractor",
      name: "My House Design/Build Team Ltd.",
      expertise: "Design-Build & Renovation Project Management",
      phone: "(604) 694-6873",
      email: "info@myhousedesignbuild.com",
      address: "15356 Fraser Hwy, Surrey, BC V3R 3P5"
    }
  ]
};
