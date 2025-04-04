
// Define the categories for professionals
export const professionalCategories = [
  { type: "inspector", label: "Home Inspectors", icon: "Home" },
  { type: "structural", label: "Structural Engineers", icon: "Building2" },
  { type: "roofing", label: "Roof Inspectors", icon: "Construction" },
  { type: "electrical", label: "Electricians", icon: "Zap" },
  { type: "plumbing", label: "Plumbers", icon: "Pipette" },
  { type: "hvac", label: "HVAC Technicians", icon: "Thermometer" },
  { type: "chimney", label: "WETT Inspectors", icon: "Flame" },
  { type: "pest", label: "Pest Inspectors", icon: "Bug" },
  { type: "mold", label: "Mold Specialists", icon: "Droplet" },
  { type: "asbestos", label: "Asbestos & Lead", icon: "FlaskRound" },
  { type: "radon", label: "Radon Testing", icon: "Radiation" },
  { type: "septic", label: "Septic Inspectors", icon: "Pipette" },
  { type: "well", label: "Well Water Testing", icon: "Waves" },
  { type: "oil", label: "Oil Tank Inspectors", icon: "Fuel" },
  { type: "pool", label: "Pool Inspectors", icon: "Bike" },
  { type: "contractor", label: "General Contractors", icon: "Hammer" },
];

// Sample professional data
const inspectors = [
  {
    id: "1",
    name: "John Smith",
    category: "inspector",
    expertise: "Certified Home Inspector",
    rating: 4.8,
    reviews: 42,
    location: "Toronto, ON",
    phone: "(416) 555-1234",
    email: "john.smith@example.com",
    address: "123 Inspection Ave, Toronto, ON",
    serviceArea: "Greater Toronto Area"
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    category: "inspector",
    expertise: "Commercial Building Inspector",
    rating: 4.7,
    reviews: 38,
    location: "Vancouver, BC",
    phone: "(604) 555-5678",
    email: "maria.rodriguez@example.com",
    address: "456 Inspector St, Vancouver, BC",
    serviceArea: "Greater Vancouver Area"
  }
];

const electricians = [
  {
    id: "3",
    name: "David Chen",
    category: "electrical",
    expertise: "Master Electrician",
    rating: 4.9,
    reviews: 56,
    location: "Calgary, AB",
    phone: "(403) 555-9012",
    email: "david.chen@example.com",
    address: "789 Electric Ave, Calgary, AB",
    serviceArea: "Calgary and surrounding areas"
  }
];

const plumbers = [
  {
    id: "4",
    name: "Sarah Johnson",
    category: "plumbing",
    expertise: "Licensed Plumber",
    rating: 4.6,
    reviews: 31,
    location: "Montreal, QC",
    phone: "(514) 555-3456",
    email: "sarah.johnson@example.com",
    address: "321 Plumbing Blvd, Montreal, QC",
    serviceArea: "Montreal Metropolitan Area"
  }
];

// Export a combined list of all professionals
export const professionalData = {
  categories: professionalCategories,
  professionals: [
    ...inspectors,
    ...electricians,
    ...plumbers
  ]
};
