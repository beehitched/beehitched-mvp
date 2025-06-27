const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Wedding = require('./models/Wedding');
const Task = require('./models/Task');
const Guest = require('./models/Guest');
const Collaborator = require('./models/Collaborator');
const Message = require('./models/Message');

// Sample user data
const sampleUser = {
  name: 'Emily Chen',
  email: 'emily@example.com',
  password: 'password123',
  isActive: true
};

// Sample wedding data
const sampleWedding = {
  name: 'Emily & David\'s Wedding',
  weddingDate: new Date('2025-12-12T18:00:00.000Z'),
  venue: 'The Grand Ballroom at Sunset Gardens',
  theme: 'Romantic Garden Elegance',
  budget: 35000,
  guestCount: 180,
  description: 'A beautiful celebration of love in a romantic garden setting'
};

// Sample collaborators data
const sampleCollaborators = [
  {
    name: 'David Chen',
    email: 'david@example.com',
    role: 'Groom',
    status: 'accepted'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'Maid of Honor',
    status: 'accepted'
  },
  {
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'Best Man',
    status: 'accepted'
  },
  {
    name: 'Lisa Chen',
    email: 'lisa@example.com',
    role: 'Parent',
    status: 'accepted'
  }
];

// Sample tasks data
const sampleTasks = [
  {
    title: 'Book ceremony venue',
    description: 'Research and book the perfect ceremony location',
    category: 'Venue',
    status: 'Done',
    priority: 'High',
    dueDate: new Date('2025-03-15'),
    budget: 8000,
    assignedTo: 'Emily',
    assignedRoles: ['Bride', 'Planner'],
    notes: 'Deposit paid, contract signed for The Grand Ballroom',
    completionDetails: {
      vendorName: 'The Grand Ballroom',
      vendorContact: '555-123-4567 | venue@grandballroom.com',
      cost: '$7,800',
      dateCompleted: new Date('2025-02-15'),
      notes: 'Deposit of $2,000 paid. Contract signed for December 12th, 2025. Includes ceremony and reception space, catering, and basic decor.',
      attachments: []
    },
    completedDate: new Date('2025-02-15')
  },
  {
    title: 'Choose catering menu',
    description: 'Select appetizers, main course, and dessert options',
    category: 'Food',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date('2025-05-01'),
    budget: 5000,
    assignedTo: 'Emily',
    assignedRoles: ['Bride', 'Maid of Honor'],
    notes: 'Tasting scheduled for next week with 3 caterers'
  },
  {
    title: 'Order wedding cake',
    description: 'Design and order the wedding cake',
    category: 'Food',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2025-07-01'),
    budget: 800,
    assignedTo: 'Emily',
    assignedRoles: ['Bride'],
    notes: 'Need to decide on flavor and design - thinking vanilla with fresh berries'
  },
  {
    title: 'Book photographer',
    description: 'Hire professional wedding photographer',
    category: 'Photography',
    status: 'Done',
    priority: 'High',
    dueDate: new Date('2025-04-01'),
    budget: 3000,
    assignedTo: 'David',
    assignedRoles: ['Groom', 'Best Man'],
    notes: 'Booked with Sarah Photography - 8 hours coverage',
    completionDetails: {
      vendorName: 'Sarah Photography',
      vendorContact: '555-987-6543 | sarah@photography.com',
      cost: '$2,800',
      dateCompleted: new Date('2025-03-20'),
      notes: 'Deposit of $500 paid. Package includes engagement shoot, full day coverage, and 500 edited photos.',
      attachments: []
    },
    completedDate: new Date('2025-03-20')
  },
  {
    title: 'Choose wedding dress',
    description: 'Find and purchase the perfect wedding dress',
    category: 'Attire',
    status: 'Done',
    priority: 'High',
    dueDate: new Date('2025-06-01'),
    budget: 2500,
    assignedTo: 'Emily',
    assignedRoles: ['Bride', 'Maid of Honor'],
    notes: 'Found the perfect dress at Bridal Boutique!',
    completionDetails: {
      vendorName: 'Bridal Boutique',
      vendorContact: '555-456-7890 | info@bridalboutique.com',
      cost: '$2,300',
      dateCompleted: new Date('2025-05-15'),
      notes: 'Dress purchased and alterations scheduled. Includes veil and accessories.',
      attachments: []
    },
    completedDate: new Date('2025-05-15')
  },
  {
    title: 'Book DJ/Entertainment',
    description: 'Hire DJ for reception entertainment',
    category: 'Music',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: new Date('2025-06-15'),
    budget: 1200,
    assignedTo: 'David',
    assignedRoles: ['Groom', 'Best Man'],
    notes: 'Interviewing 3 DJs this week'
  },
  {
    title: 'Send out invitations',
    description: 'Design and send wedding invitations',
    category: 'Other',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date('2025-08-01'),
    budget: 800,
    assignedTo: 'Emily',
    assignedRoles: ['Bride', 'Maid of Honor'],
    notes: 'Need to finalize guest list first'
  },
  {
    title: 'Plan honeymoon',
    description: 'Book honeymoon destination and travel',
    category: 'Other',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2025-09-01'),
    budget: 5000,
    assignedTo: 'Both',
    assignedRoles: ['Bride', 'Groom'],
    notes: 'Thinking about Hawaii or Europe'
  },
  {
    title: 'Finalize guest list',
    description: 'Complete guest list and get addresses',
    category: 'Other',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date('2025-07-15'),
    budget: 0,
    assignedTo: 'Both',
    assignedRoles: ['Bride', 'Groom', 'Parent'],
    notes: 'Currently at 180 guests, need to finalize by next week'
  },
  {
    title: 'Book florist',
    description: 'Choose and book wedding florist',
    category: 'Decor',
    status: 'Done',
    priority: 'Medium',
    dueDate: new Date('2025-05-15'),
    budget: 2000,
    assignedTo: 'Emily',
    assignedRoles: ['Bride'],
    notes: 'Booked with Garden Blooms - romantic garden theme',
    completionDetails: {
      vendorName: 'Garden Blooms',
      vendorContact: '555-321-6547 | info@gardenblooms.com',
      cost: '$1,800',
      dateCompleted: new Date('2025-04-30'),
      notes: 'Deposit of $400 paid. Includes bridal bouquet, bridesmaid bouquets, boutonnieres, and ceremony/reception decor.',
      attachments: []
    },
    completedDate: new Date('2025-04-30')
  }
];

