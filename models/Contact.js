
const mongoose = require('mongoose');  // Import mongoose to define the schema and interact with MongoDB

// Define the Contact Schema using mongoose.Schema
const ContactSchema = new mongoose.Schema({
  // phoneNumber field: stores phone numbers, optional and indexed for fast queries
  phoneNumber: { 
    type: String,        // Type is String
    required: false,     // Not required for every contact
    index: true,         // Index added for faster lookups on this field
  },

  // email field: stores email addresses, optional and indexed for fast queries
  email: { 
    type: String,        // Type is String
    required: false,     // Not required for every contact
    index: true,         // Index added for faster lookups on this field
  },

  // linkedId field: references another Contact document if the contact is linked
  linkedId: { 
    type: mongoose.Schema.Types.ObjectId,  // References another document using ObjectId
    ref: 'Contact',         // Refers to the 'Contact' model, allowing population of linked contact details
    required: false,        // Not required, a contact might not have a linked contact
  },

  // linkPrecedence field: determines if the contact is a 'primary' or 'secondary' contact
  linkPrecedence: { 
    type: String,          // Type is String
    enum: ['primary', 'secondary'],  // Only allows 'primary' or 'secondary' as valid values
    required: true,        // This field is required
  },

  // createdAt field: stores the date the contact was created, default is current date/time
  createdAt: { 
    type: Date,            // Type is Date
    default: Date.now,     // Default value is the current date and time when the document is created
  },

  // updatedAt field: stores the date the contact was last updated, default is current date/time
  updatedAt: { 
    type: Date,            // Type is Date
    default: Date.now,     // Default value is the current date and time when the document is created
  },

  // deletedAt field: optional field to store the date when a contact is deleted (soft delete)
  deletedAt: { 
    type: Date,            // Type is Date
    required: false,       // Optional, not every contact will have a deletion date
  },
});

// Create a Contact model based on the ContactSchema
const Contact = mongoose.model('Contact', ContactSchema);

// Export the Contact model to use it in other parts of the application
module.exports = Contact;
