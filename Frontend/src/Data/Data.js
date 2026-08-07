

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




import { Home ,Users, ChartLine,ShieldCheck,Settings,House,NotebookPen , Wallet,UserRoundPlus} from 'lucide-react' 
 
 



// Become Host Benifits
 export const Benifits=[
 
    {
        title: "Wide Audience",
        icons:Users,
        description: "Reach thousands of potential tenants looking for their perfect home."
    },
    {
        title: "Higher Visibility",
        icons:ChartLine,
        description: "Our dedicated support team is always here to help you with any questions or concerns."
    },
       {
        title: "Secure & Reliable",
        icons:ShieldCheck,
        description: "List your property in minutes with our simple ,easy and intuitive process."
    },
    
    {
        title:"Easily Managable",
        icons:Settings,
        description:"Manage your listings, bookings, and tenant communications all in one place."
    }
]




//Become host steps 
export const HostSteps =[
    {id:1 , title:"Register" , icon: UserRoundPlus ,desc:"Sign up as a host and complete your profile verification"},
     {id:2 , title:"Add Property" , icon: House ,desc:"Add property details, photos, amenities and pricing"},
      {id:3 , title:"Get Booking" , icon: NotebookPen ,desc:"Recieve booking request from verified tenants."},
       {id:4 , title:"Earn & Manage" , icon: Wallet ,desc:"Approve booking, manage stay and earn hasle-free"},
]






// Explore page properties

