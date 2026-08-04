import { Home ,Users, ChartLine,ShieldCheck,Settings,House,NotebookPen , Wallet,UserRoundPlus} from 'lucide-react'

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
        description: "List your property in minutes with our simple and intuitive process."
    },
    
    {
        title:"Easily Managable",
        icons:Settings,
        description:"Manage your listings, bookings, and tenant communications all in one place."
    }
]





export const HostSteps =[
    {id:1 , title:"Register" , icon: UserRoundPlus ,desc:"Sign up as a host and complete your profile verification"},
     {id:2 , title:"Add Property" , icon: House ,desc:"Add property details, photos, amenities and pricing"},
      {id:3 , title:"Get Booking" , icon: NotebookPen ,desc:"Recieve booking request from verified tenants."},
       {id:4 , title:"Earn & Manage" , icon: Wallet ,desc:"Approve booking, manage stay and earn hasle-free"},
]

