const asyncHandler = require("express-async-handler");
const Contact = require("../models/Contact");
const { sendEmail } = require("../services/brevoService");

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message, subject } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Please provide name, email, and message");
  }

  const contact = await Contact.create({
    name,
    email,
    phone: phone || "",
    message,
    subject: subject || "General Inquiry",
    status: "pending",
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
        <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
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
// @route   GET /api/contact or /api/admin/inquiries
// @access  Private (Admin)
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  const formattedInquiries = contacts.map((c) => ({
    id: c._id,
    _id: c._id,
    name: c.name || "Anonymous",
    email: c.email || "N/A",
    phone: c.phone || "N/A",
    subject: c.subject || (c.message?.length > 40 ? c.message.slice(0, 40) + "..." : c.message) || "General Inquiry",
    message: c.message || "",
    status: c.status || "pending",
    date: c.createdAt
      ? new Date(c.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A",
    createdAt: c.createdAt,
  }));

  res.status(200).json({
    success: true,
    count: contacts.length,
    contacts: formattedInquiries,
    inquiries: formattedInquiries,
  });
});

// @desc    Update contact status (Admin)
// @route   PUT /api/contact/:id/status or /api/admin/inquiries/:id/status
// @access  Private (Admin)
const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact inquiry not found");
  }

  if (status) contact.status = status;
  await contact.save();

  res.status(200).json({
    success: true,
    message: "Inquiry status updated successfully",
    contact,
  });
});

// @desc    Delete contact inquiry (Admin)
// @route   DELETE /api/contact/:id or /api/admin/inquiries/:id
// @access  Private (Admin)
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact inquiry not found");
  }

  await Contact.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Inquiry deleted successfully",
  });
});

module.exports = {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
};