// Sample guests data
const sampleGuests = [
  {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, CA 90210',
    rsvpStatus: 'Attending',
    plusOne: false,
    dietaryRestrictions: 'None',
    assignedRoles: ['Friend'],
    notes: 'College friend of David',
    tableNumber: 5,
    giftReceived: false,
    thankYouSent: false
  },
  {
    name: 'Mary Johnson',
    email: 'mary.johnson@email.com',
    phone: '555-234-5678',
    address: '456 Oak Ave, Somewhere, CA 90211',
    rsvpStatus: 'Attending',
    plusOne: true,
    plusOneName: 'Tom Johnson',
    dietaryRestrictions: 'Vegetarian',
    assignedRoles: ['Friend'],
    notes: 'Work colleague of Emily',
    tableNumber: 3,
    giftReceived: true,
    thankYouSent: false
  },
  {
    name: 'Robert Chen',
    email: 'robert.chen@email.com',
    phone: '555-345-6789',
    address: '789 Pine St, Elsewhere, CA 90212',
    rsvpStatus: 'Pending',
    plusOne: false,
    dietaryRestrictions: 'None',
    assignedRoles: ['Other'],
    notes: 'David\'s uncle',
    tableNumber: 1,
    giftReceived: false,
    thankYouSent: false
  },
  {
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    phone: '555-456-7890',
    address: '321 Elm St, Nowhere, CA 90213',
    rsvpStatus: 'Attending',
    plusOne: false,
    dietaryRestrictions: 'Gluten-free',
    assignedRoles: ['Friend'],
    notes: 'Emily\'s childhood friend',
    tableNumber: 4,
    giftReceived: false,
    thankYouSent: false
  },
  {
    name: 'William Brown',
    email: 'william.brown@email.com',
    phone: '555-567-8901',
    address: '654 Maple Dr, Anywhere, CA 90214',
    rsvpStatus: 'Not Attending',
    plusOne: false,
    dietaryRestrictions: 'None',
    assignedRoles: ['Friend'],
    notes: 'David\'s college roommate - can\'t make it due to work',
    tableNumber: null,
    giftReceived: false,
    thankYouSent: false
  },
  {
    name: 'Patricia Davis',
    email: 'patricia.davis@email.com',
    phone: '555-678-9012',
    address: '987 Cedar Ln, Someplace, CA 90215',
    rsvpStatus: 'Attending',
    plusOne: true,
    plusOneName: 'James Davis',
    dietaryRestrictions: 'None',
    assignedRoles: ['Other'],
    notes: 'Emily\'s aunt',
    tableNumber: 2,
    giftReceived: true,
    thankYouSent: true
  },
  {
    name: 'Michael Wilson',
    email: 'michael.wilson@email.com',
    phone: '555-789-0123',
    address: '147 Birch Rd, Otherplace, CA 90216',
    rsvpStatus: 'Pending',
    plusOne: false,
    dietaryRestrictions: 'Vegan',
    assignedRoles: ['Friend'],
    notes: 'David\'s coworker',
    tableNumber: 6,
    giftReceived: false,
    thankYouSent: false
  },
  {
    name: 'Linda Anderson',
    email: 'linda.anderson@email.com',
    phone: '555-890-1234',
    address: '258 Spruce Way, Newplace, CA 90217',
    rsvpStatus: 'Attending',
    plusOne: false,
    dietaryRestrictions: 'None',
    assignedRoles: ['Other'],
    notes: 'Emily\'s cousin',
    tableNumber: 2,
    giftReceived: false,
    thankYouSent: false
  },
  {
    name: 'Christopher Taylor',
    email: 'christopher.taylor@email.com',
    phone: '555-901-2345',
    address: '369 Willow Ct, Oldplace, CA 90218',
    rsvpStatus: 'Attending',
    plusOne: true,
    plusOneName: 'Amanda Taylor',
    dietaryRestrictions: 'None',
    assignedRoles: ['Friend'],
    notes: 'David\'s best friend from high school',
    tableNumber: 1,
    giftReceived: false,
    thankYouSent: false
  },
  {
    name: 'Susan Martinez',
    email: 'susan.martinez@email.com',
    phone: '555-012-3456',
    address: '741 Aspen Blvd, Lastplace, CA 90219',
    rsvpStatus: 'Attending',
    plusOne: false,
    dietaryRestrictions: 'Dairy-free',
    assignedRoles: ['Other'],
    notes: 'David\'s sister',
    tableNumber: 1,
    giftReceived: true,
    thankYouSent: false
  }
];

