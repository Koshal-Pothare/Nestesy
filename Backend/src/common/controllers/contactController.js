const asyncHandler = require("express-async-handler");
const Contact = require("../models/Contact");
const { sendEmail } = require("../services/brevoService");

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Please provide name, email, and message");
  }

  const contact = await Contact.create({
    name,
    email,
    phone: phone || "",
    message,
  });

  // Attempt to send email via Brevo if configured
  try {
    await sendEmail({
      to: process.env.BREVO_SENDER_EMAIL || "support@nestesy.com",
      subject: `New Contact Inquiry from ${name}`,
      htmlContent: `
        <h3>New Inquiry Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });
  } catch (emailErr) {
    console.warn("Contact notification email warning:", emailErr.message);
  }

  res.status(201).json({
    success: true,
    message: "Thank you for contacting Nestesy! We will get back to you shortly.",
    contact,
  });
});

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private (Admin)
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: contacts.length,
    contacts,
  });
});

module.exports = {
  createContact,
  getContacts,
};