export const Properties = [
{
id:1,
title:"Modern 2BHK Apartment",
location:"Mumbai",
propertyType:"Apartment",
price:28000,
bedrooms:2,
bathrooms:2,
area:850,
description:"Beautiful modern apartment with premium amenities in the heart of Mumbai. Close to shopping centers and public transport.",
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["Parking","WiFi","Lift","Security","Gym"],
images:[
"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
"https://images.unsplash.com/photo-1484154218962-a197022b5858",
"https://images.unsplash.com/photo-1494526585095-c41746248156"
],
host:"Rajesh Kumar",
hostPhone:"+91-98765-43210",
hostEmail:"rajesh.kumar@email.com",
rating:4.8,
reviews:124,
listedOn:"2026-01-15",
visitTime:"10:00 AM - 6:00 PM",
securityDeposit:28000,
maintenance:2000
},
{
id:2,
title:"Luxury Villa with Garden",
location:"Pune",
propertyType:"Villa",
price:65000,
bedrooms:4,
bathrooms:4,
area:2200,
description:"Spacious luxury villa with a beautiful garden and premium finishes. Perfect for large families seeking comfort and elegance.",
furnishing:"Semi Furnished",
availability:"Within 15 Days",
amenities:["Parking","Pool","Garden","Security","Power Backup"],
images:[
"https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
"https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
],
host:"Priya Sharma",
hostPhone:"+91-87654-32109",
hostEmail:"priya.sharma@email.com",
rating:4.9,
reviews:89,
listedOn:"2026-01-20",
visitTime:"9:00 AM - 5:00 PM",
securityDeposit:65000,
maintenance:3500
},
{
id:3,
title:"Affordable PG",
location:"Nagpur",
propertyType:"PG",
price:8500,
bedrooms:1,
bathrooms:1,
area:350,
description:"Budget-friendly PG accommodation with all basic amenities. Ideal for students and working professionals.",
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["WiFi","AC","Security"],
images:[
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
"https://images.unsplash.com/photo-1484154218962-a197022b5858"
],
host:"Amit Patel",
hostPhone:"+91-76543-21098",
hostEmail:"amit.patel@email.com",
rating:4.2,
reviews:56,
listedOn:"2026-02-01",
visitTime:"11:00 AM - 7:00 PM",
securityDeposit:8500,
maintenance:500
},
{
id:4,
title:"Spacious Independent House",
location:"Hyderabad",
propertyType:"Independent House",
price:35000,
bedrooms:3,
bathrooms:3,
area:1500,
description:"Well-designed independent house with ample space and natural light. Features a beautiful garden and power backup.",
furnishing:"Semi Furnished",
availability:"Next Month",
amenities:["Parking","Garden","Power Backup"],
images:[
"https://images.unsplash.com/photo-1568605114967-8130f3a36994",
"https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
"https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
"https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
],
host:"Sneha Reddy",
hostPhone:"+91-65432-10987",
hostEmail:"sneha.reddy@email.com",
rating:4.6,
reviews:78,
listedOn:"2026-01-10",
visitTime:"10:00 AM - 6:00 PM",
securityDeposit:35000,
maintenance:2500
},
{
id:5,
title:"Premium Studio Apartment",
location:"Bangalore",
propertyType:"Apartment",
price:22000,
bedrooms:1,
bathrooms:1,
area:550,
description:"Contemporary studio apartment with modern interiors. Located in a prime area with excellent connectivity.",
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["WiFi","Lift","Gym"],
images:[
"https://images.unsplash.com/photo-1494526585095-c41746248156",
"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
],
host:"Arjun Nair",
hostPhone:"+91-54321-09876",
hostEmail:"arjun.nair@email.com",
rating:4.7,
reviews:103,
listedOn:"2026-01-25",
visitTime:"9:00 AM - 5:00 PM",
securityDeposit:22000,
maintenance:1500
},
{
id:6,
title:"3BHK Family Apartment",
location:"Delhi",
propertyType:"Apartment",
price:42000,
bedrooms:3,
bathrooms:2,
area:1250,
description:"Spacious family apartment with all modern facilities. Safe and secure locality with excellent schools and hospitals nearby.",
furnishing:"Semi Furnished",
availability:"Within 15 Days",
amenities:["Parking","Gym","Lift","Security"],
images:[
"https://images.unsplash.com/photo-1484154218962-a197022b5858",
"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
"https://images.unsplash.com/photo-1494526585095-c41746248156",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
],
host:"Vikram Singh",
hostPhone:"+91-43210-98765",
hostEmail:"vikram.singh@email.com",
rating:4.5,
reviews:92,
listedOn:"2026-02-05",
visitTime:"11:00 AM - 7:00 PM",
securityDeposit:42000,
maintenance:3000
},
{
id:7,
title:"Budget PG for Students",
location:"Pune",
propertyType:"PG",
price:7000,
bedrooms:1,
bathrooms:1,
area:300,
description:"Economical PG accommodation designed specifically for students. Includes laundry facility and high-speed WiFi.",
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["WiFi","Laundry","Security"],
images:[
"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
"https://images.unsplash.com/photo-1484154218962-a197022b5858"
],
host:"Meera Joshi",
hostPhone:"+91-32109-87654",
hostEmail:"meera.joshi@email.com",
rating:4.0,
reviews:67,
listedOn:"2026-02-10",
visitTime:"10:00 AM - 6:00 PM",
securityDeposit:7000,
maintenance:400
},
{
id:8,
title:"Luxury Penthouse",
location:"Mumbai",
propertyType:"Apartment",
price:90000,
bedrooms:4,
bathrooms:4,
area:2800,
description:"Exclusive penthouse with panoramic city views and world-class amenities. The epitome of luxury living.",
furnishing:"Fully Furnished",
availability:"Next Month",
amenities:["Pool","Gym","Parking","Lift","Security"],
images:[
"https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
"https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
"https://images.unsplash.com/photo-1568605114967-8130f3a36994",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
],
host:"Karan Mehta",
hostPhone:"+91-21098-76543",
hostEmail:"karan.mehta@email.com",
rating:4.9,
reviews:145,
listedOn:"2026-01-05",
visitTime:"9:00 AM - 5:00 PM",
securityDeposit:90000,
maintenance:5000
},
{
id:9,
title:"Cozy Independent House",
location:"Nagpur",
propertyType:"Independent House",
price:18000,
bedrooms:2,
bathrooms:2,
area:900,
description:"Charming independent house with a cozy atmosphere. Perfect for small families seeking privacy and comfort.",
furnishing:"Unfurnished",
availability:"Immediate",
amenities:["Parking","Garden"],
images:[
"https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
"https://images.unsplash.com/photo-1568605114967-8130f3a36994",
"https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
],
host:"Ravi Deshmukh",
hostPhone:"+91-10987-65432",
hostEmail:"ravi.deshmukh@email.com",
rating:4.3,
reviews:45,
listedOn:"2026-02-15",
visitTime:"11:00 AM - 7:00 PM",
securityDeposit:18000,
maintenance:1200
},
{
id:10,
title:"Modern Villa",
location:"Goa",
propertyType:"Villa",
price:75000,
bedrooms:5,
bathrooms:5,
area:2800,
description:"Stunning modern villa with pool and lush garden. Located in a peaceful area with easy access to beaches.",
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["Pool","Garden","Parking","WiFi","Security"],
images:[
"https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
"https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
],
host:"Maria Fernandes",
hostPhone:"+91-98765-01234",
hostEmail:"maria.fernandes@email.com",
rating:4.8,
reviews:112,
listedOn:"2026-01-18",
visitTime:"10:00 AM - 6:00 PM",
securityDeposit:75000,
maintenance:4000
},
{
id:11,
title:"Compact Apartment",
location:"Chennai",
propertyType:"Apartment",
price:18000,
bedrooms:1,
bathrooms:1,
area:500,
description:"Compact and efficient apartment ideal for singles or couples. Well-maintained building with security.",
furnishing:"Semi Furnished",
availability:"Within 15 Days",
amenities:["Lift","Security"],
images:[
"https://images.unsplash.com/photo-1494526585095-c41746248156",
"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
"https://images.unsplash.com/photo-1484154218962-a197022b5858"
],
host:"Suresh Iyer",
hostPhone:"+91-87654-12345",
hostEmail:"suresh.iyer@email.com",
rating:4.1,
reviews:34,
listedOn:"2026-02-08",
visitTime:"9:00 AM - 5:00 PM",
securityDeposit:18000,
maintenance:1000
},
{
id:12,
title:"Premium Villa",
location:"Hyderabad",
propertyType:"Villa",
price:80000,
bedrooms:5,
bathrooms:5,
area:3000,
description:"Premium villa with exquisite architecture and top-notch amenities. Features a private pool and gym.",
furnishing:"Fully Furnished",
availability:"Next Month",
amenities:["Pool","Gym","Parking","Garden","Power Backup"],
images:[
"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
"https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
"https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
"https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
],
host:"Ananya Reddy",
hostPhone:"+91-76543-23456",
hostEmail:"ananya.reddy@email.com",
rating:4.9,
reviews:156,
listedOn:"2026-01-12",
visitTime:"10:00 AM - 6:00 PM",
securityDeposit:80000,
maintenance:4500
},
{
id:13,
title:"Affordable Apartment",
location:"Indore",
propertyType:"Apartment",
price:14000,
bedrooms:2,
bathrooms:2,
area:720,
description:"Affordable apartment with basic amenities. Great value for money in a convenient location.",
furnishing:"Unfurnished",
availability:"Immediate",
amenities:["Parking","Lift"],
images:[
"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
"https://images.unsplash.com/photo-1494526585095-c41746248156",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
],
host:"Deepak Malhotra",
hostPhone:"+91-65432-34567",
hostEmail:"deepak.malhotra@email.com",
rating:3.9,
reviews:28,
listedOn:"2026-02-20",
visitTime:"11:00 AM - 7:00 PM",
securityDeposit:14000,
maintenance:800
},
{
id:14,
title:"Luxury Duplex",
location:"Ahmedabad",
propertyType:"Independent House",
price:48000,
bedrooms:4,
bathrooms:4,
area:1800,
description:"Stunning duplex house with modern design and premium finishes. Perfect for luxury living.",
furnishing:"Semi Furnished",
availability:"Within 15 Days",
amenities:["Parking","Garden","Power Backup","Security"],
images:[
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",
"https://images.unsplash.com/photo-1568605114967-8130f3a36994",
"https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
],
host:"Neha Shah",
hostPhone:"+91-54321-45678",
hostEmail:"neha.shah@email.com",
rating:4.7,
reviews:88,
listedOn:"2026-01-28",
visitTime:"9:00 AM - 5:00 PM",
securityDeposit:48000,
maintenance:2800
},
{
id:15,
title:"Student Friendly PG",
location:"Bangalore",
propertyType:"PG",
price:9000,
bedrooms:1,
bathrooms:1,
area:320,
description:"Student-friendly PG with AC and laundry facilities. Close to universities and tech parks.",
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["WiFi","Laundry","Security","AC"],
images:[
"https://images.unsplash.com/photo-1484154218962-a197022b5858",
"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
],
host:"Kiran Kumar",
hostPhone:"+91-43210-56789",
hostEmail:"kiran.kumar@email.com",
rating:4.4,
reviews:73,
listedOn:"2026-02-03",
visitTime:"10:00 AM - 6:00 PM",
securityDeposit:9000,
maintenance:600
},
{
id:16,
title:"Lake View Apartment",
location:"Pune",
propertyType:"Apartment",
price:31000,
bedrooms:2,
bathrooms:2,
area:950,
description:"Scenic lake view apartment with modern amenities. Peaceful location with stunning views.",
furnishing:"Fully Furnished",
availability:"Next Month",
amenities:["Parking","Gym","Lift","WiFi"],
images:[
"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
"https://images.unsplash.com/photo-1484154218962-a197022b5858",
"https://images.unsplash.com/photo-1494526585095-c41746248156"
],
host:"Rohit Sharma",
hostPhone:"+91-32109-67890",
hostEmail:"rohit.sharma@email.com",
rating:4.6,
reviews:95,
listedOn:"2026-01-08",
visitTime:"11:00 AM - 7:00 PM",
securityDeposit:31000,
maintenance:2000
},
{
id:17,
title:"Classic Villa",
location:"Jaipur",
propertyType:"Villa",
price:55000,
bedrooms:4,
bathrooms:4,
area:2100,
description:"Classic villa with traditional architecture and modern comforts. Beautiful garden and peaceful surroundings.",
furnishing:"Semi Furnished",
availability:"Immediate",
amenities:["Garden","Parking","Security"],
images:[
"https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
"https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",
"https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
],
host:"Rajiv Singh",
hostPhone:"+91-21098-78901",
hostEmail:"rajiv.singh@email.com",
rating:4.5,
reviews:67,
listedOn:"2026-02-12",
visitTime:"9:00 AM - 5:00 PM",
securityDeposit:55000,
maintenance:3500
},
{
id:18,
title:"Family Apartment",
location:"Surat",
propertyType:"Apartment",
price:24000,
bedrooms:3,
bathrooms:2,
area:1050,
description:"Family-friendly apartment with all necessary amenities. Safe neighborhood with good schools nearby.",
furnishing:"Semi Furnished",
availability:"Immediate",
amenities:["Lift","Parking","Security"],
images:[
"https://images.unsplash.com/photo-1494526585095-c41746248156",
"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
"https://images.unsplash.com/photo-1484154218962-a197022b5858",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
],
host:"Manish Patel",
hostPhone:"+91-10987-89012",
hostEmail:"manish.patel@email.com",
rating:4.3,
reviews:56,
listedOn:"2026-02-18",
visitTime:"10:00 AM - 6:00 PM",
securityDeposit:24000,
maintenance:1800
},
{
id:19,
title:"Luxury Smart Home",
location:"Mumbai",
propertyType:"Independent House",
price:95000,
bedrooms:5,
bathrooms:5,
area:3200,
description:"Ultra-modern smart home with AI-powered features and premium amenities. The future of luxury living.",
furnishing:"Fully Furnished",
availability:"Within 15 Days",
amenities:["Pool","Gym","Parking","WiFi","Power Backup","Security"],
images:[
"https://images.unsplash.com/photo-1568605114967-8130f3a36994",
"https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
"https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
],
host:"Aditya Shah",
hostPhone:"+91-98765-90123",
hostEmail:"aditya.shah@email.com",
rating:4.9,
reviews:178,
listedOn:"2026-01-02",
visitTime:"9:00 AM - 5:00 PM",
securityDeposit:95000,
maintenance:6000
},
{
id:20,
title:"Budget 1BHK",
location:"Nagpur",
propertyType:"Apartment",
price:12000,
bedrooms:1,
bathrooms:1,
area:450,
description:"Budget-friendly 1BHK apartment with basic amenities. Ideal for singles or small families on a budget.",
furnishing:"Unfurnished",
availability:"Immediate",
amenities:["Parking"],
images:[
"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
"https://images.unsplash.com/photo-1494526585095-c41746248156",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
],
host:"Sanjay Verma",
hostPhone:"+91-87654-01234",
hostEmail:"sanjay.verma@email.com",
rating:3.8,
reviews:34,
listedOn:"2026-02-22",
visitTime:"11:00 AM - 7:00 PM",
securityDeposit:12000,
maintenance:700
}
];
// Home data

