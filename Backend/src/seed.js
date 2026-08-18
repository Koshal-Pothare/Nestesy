require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/database');
const Admin = require('./admin/models/Admin');
const Owner = require('./owner/models/Owner');
const Tenant = require('./tenant/models/Tenant');
const Property = require('./owner/models/Property');
const Booking = require('./tenant/models/Booking');
const Review = require('./tenant/models/Review');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing collection data...');

    await Promise.all([
      Admin.deleteMany({}),
      Owner.deleteMany({}),
      Tenant.deleteMany({}),
      Property.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
    ]);

    console.log('Seeding Admins...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const admins = await Admin.create([
      {
        name: 'Nestesy Super Admin',
        username: 'nestesy_admin',
        email: 'admin@nestesy.com',
        password: hashedAdminPassword,
        phone: '9900000000',
        role: 'superadmin',
        isActive: true,
      },
      {
        name: 'Ananya Roy',
        username: 'ananya_admin',
        email: 'ananya@nestesy.com',
        password: hashedAdminPassword,
        phone: '9900000001',
        role: 'admin',
        isActive: true,
      },
    ]);

    console.log('Seeding Hosts / Owners...');
    const hashedHostPassword = await bcrypt.hash('host123', 10);
    const hosts = await Owner.create([
      {
        name: 'Rahul Sharma',
        username: 'rahul_sharma',
        email: 'rahul@gmail.com',
        password: hashedHostPassword,
        phone: '9876543210',
        city: 'Pune',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Amit Patil',
        username: 'amit_patil',
        email: 'amit@gmail.com',
        password: hashedHostPassword,
        phone: '9876543211',
        city: 'Mumbai',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Priya Joshi',
        username: 'priya_joshi',
        email: 'priya@gmail.com',
        password: hashedHostPassword,
        phone: '9876543212',
        city: 'Nagpur',
        isVerified: false,
        isActive: true,
      },
      {
        name: 'Sneha Kulkarni',
        username: 'sneha_k',
        email: 'sneha@gmail.com',
        password: hashedHostPassword,
        phone: '9876543213',
        city: 'Nashik',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Vikram Malhotra',
        username: 'vikram_m',
        email: 'vikram@gmail.com',
        password: hashedHostPassword,
        phone: '9876543214',
        city: 'Bangalore',
        isVerified: true,
        isActive: true,
      },
    ]);

    console.log('Seeding Tenants...');
    const hashedTenantPassword = await bcrypt.hash('tenant123', 10);
    const tenants = await Tenant.create([
      {
        name: 'Arjun Verma',
        username: 'arjun_v',
        email: 'arjun@gmail.com',
        password: hashedTenantPassword,
        phone: '9988776655',
        city: 'Pune',
        isActive: true,
      },
      {
        name: 'Neha Reddy',
        username: 'neha_r',
        email: 'neha@gmail.com',
        password: hashedTenantPassword,
        phone: '9988776644',
        city: 'Bangalore',
        isActive: true,
      },
      {
        name: 'Rohan Kulkarni',
        username: 'rohan_k',
        email: 'rohan@gmail.com',
        password: hashedTenantPassword,
        phone: '9988776633',
        city: 'Mumbai',
        isActive: true,
      },
      {
        name: 'Anjali Mehta',
        username: 'anjali_m',
        email: 'anjali@gmail.com',
        password: hashedTenantPassword,
        phone: '9988776622',
        city: 'Hyderabad',
        isActive: true,
      },
      {
        name: 'Vikas Shah',
        username: 'vikas_s',
        email: 'vikas@gmail.com',
        password: hashedTenantPassword,
        phone: '9988776611',
        city: 'Pune',
        isActive: true,
      },
    ]);

    console.log('Seeding Properties...');
    const properties = await Property.create([
      {
        ownerId: hosts[0]._id, // Rahul Sharma
        title: 'Modern 2 BHK Apartment in Baner',
        description: 'Spacious and well-ventilated 2BHK flat with modern interiors, modular kitchen, and scenic balcony view.',
        propertyType: 'Apartment',
        bhk: 2,
        bathrooms: 2,
        area: 1150,
        rent: 28000,
        deposit: 75000,
        furnished: 'Semi-Furnished',
        tenantPreference: 'Family',
        amenities: ['Parking', 'Lift', 'Gym', 'Swimming Pool', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
        ],
        city: 'Pune',
        locality: 'Baner',
        address: 'Sector 4, Near Balewadi High Street, Baner, Pune',
        coordinates: { type: 'Point', coordinates: [73.7868, 18.559] },
        status: 'approved',
        views: 142,
      },
      {
        ownerId: hosts[0]._id, // Rahul Sharma
        title: 'Luxury 3 BHK Flat in Wakad',
        description: 'Premium gated community 3BHK flat with club access, power backup, and 24/7 security.',
        propertyType: 'Apartment',
        bhk: 3,
        bathrooms: 3,
        area: 1550,
        rent: 42000,
        deposit: 120000,
        furnished: 'Furnished',
        tenantPreference: 'Any',
        amenities: ['Parking', 'Pet Friendly', 'Lift', 'Gym', 'Swimming Pool', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3'],
        city: 'Pune',
        locality: 'Wakad',
        address: 'Datta Mandir Road, Wakad, Pune',
        coordinates: { type: 'Point', coordinates: [73.7626, 18.5987] },
        status: 'pending',
        views: 45,
      },
      {
        ownerId: hosts[1]._id, // Amit Patil
        title: 'Sea View 2BHK Apartment in Andheri',
        description: 'Elegant apartment near Western Express Highway with stunning city line view.',
        propertyType: 'Apartment',
        bhk: 2,
        bathrooms: 2,
        area: 980,
        rent: 55000,
        deposit: 150000,
        furnished: 'Furnished',
        tenantPreference: 'Bachelor',
        amenities: ['Parking', 'Lift', 'Gym'],
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'],
        city: 'Mumbai',
        locality: 'Andheri West',
        address: 'Lokhandwala Complex, Andheri West, Mumbai',
        coordinates: { type: 'Point', coordinates: [72.8277, 19.1363] },
        status: 'approved',
        views: 290,
      },
      {
        ownerId: hosts[4]._id, // Vikram Malhotra
        title: 'Luxury Villa with Private Garden in Whitefield',
        description: 'Spacious independent 4BHK villa featuring private garden, covered garage, and servant quarters.',
        propertyType: 'Villa',
        bhk: 4,
        bathrooms: 4,
        area: 3200,
        rent: 110000,
        deposit: 400000,
        furnished: 'Furnished',
        tenantPreference: 'Family',
        amenities: ['Parking', 'Pet Friendly', 'Gym', 'Swimming Pool', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
        city: 'Bangalore',
        locality: 'Whitefield',
        address: 'ITPB Main Road, Whitefield, Bangalore',
        coordinates: { type: 'Point', coordinates: [77.7499, 12.9698] },
        status: 'approved',
        views: 512,
      },
      {
        ownerId: hosts[2]._id, // Priya Joshi
        title: 'Spacious 2 BHK in Dharampeth',
        description: 'Centrally located residential house close to top market hubs and schools.',
        propertyType: 'Independent House',
        bhk: 2,
        bathrooms: 2,
        area: 1200,
        rent: 22000,
        deposit: 50000,
        furnished: 'Unfurnished',
        tenantPreference: 'Family',
        amenities: ['Parking', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d'],
        city: 'Nagpur',
        locality: 'Dharampeth',
        address: 'West High Court Road, Dharampeth, Nagpur',
        coordinates: { type: 'Point', coordinates: [79.0669, 21.1438] },
        status: 'pending',
        views: 32,
      },
      {
        ownerId: hosts[3]._id, // Sneha Kulkarni
        title: 'Green Valley 2BHK House',
        description: 'Peaceful living space with abundant greenery, solar power backup, and wide parking space.',
        propertyType: 'Independent House',
        bhk: 2,
        bathrooms: 2,
        area: 1100,
        rent: 18000,
        deposit: 40000,
        furnished: 'Semi-Furnished',
        tenantPreference: 'Any',
        amenities: ['Parking', 'Pet Friendly', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde'],
        city: 'Nashik',
        locality: 'Gangapur Road',
        address: 'Navshya Ganpati Chowk, Gangapur Road, Nashik',
        coordinates: { type: 'Point', coordinates: [73.765, 20.005] },
        status: 'approved',
        views: 88,
      },
    ]);

    console.log('Seeding Bookings...');
    const bookings = await Booking.create([
      {
        tenantId: tenants[0]._id, // Arjun
        ownerId: hosts[0]._id, // Rahul
        propertyId: properties[0]._id, // Baner 2BHK
        visitDate: new Date('2026-08-20'),
        visitTime: '10:00 AM',
        status: 'confirmed',
      },
      {
        tenantId: tenants[1]._id, // Neha
        ownerId: hosts[4]._id, // Vikram
        propertyId: properties[3]._id, // Whitefield Villa
        visitDate: new Date('2026-08-22'),
        visitTime: '02:30 PM',
        status: 'pending',
      },
      {
        tenantId: tenants[2]._id, // Rohan
        ownerId: hosts[1]._id, // Amit
        propertyId: properties[2]._id, // Sea View Andheri
        visitDate: new Date('2026-08-15'),
        visitTime: '11:00 AM',
        status: 'completed',
      },
      {
        tenantId: tenants[4]._id, // Vikas
        ownerId: hosts[0]._id, // Rahul
        propertyId: properties[1]._id, // Wakad 3BHK
        visitDate: new Date('2026-08-25'),
        visitTime: '05:00 PM',
        status: 'pending',
      },
    ]);

    console.log('Seeding Reviews...');
    await Review.create([
      {
        propertyId: properties[2]._id,
        tenantId: tenants[2]._id,
        rating: 5,
        comment: 'Great property! Modern fixtures, great host, and very smooth visit experience.',
      },
      {
        propertyId: properties[0]._id,
        tenantId: tenants[0]._id,
        rating: 4,
        comment: 'Clean flat in a prime location. Owner Rahul was very cooperative.',
      },
    ]);

    console.log('\n=============================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Demo Credentials for Testing:');
    console.log('---------------------------------------------');
    console.log('ADMIN:');
    console.log('  Email: admin@nestesy.com | Password: admin123');
    console.log('  Email: ananya@nestesy.com | Password: admin123');
    console.log('HOST / OWNER:');
    console.log('  Email: rahul@gmail.com | Password: host123');
    console.log('  Email: amit@gmail.com  | Password: host123');
    console.log('TENANT / RENTER:');
    console.log('  Email: arjun@gmail.com | Password: tenant123');
    console.log('  Email: neha@gmail.com  | Password: tenant123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