// Sample messages data
const sampleMessages = [
  {
    senderName: 'Emily Chen',
    content: 'Hey everyone! I just confirmed the bridesmaid dress fittings for next week.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    senderName: 'Sarah Johnson',
    content: 'Perfect! I\'ll make sure everyone knows the schedule. What time should we meet?',
    timestamp: new Date(Date.now() - 1000 * 60 * 25) // 25 minutes ago
  },
  {
    senderName: 'David Chen',
    content: 'Thanks Sarah! That\'s a huge help. Emily, did you decide on the color scheme for the groomsmen?',
    timestamp: new Date(Date.now() - 1000 * 60 * 20) // 20 minutes ago
  },
  {
    senderName: 'Michael Chen',
    content: 'I\'m thinking navy blue would look great with the garden theme. What do you think?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    senderName: 'Emily Chen',
    content: 'Navy blue sounds perfect! It will complement the bridesmaid dresses beautifully.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
  },
  {
    senderName: 'Lisa Chen',
    content: 'Don\'t forget about the rehearsal dinner planning! We need to finalize the menu.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beehitched', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Seed function
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Wedding.deleteMany({});
    await Task.deleteMany({});
    await Guest.deleteMany({});
    await Collaborator.deleteMany({});
    await Message.deleteMany({});

    console.log('Cleared existing data');

    // Create main user
    const user = new User(sampleUser);
    await user.save();
    console.log(`Created user: ${user.name}`);

    // Create wedding
    const wedding = new Wedding({
      ...sampleWedding,
      createdBy: user._id
    });
    await wedding.save();
    console.log(`Created wedding: ${wedding.name}`);

    // Create main user as wedding owner
    const ownerCollaborator = new Collaborator({
      weddingId: wedding._id,
      userId: user._id,
      role: 'Owner',
      email: user.email,
      name: user.name,
      status: 'accepted',
      invitedBy: user._id,
      invitedAt: new Date(),
      acceptedAt: new Date(),
      permissions: {
        canView: true,
        canEditTimeline: true,
        canEditGuests: true,
        canEditShop: true,
        canInviteOthers: true,
        canManageRoles: true
      }
    });
    await ownerCollaborator.save();
    console.log(`Created owner collaborator for ${user.name}`);

    // Create additional collaborators
    for (const collaboratorData of sampleCollaborators) {
      // Create a user account for each collaborator
      const collaboratorUser = new User({
        name: collaboratorData.name,
        email: collaboratorData.email,
        password: 'password123',
        isActive: true
      });
      await collaboratorUser.save();
      console.log(`Created user for collaborator: ${collaboratorData.name}`);

      const collaborator = new Collaborator({
        weddingId: wedding._id,
        userId: collaboratorUser._id, // Use the new user's ID
        role: collaboratorData.role,
        email: collaboratorData.email,
        name: collaboratorData.name,
        status: collaboratorData.status,
        invitedBy: user._id,
        invitedAt: new Date(),
        acceptedAt: new Date(),
        permissions: {
          canView: true,
          canEditTimeline: collaboratorData.role === 'Maid of Honor' || collaboratorData.role === 'Best Man',
          canEditGuests: collaboratorData.role === 'Maid of Honor' || collaboratorData.role === 'Best Man',
          canEditShop: false,
          canInviteOthers: false,
          canManageRoles: false
        }
      });
      await collaborator.save();
      console.log(`Created collaborator: ${collaboratorData.name} (${collaboratorData.role})`);
    }

    // Create tasks
    for (const taskData of sampleTasks) {
      const task = new Task({
        ...taskData,
        user: user._id,
        createdBy: user._id,
        weddingId: wedding._id
      });
      await task.save();
    }
    console.log(`Created ${sampleTasks.length} tasks`);

    // Create guests
    for (const guestData of sampleGuests) {
      const guest = new Guest({
        ...guestData,
        user: user._id,
        createdBy: user._id,
        weddingId: wedding._id
      });
      await guest.save();
    }
    console.log(`Created ${sampleGuests.length} guests`);

    // Create messages
    for (const messageData of sampleMessages) {
      const message = new Message({
        weddingId: wedding._id,
        senderId: user._id,
        senderName: messageData.senderName,
        content: messageData.content,
        timestamp: messageData.timestamp
      });
      await message.save();
    }
    console.log(`Created ${sampleMessages.length} messages`);

    console.log('\nDatabase seeding completed successfully!');
    console.log(`Created 5 users: ${user.name} + 4 collaborators`);
    console.log(`Created 1 wedding: ${wedding.name}`);
    console.log(`Created ${sampleCollaborators.length + 1} collaborators (including owner)`);
    console.log(`Created ${sampleTasks.length} tasks`);
    console.log(`Created ${sampleGuests.length} guests`);
    console.log(`Created ${sampleMessages.length} messages`);

    console.log('\nTest Accounts:');
    console.log('Main User: emily@example.com / password123');
    console.log('Collaborators:');
    sampleCollaborators.forEach(collab => {
      console.log(`- ${collab.name}: ${collab.email} / password123 (${collab.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 