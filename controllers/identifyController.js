// const Contact = require('../models/Contact');

// exports.identify = async (req, res) => {
//   const { email, phoneNumber } = req.body;

//   try {
//     // Step 1: Check if contact already exists
//     const existingContacts = await Contact.find({
//       $or: [{ email }, { phoneNumber }],
//     });

//     // Step 2: If no contacts exist, create a new primary contact
//     if (existingContacts.length === 0) {
//       const newContact = await Contact.create({
//         email,
//         phoneNumber,
//         linkPrecedence: 'primary',
//       });

//       return res.status(200).json({
//         primaryContactId: newContact._id,
//         emails: [newContact.email],
//         phoneNumbers: [newContact.phoneNumber],
//         secondaryContactIds: [],
//       });
//     }

//     // Step 3: If contacts exist, link as secondary
//     const primaryContact = existingContacts.find((contact) => contact.linkPrecedence === 'primary');
//     const newSecondaryContact = await Contact.create({
//       email,
//       phoneNumber,
//       linkedId: primaryContact._id,
//       linkPrecedence: 'secondary',
//     });

//     // Step 4: Prepare response
//     const allContacts = await Contact.find({
//       $or: [{ _id: primaryContact._id }, { linkedId: primaryContact._id }],
//     });

//     const emails = [...new Set(allContacts.map((contact) => contact.email).filter(Boolean))];
//     const phoneNumbers = [...new Set(allContacts.map((contact) => contact.phoneNumber).filter(Boolean))];
//     const secondaryContactIds = allContacts
//       .filter((contact) => contact.linkPrecedence === 'secondary')
//       .map((contact) => contact._id);

//     return res.status(200).json({
//       primaryContactId: primaryContact._id,
//       emails,
//       phoneNumbers,
//       secondaryContactIds,
//     });
//   } catch (error) {
//     console.error('Error in identify endpoint:', error);
//     return res.status(500).json({ message: 'An error occurred while processing your request' });
//   }
// };

const Contact = require("../models/Contact");

exports.identify = async (req, res) => {
  const { email, phoneNumber } = req.body;

  // Edge Case: If both email and phoneNumber are missing
  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json({ message: "At least one of email or phoneNumber is required" });
  }

  // Edge Case: Validate email and phoneNumber format (basic validation)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  try {
    // Step 1: Check if contact already exists
    const existingContacts = await Contact.find({
      $or: [{ email }, { phoneNumber }],
    });

    // Step 2: If no contacts exist, create a new primary contact
    if (existingContacts.length === 0) {
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });

      return res.status(200).json({
        primaryContactId: newContact._id,
        emails: [newContact.email].filter(Boolean),
        phoneNumbers: [newContact.phoneNumber].filter(Boolean),
        secondaryContactIds: [],
      });
    }

    // Step 3: Find the primary contact
    let primaryContact = existingContacts.find(
      (contact) => contact.linkPrecedence === "primary"
    );

    // Edge Case: If no primary contact found, convert the oldest contact to primary
    if (!primaryContact) {
      primaryContact = existingContacts.sort(
        (a, b) => a.createdAt - b.createdAt
      )[0];
      primaryContact.linkPrecedence = "primary";
      await primaryContact.save();
    }

    // Step 4: Check if new information is provided
    const newEmail =
      email && !existingContacts.some((contact) => contact.email === email);
    const newPhone =
      phoneNumber &&
      !existingContacts.some((contact) => contact.phoneNumber === phoneNumber);

    // Step 5: Create a secondary contact only if new information is provided
    if (newEmail || newPhone) {
      await Contact.create({
        email: newEmail ? email : null,
        phoneNumber: newPhone ? phoneNumber : null,
        linkedId: primaryContact._id,
        linkPrecedence: "secondary",
      });
    }

    // Step 6: Fetch all linked contacts
    const allContacts = await Contact.find({
      $or: [{ _id: primaryContact._id }, { linkedId: primaryContact._id }],
    });

    // Step 7: Prepare response
    const emails = [
      ...new Set(allContacts.map((contact) => contact.email).filter(Boolean)),
    ];
    const phoneNumbers = [
      ...new Set(
        allContacts.map((contact) => contact.phoneNumber).filter(Boolean)
      ),
    ];
    const secondaryContactIds = allContacts
      .filter((contact) => contact.linkPrecedence === "secondary")
      .map((contact) => contact._id);

    return res.status(200).json({
      primaryContactId: primaryContact._id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    });
  } catch (error) {
    console.error("Error in identify endpoint:", error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred" });
  }
};
