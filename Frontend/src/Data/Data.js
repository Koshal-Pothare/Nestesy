
import { Home ,Users, ChartLine,ShieldCheck,Settings,House,NotebookPen , Wallet,UserRoundPlus} from 'lucide-react'
// Home Page Data

export const cities = [
  {
    id: 1,
    name: "Mumbai",
    state: "Maharashtra",
    properties: "2.5K+",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800",
  },
  {
    id: 2,
    name: "Pune",
    state: "Maharashtra",
    properties: "1.8K+",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
  },
  {
    id: 3,
    name: "Bangalore",
    state: "Karnataka",
    properties: "3.2K+",
    image: "https://images.unsplash.com/photo-1533994201280-56ebd4a62693?w=800",
  },
  {
    id: 4,
    name: "Delhi",
    state: "Delhi",
    properties: "1.9K+",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
  },
  {
    id: 5,
    name: "Hyderabad",
    state: "Telangana",
    properties: "1.5K+",
    image: "https://images.unsplash.com/photo-1566070723696-a39017e90a78?w=800",
  },
  {
    id: 6,
    name: "Chennai",
    state: "Tamil Nadu",
    properties: "1.2K+",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  },
  {
     id: 7,
    name: "Chennai",
    state: "Tamil Nadu",
    properties: "1.2K+",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  },
   {
     id: 8,
    name: "Chennai",
    state: "Tamil Nadu",
    properties: "1.2K+",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  },
   {
     id: 9,
    name: "Chennai",
    state: "Tamil Nadu",
    properties: "1.2K+",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  },
   {
     id: 10,
    name: "Chennai",
    state: "Tamil Nadu",
    properties: "1.2K+",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  },
   {
     id: 11,
    name: "Chennai",
    state: "Tamil Nadu",
    properties: "1.2K+",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  },
   {
     id: 12,
    name: "Chennai",
    state: "Tamil Nadu",
    properties: "1.2K+",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  },
   {
     id: 13,
    name: "Chennai",
    state: "Tamil Nadu",
    properties: "1.2K+",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
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
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["Parking","WiFi","Lift","Security","Gym"],
image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
},
{
id:2,
title:"Luxury Villa with Garden",
location:"Pune",
propertyType:"Villa",
price:65000,
bedrooms:4,
furnishing:"Semi Furnished",
availability:"Within 15 Days",
amenities:["Parking","Pool","Garden","Security","Power Backup"],
image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
},
{
id:3,
title:"Affordable PG",
location:"Nagpur",
propertyType:"PG",
price:8500,
bedrooms:1,
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["WiFi","AC","Security"],
image:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
},
{
id:4,
title:"Spacious Independent House",
location:"Hyderabad",
propertyType:"Independent House",
price:35000,
bedrooms:3,
furnishing:"Semi Furnished",
availability:"Next Month",
amenities:["Parking","Garden","Power Backup"],
image:"https://images.unsplash.com/photo-1568605114967-8130f3a36994"
},
{
id:5,
title:"Premium Studio Apartment",
location:"Bangalore",
propertyType:"Apartment",
price:22000,
bedrooms:1,
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["WiFi","Lift","Gym"],
image:"https://images.unsplash.com/photo-1494526585095-c41746248156"
},
{
id:6,
title:"3BHK Family Apartment",
location:"Delhi",
propertyType:"Apartment",
price:42000,
bedrooms:3,
furnishing:"Semi Furnished",
availability:"Within 15 Days",
amenities:["Parking","Gym","Lift","Security"],
image:"https://images.unsplash.com/photo-1484154218962-a197022b5858"
},
{
id:7,
title:"Budget PG for Students",
location:"Pune",
propertyType:"PG",
price:7000,
bedrooms:1,
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["WiFi","Laundry","Security"],
image:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
},
{
id:8,
title:"Luxury Penthouse",
location:"Mumbai",
propertyType:"Apartment",
price:90000,
bedrooms:4,
furnishing:"Fully Furnished",
availability:"Next Month",
amenities:["Pool","Gym","Parking","Lift","Security"],
image:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
},
{
id:9,
title:"Cozy Independent House",
location:"Nagpur",
propertyType:"Independent House",
price:18000,
bedrooms:2,
furnishing:"Unfurnished",
availability:"Immediate",
amenities:["Parking","Garden"],
image:"https://images.unsplash.com/photo-1572120360610-d971b9d7767c"
},
{
id:10,
title:"Modern Villa",
location:"Goa",
propertyType:"Villa",
price:75000,
bedrooms:5,
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["Pool","Garden","Parking","WiFi","Security"],
image:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
},
{
id:11,
title:"Compact Apartment",
location:"Chennai",
propertyType:"Apartment",
price:18000,
bedrooms:1,
furnishing:"Semi Furnished",
availability:"Within 15 Days",
amenities:["Lift","Security"],
image:"https://images.unsplash.com/photo-1494526585095-c41746248156"
},
{
id:12,
title:"Premium Villa",
location:"Hyderabad",
propertyType:"Villa",
price:80000,
bedrooms:5,
furnishing:"Fully Furnished",
availability:"Next Month",
amenities:["Pool","Gym","Parking","Garden","Power Backup"],
image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
},
{
id:13,
title:"Affordable Apartment",
location:"Indore",
propertyType:"Apartment",
price:14000,
bedrooms:2,
furnishing:"Unfurnished",
availability:"Immediate",
amenities:["Parking","Lift"],
image:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
},
{
id:14,
title:"Luxury Duplex",
location:"Ahmedabad",
propertyType:"Independent House",
price:48000,
bedrooms:4,
furnishing:"Semi Furnished",
availability:"Within 15 Days",
amenities:["Parking","Garden","Power Backup","Security"],
image:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
id:15,
title:"Student Friendly PG",
location:"Bangalore",
propertyType:"PG",
price:9000,
bedrooms:1,
furnishing:"Fully Furnished",
availability:"Immediate",
amenities:["WiFi","Laundry","Security","AC"],
image:"https://images.unsplash.com/photo-1484154218962-a197022b5858"
},
{
id:16,
title:"Lake View Apartment",
location:"Pune",
propertyType:"Apartment",
price:31000,
bedrooms:2,
furnishing:"Fully Furnished",
availability:"Next Month",
amenities:["Parking","Gym","Lift","WiFi"],
image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
},
{
id:17,
title:"Classic Villa",
location:"Jaipur",
propertyType:"Villa",
price:55000,
bedrooms:4,
furnishing:"Semi Furnished",
availability:"Immediate",
amenities:["Garden","Parking","Security"],
image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
},
{
id:18,
title:"Family Apartment",
location:"Surat",
propertyType:"Apartment",
price:24000,
bedrooms:3,
furnishing:"Semi Furnished",
availability:"Immediate",
amenities:["Lift","Parking","Security"],
image:"https://images.unsplash.com/photo-1494526585095-c41746248156"
},
{
id:19,
title:"Luxury Smart Home",
location:"Mumbai",
propertyType:"Independent House",
price:95000,
bedrooms:5,
furnishing:"Fully Furnished",
availability:"Within 15 Days",
amenities:["Pool","Gym","Parking","WiFi","Power Backup","Security"],
image:"https://images.unsplash.com/photo-1568605114967-8130f3a36994"
},
{
id:20,
title:"Budget 1BHK",
location:"Nagpur",
propertyType:"Apartment",
price:12000,
bedrooms:1,
furnishing:"Unfurnished",
availability:"Immediate",
amenities:["Parking"],
image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
} 
];