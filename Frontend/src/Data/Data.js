// ==========================================================
// Nestesy — About Us Page Data
// (FAQ data intentionally excluded — not part of this page)
// ==========================================================

// ---------- Hero Section ----------
export const heroData = {
  badge: "Find. Book. Live.",

  title: "Find Your Perfect Home",

  description:
    "Discover verified rental properties across the city. Easy search, secure booking, and trusted owners.",

  features: [
    {
      title: "Verified Properties",
      subtitle: "100% Verified",
      icon: "shield",
    },
    {
      title: "Easy Booking",
      subtitle: "Book in Minutes",
      icon: "calendar",
    },
    {
      title: "Support 24/7",
      subtitle: "We're Here to Help",
      icon: "headset",
    },
  ],

  buttons: [
    {
      text: "Explore Properties",
      link: "/properties",
    },
    {
      text: "Become a Host",
      link: "/host",
    },
  ],
};

// ---------- Mission & Vision ----------
export const aboutData = [
  {
    title: "Our Mission",
    description:
      "To make renting simple and stress-free by providing verified listings, secure communication, and exceptional support.",
    icon: "target",
  },
  {
    title: "Our Vision",
    description:
      "To be the most trusted rental platform that empowers people to find, list, and manage homes with confidence.",
    icon: "binoculars",
  },
];

// ---------- Our Services ----------
export const servicesData = {
  tag: "What We Offer",
  title: "Our Services",
  subtitle: "Everything you need for a better renting experience.",

  items: [
    {
      title: "Verified Properties",
      description:
        "All properties are verified for authenticity and quality so you can rent with peace of mind.",
      icon: "search-home",
    },
    {
      title: "Trusted Hosts",
      description:
        "Connect with genuine hosts and tenants for a safe and reliable renting experience.",
      icon: "users",
    },
    {
      title: "Easy Search",
      description:
        "Advanced filters and smart search help you find the right home faster.",
      icon: "search",
    },
    {
      title: "Secure Payments",
      description:
        "Safe, encrypted, and hassle-free payment options for every transaction.",
      icon: "wallet",
    },
    {
      title: "24/7 Support",
      description:
        "Our support team is always here to help you anytime, anywhere.",
      icon: "headset",
    },
  ],
};

// ---------- Stats (moved below "Our Services") ----------
export const statsData = [
  {
    number: "10,000+",
    title: "Verified Properties",
    icon: "building",
  },
  {
    number: "50,000+",
    title: "Happy Customers",
    icon: "users",
  },
  {
    number: "120+",
    title: "Cities Covered",
    icon: "location",
  },
  {
    number: "4.8/5",
    title: "Customer Rating",
    icon: "star",
  },
];

// ---------- Why Choose Nestesy ----------
export const whyChooseData = {
  tag: "Why Choose Nestesy?",
  title: "We make renting simple & reliable",

  points: [
    "100% Verified Properties",
    "Secure & Hassle-free Payments",
    "Genuine Hosts & Tenants",
    "Transparent Listings",
    "24/7 Customer Support",
  ],

  button: {
    text: "Learn More About Us",
    link: "/about",
  },
};

// ---------- Testimonials (split by audience: Tenant / Owner) ----------
export const testimonialsData = {
  tag: "What Our Customers Say",
  title: "Trusted by thousands of happy customers",

  tenant: [
    {
      id: 1,
      name: "Priya Sharma",
      city: "Mumbai",
      rating: 5,
      review:
        "Nestesy helped me find the perfect apartment in just a few days. The process was smooth and completely hassle-free!",
    },
    {
      id: 2,
      name: "Ananya Iyer",
      city: "Pune",
      rating: 5,
      review:
        "The platform is easy to use, secure, and trustworthy. Highly recommended for anyone looking to rent a home.",
    },
    {
      id: 3,
      name: "Dorothy Shipton",
      city: "Hyderabad",
      rating: 5,
      review:
        "Searching for a flat used to be stressful. With Nestesy, everything from search to booking felt effortless.",
    },
  ],

  owner: [
    {
      id: 4,
      name: "Rohit Verma",
      city: "Bangalore",
      rating: 5,
      review:
        "As a host, listing my property on Nestesy was the best decision. I get quality tenants and great support.",
    },
    {
      id: 5,
      name: "Karan Mehta",
      city: "Delhi",
      rating: 5,
      review:
        "Managing my rental listings has never been easier. Nestesy connects me with genuine tenants quickly and securely.",
    },
    {
      id: 6,
      name: "Susan Murphy",
      city: "Chennai",
      rating: 5,
      review:
        "Great support team and a smooth listing process. My property was rented out within a week of going live.",
    },
  ],
};

// ---------- Call To Action ----------
export const ctaData = {
  title: "Ready to find your next home?",
  description:
    "Explore thousands of verified properties or list your property and connect with great tenants.",

  buttons: [
    {
      text: "Explore Homes",
      link: "/explore",
      type: "primary",
    },
    {
      text: "Become a Host",
      link: "/host",
      type: "secondary",
    },
  ],
};

// ---------- Footer (kept for reference — Footer.jsx already renders global footer) ----------
export const footerData = {
  logo: "Nestesy",

  description: "Find homes that fit your life. Trusted stays. Better living.",

  company: ["About Us", "Careers", "Blog", "Press"],

  support: ["Help Center", "Terms of Service", "Privacy Policy", "Contact Us"],

  hosts: ["Become a Host", "Host Resources", "Community"],

  newsletter: {
    title: "Subscribe to our newsletter",
    subtitle: "Get the latest updates and offers.",
    placeholder: "Enter your email",
  },

  copyright: "© 2025 Nestesy. All rights reserved.",
};