export const cities = [
  {
    id: 1,
    name: "Mumbai",
    image: "https://images.unsplash.com/photo-1526481280695-3c4691f11d52?w=800&auto=format&fit=crop&q=80",
    properties: 1250,
  },
  {
    id: 2,
    name: "Delhi",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
    properties: 980,
  },
  {
    id: 3,
    name: "Bangalore",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80",
    properties: 1100,
  },
  {
    id: 4,
    name: "Chennai",
    image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&auto=format&fit=crop&q=80",
    properties: 750,
  },
  {
    id: 5,
    name: "Hyderabad",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    properties: 820,
  },
  {
    id: 6,
    name: "Pune",
    image: "https://images.unsplash.com/photo-1625731207891-5c96d7c7f39e?w=800&auto=format&fit=crop&q=80",
    properties: 650,
  },
  {
    id: 7,
    name: "Kolkata",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80",
    properties: 580,
  },
  {
    id: 8,
    name: "Ahmedabad",
    image: "https://images.unsplash.com/photo-1619026390971-65b9c9fbb8d0?w=800&auto=format&fit=crop&q=80",
    properties: 490,
  },
  {
    id: 9,
    name: "Jaipur",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80",
    properties: 430,
  },
  {
    id: 10,
    name: "Lucknow",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09d?w=800&auto=format&fit=crop&q=80",
    properties: 380,
  },
  {
    id: 11,
    name: "Nagpur",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&auto=format&fit=crop&q=80",
    properties: 320,
  },
  {
    id: 12,
    name: "Indore",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80",
    properties: 290,
  },
];


export const propertyTypes = [
  { value: "", label: "All Type" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "house", label: "House" },
  { value: "room", label: "Room" },
  { value: "studio", label: "Studio" },
];

export const budgets = [
  { value: "", label: "Any Budget" },
  { value: "10k-25k", label: "₹10K - ₹25K" },
  { value: "25k-50k", label: "₹25K - ₹50K" },
  { value: "50k-1l", label: "₹50K - ₹1L" },
  { value: "1l-2l", label: "₹1L - ₹2L" },
  { value: "2l+", label: "₹2L+" }, 
]
  