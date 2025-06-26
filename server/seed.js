const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');
const Guest = require('./models/Guest');
const Product = require('./models/Product');
const WeddingRole = require('./models/WeddingRole');
const Collaborator = require('./models/Collaborator');

// Sample user data
const sampleUsers = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    partnerName: 'Michael Johnson',
    weddingDate: new Date('2024-09-15'),
    budget: 25000,
    guestCount: 150,
    venue: 'The Grand Ballroom',
    theme: 'Rustic Elegance'
  },
  {
    name: 'Emily Chen',
    email: 'emily@example.com',
    password: 'password123',
    partnerName: 'David Chen',
    weddingDate: new Date('2024-10-20'),
    budget: 30000,
    guestCount: 200,
    venue: 'Sunset Gardens',
    theme: 'Modern Minimalist'
  }
];

// Sample wedding roles
const sampleWeddingRoles = [
  {
    name: 'Bride',
    color: '#FF69B4',
    permissions: {
      canView: true,
      canEditTimeline: true,
      canEditGuests: true,
      canEditShop: true,
      canInviteOthers: true,
      canManageRoles: true
    }
  },
  {
    name: 'Groom',
    color: '#4169E1',
    permissions: {
      canView: true,
      canEditTimeline: true,
      canEditGuests: true,
      canEditShop: true,
      canInviteOthers: true,
      canManageRoles: true
    }
  },
  {
    name: 'Planner',
    color: '#32CD32',
    permissions: {
      canView: true,
      canEditTimeline: true,
      canEditGuests: true,
      canEditShop: true,
      canInviteOthers: true,
      canManageRoles: false
    }
  },
  {
    name: 'Maid of Honor',
    color: '#FFB6C1',
    permissions: {
      canView: true,
      canEditTimeline: true,
      canEditGuests: true,
      canEditShop: false,
      canInviteOthers: false,
      canManageRoles: false
    }
  },
  {
    name: 'Best Man',
    color: '#87CEEB',
    permissions: {
      canView: true,
      canEditTimeline: true,
      canEditGuests: true,
      canEditShop: false,
      canInviteOthers: false,
      canManageRoles: false
    }
  },
  {
    name: 'Parent',
    color: '#DDA0DD',
    permissions: {
      canView: true,
      canEditTimeline: false,
      canEditGuests: false,
      canEditShop: false,
      canInviteOthers: false,
      canManageRoles: false
    }
  },
  {
    name: 'Friend',
    color: '#F0E68C',
    permissions: {
      canView: true,
      canEditTimeline: false,
      canEditGuests: false,
      canEditShop: false,
      canInviteOthers: false,
      canManageRoles: false
    }
  }
];

// Sample tasks data with role assignments
const sampleTasks = [
  // Venue tasks
  {
    title: 'Book ceremony venue',
    description: 'Research and book the perfect ceremony location',
    category: 'Venue',
    status: 'Done',
    priority: 'High',
    dueDate: new Date('2024-03-15'),
    budget: 5000,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride', 'Planner'],
    notes: 'Deposit paid, contract signed',
    completionDetails: {
      vendorName: 'The Grand Ballroom',
      vendorContact: '555-123-4567 | venue@grandballroom.com',
      cost: '$4,800',
      dateCompleted: new Date('2024-02-15'),
      notes: 'Deposit of $1,200 paid. Contract signed for September 15th, 2024. Includes ceremony and reception space, catering, and basic decor.',
      attachments: []
    },
    completedDate: new Date('2024-02-15')
  },
  {
    title: 'Book reception venue',
    description: 'Secure reception venue with catering options',
    category: 'Venue',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date('2024-04-01'),
    budget: 8000,
    assignedTo: 'Michael',
    assignedRoles: ['Groom', 'Planner'],
    notes: 'Touring 3 venues this week'
  },
  {
    title: 'Visit venue for final walkthrough',
    description: 'Final venue inspection and layout planning',
    category: 'Venue',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2024-08-15'),
    budget: 0,
    assignedTo: 'Both',
    assignedRoles: ['Bride', 'Groom', 'Planner'],
    notes: 'Schedule with venue coordinator'
  },

  // Food tasks
  {
    title: 'Choose catering menu',
    description: 'Select appetizers, main course, and dessert options',
    category: 'Food',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date('2024-05-01'),
    budget: 3000,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride', 'Maid of Honor'],
    notes: 'Tasting scheduled for next week'
  },
  {
    title: 'Order wedding cake',
    description: 'Design and order the wedding cake',
    category: 'Food',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2024-07-01'),
    budget: 500,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride'],
    notes: 'Need to decide on flavor and design'
  },
  {
    title: 'Arrange alcohol service',
    description: 'Coordinate with venue for bar service',
    category: 'Food',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2024-06-15'),
    budget: 1500,
    assignedTo: 'Michael',
    assignedRoles: ['Groom', 'Best Man'],
    notes: 'Check venue\'s alcohol policy'
  },

  // Decor tasks
  {
    title: 'Choose floral arrangements',
    description: 'Select bouquets, centerpieces, and ceremony flowers',
    category: 'Decor',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2024-06-01'),
    budget: 2000,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride', 'Maid of Honor'],
    notes: 'Schedule consultation with florist'
  },
  {
    title: 'Order table linens',
    description: 'Select tablecloths, napkins, and chair covers',
    category: 'Decor',
    status: 'To Do',
    priority: 'Low',
    dueDate: new Date('2024-07-15'),
    budget: 800,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride'],
    notes: 'Need to match wedding colors'
  },
  {
    title: 'Design ceremony backdrop',
    description: 'Create beautiful ceremony arch or backdrop',
    category: 'Decor',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2024-08-01'),
    budget: 600,
    assignedTo: 'Michael',
    assignedRoles: ['Groom', 'Best Man'],
    notes: 'Consider DIY option to save money'
  },

  // Attire tasks
  {
    title: 'Buy wedding dress',
    description: 'Find and purchase the perfect wedding dress',
    category: 'Attire',
    status: 'Done',
    priority: 'High',
    dueDate: new Date('2024-02-15'),
    budget: 2000,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride', 'Maid of Honor'],
    notes: 'Dress purchased, alterations scheduled',
    completionDetails: {
      vendorName: 'Bridal Boutique Elegance',
      vendorContact: '555-987-6543 | info@bridalelegance.com',
      cost: '$1,850',
      dateCompleted: new Date('2024-01-20'),
      notes: 'Purchased A-line lace dress with cathedral train. Alterations scheduled for August. Includes veil and accessories.',
      attachments: []
    },
    completedDate: new Date('2024-01-20')
  },
  {
    title: 'Choose bridesmaid dresses',
    description: 'Select and order bridesmaid dresses',
    category: 'Attire',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: new Date('2024-04-15'),
    budget: 1200,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride', 'Maid of Honor'],
    notes: 'Need to coordinate with bridesmaids'
  },
  {
    title: 'Rent groom\'s tuxedo',
    description: 'Select and rent groom\'s wedding attire',
    category: 'Attire',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2024-07-01'),
    budget: 300,
    assignedTo: 'Michael',
    assignedRoles: ['Groom', 'Best Man'],
    notes: 'Schedule fitting appointment'
  },

  // Photography tasks
  {
    title: 'Hire wedding photographer',
    description: 'Research and book wedding photographer',
    category: 'Photography',
    status: 'Done',
    priority: 'High',
    dueDate: new Date('2024-03-01'),
    budget: 2500,
    assignedTo: 'Both',
    assignedRoles: ['Bride', 'Groom', 'Planner'],
    notes: 'Photographer booked, engagement session scheduled',
    completionDetails: {
      vendorName: 'Sarah\'s Photography Studio',
      vendorContact: '555-456-7890 | sarah@photostudio.com',
      cost: '$2,400',
      dateCompleted: new Date('2024-02-15'),
      notes: 'Booked for 8 hours coverage. Includes engagement session, wedding day photography, and 200 edited photos. Contract signed with 50% deposit.',
      attachments: []
    },
    completedDate: new Date('2024-02-15')
  },
  {
    title: 'Create shot list',
    description: 'Compile list of must-have photos',
    category: 'Photography',
    status: 'To Do',
    priority: 'Low',
    dueDate: new Date('2024-08-01'),
    budget: 0,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride', 'Maid of Honor'],
    notes: 'Include family photos and special moments'
  },
  {
    title: 'Book videographer',
    description: 'Hire professional wedding videographer',
    category: 'Photography',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2024-05-15'),
    budget: 1800,
    assignedTo: 'Michael',
    assignedRoles: ['Groom', 'Best Man'],
    notes: 'Research local videographers'
  },

  // Music tasks
  {
    title: 'Hire DJ or band',
    description: 'Book entertainment for reception',
    category: 'Music',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: new Date('2024-05-01'),
    budget: 1200,
    assignedTo: 'Michael',
    assignedRoles: ['Groom', 'Best Man'],
    notes: 'Interviewing 3 DJs this week'
  },
  {
    title: 'Choose ceremony music',
    description: 'Select processional, recessional, and ceremony songs',
    category: 'Music',
    status: 'To Do',
    priority: 'Low',
    dueDate: new Date('2024-07-15'),
    budget: 0,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride', 'Maid of Honor'],
    notes: 'Coordinate with ceremony musicians'
  },
  {
    title: 'Create reception playlist',
    description: 'Compile songs for cocktail hour and dancing',
    category: 'Music',
    status: 'To Do',
    priority: 'Low',
    dueDate: new Date('2024-08-01'),
    budget: 0,
    assignedTo: 'Both',
    assignedRoles: ['Bride', 'Groom'],
    notes: 'Include special songs for first dance'
  },

  // Transportation tasks
  {
    title: 'Book limo service',
    description: 'Arrange transportation for wedding party',
    category: 'Transportation',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date('2024-06-15'),
    budget: 800,
    assignedTo: 'Michael',
    assignedRoles: ['Groom', 'Best Man'],
    notes: 'Need transportation for 8 people'
  },
  {
    title: 'Arrange guest shuttle',
    description: 'Coordinate shuttle service for guests',
    category: 'Transportation',
    status: 'To Do',
    priority: 'Low',
    dueDate: new Date('2024-07-01'),
    budget: 500,
    assignedTo: 'Michael',
    assignedRoles: ['Groom'],
    notes: 'From hotel to venue and back'
  },
  {
    title: 'Book airport transfers',
    description: 'Arrange transportation for out-of-town guests',
    category: 'Transportation',
    status: 'To Do',
    priority: 'Low',
    dueDate: new Date('2024-08-01'),
    budget: 300,
    assignedTo: 'Sarah',
    assignedRoles: ['Bride'],
    notes: 'For immediate family only'
  }
];

// Sample guests data with role assignments
const sampleGuests = [
  {
    name: 'Jennifer Smith',
    email: 'jennifer.smith@email.com',
    phone: '(555) 123-4567',
    rsvpStatus: 'Attending',
    dietaryRestrictions: 'Vegetarian',
    group: 'Bride\'s Family',
    tableNumber: 1,
    isVip: true,
    assignedRoles: ['Parent'],
    notes: 'Aunt - mother\'s sister'
  },
  {
    name: 'Robert Johnson',
    email: 'robert.johnson@email.com',
    phone: '(555) 234-5678',
    rsvpStatus: 'Attending',
    dietaryRestrictions: '',
    group: 'Groom\'s Family',
    tableNumber: 2,
    isVip: true,
    assignedRoles: ['Parent'],
    notes: 'Father of the groom'
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '(555) 345-6789',
    rsvpStatus: 'Attending',
    dietaryRestrictions: 'Gluten-free',
    group: 'Bride\'s Friends',
    tableNumber: 3,
    isVip: false,
    assignedRoles: ['Maid of Honor'],
    notes: 'College roommate'
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '(555) 456-7890',
    rsvpStatus: 'Not Attending',
    dietaryRestrictions: '',
    group: 'Groom\'s Friends',
    tableNumber: null,
    isVip: false,
    assignedRoles: ['Best Man'],
    notes: 'Out of town - sends regrets'
  },
  {
    name: 'Lisa Brown',
    email: 'lisa.brown@email.com',
    phone: '(555) 567-8901',
    rsvpStatus: 'Pending',
    dietaryRestrictions: '',
    group: 'Bride\'s Family',
    tableNumber: null,
    isVip: false,
    assignedRoles: ['Sibling'],
    notes: 'Cousin - needs to check work schedule'
  },
  {
    name: 'James Davis',
    email: 'james.davis@email.com',
    phone: '(555) 678-9012',
    rsvpStatus: 'Attending',
    dietaryRestrictions: '',
    group: 'Groom\'s Friends',
    tableNumber: 4,
    isVip: false,
    assignedRoles: ['Best Man'],
    notes: 'Best man'
  },
  {
    name: 'Amanda Miller',
    email: 'amanda.miller@email.com',
    phone: '(555) 789-0123',
    rsvpStatus: 'Attending',
    dietaryRestrictions: 'Vegan',
    group: 'Bride\'s Friends',
    tableNumber: 3,
    isVip: false,
    assignedRoles: ['Maid of Honor'],
    notes: 'Maid of honor'
  },
  {
    name: 'Christopher Taylor',
    email: 'christopher.taylor@email.com',
    phone: '(555) 890-1234',
    rsvpStatus: 'Maybe',
    dietaryRestrictions: '',
    group: 'Groom\'s Family',
    tableNumber: null,
    isVip: false,
    assignedRoles: ['Parent'],
    notes: 'Uncle - checking with wife'
  },
  {
    name: 'Jessica Anderson',
    email: 'jessica.anderson@email.com',
    phone: '(555) 901-2345',
    rsvpStatus: 'Attending',
    dietaryRestrictions: '',
    group: 'Bride\'s Family',
    tableNumber: 1,
    isVip: false,
    assignedRoles: ['Sibling'],
    notes: 'Sister of the bride'
  },
  {
    name: 'Michael Thomas',
    email: 'michael.thomas@email.com',
    phone: '(555) 012-3456',
    rsvpStatus: 'Attending',
    dietaryRestrictions: 'Nut allergy',
    group: 'Groom\'s Friends',
    tableNumber: 4,
    isVip: false,
    assignedRoles: ['Friend'],
    notes: 'College friend'
  }
];

// Sample products data
const sampleProducts = [
  {
    name: 'Elegant Wedding Invitations',
    description: 'Beautiful floral design wedding invitations with matching RSVP cards',
    category: 'Invitations',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 50,
    tags: ['invitations', 'floral', 'elegant', 'wedding'],
    vendor: 'Paper Dreams',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 127
  },
  {
    name: 'Rose Gold Table Numbers',
    description: 'Elegant rose gold table numbers for wedding reception',
    category: 'Signage',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop',
    stockQuantity: 25,
    tags: ['table numbers', 'rose gold', 'elegant', 'reception'],
    vendor: 'Wedding Elegance',
    isFeatured: true,
    rating: 4.6,
    reviewCount: 89
  },
  {
    name: 'Crystal Champagne Flutes',
    description: 'Set of 6 crystal champagne flutes for wedding toast',
    category: 'Tableware',
    price: 45.99,
    originalPrice: 65.99,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop',
    stockQuantity: 30,
    tags: ['champagne', 'crystal', 'toast', 'elegant'],
    vendor: 'Crystal Dreams',
    isFeatured: false,
    rating: 4.9,
    reviewCount: 203
  },
  {
    name: 'Floating Candle Centerpieces',
    description: 'Set of 3 floating candle centerpieces with rose petals',
    category: 'Decor',
    price: 32.99,
    originalPrice: 42.99,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop',
    stockQuantity: 40,
    tags: ['centerpieces', 'candles', 'romantic', 'floating'],
    vendor: 'Romantic Decor',
    isFeatured: true,
    rating: 4.7,
    reviewCount: 156
  },
  {
    name: 'Personalized Wedding Favors',
    description: 'Custom monogrammed wedding favors for guests',
    category: 'Party Favors',
    price: 3.99,
    originalPrice: 5.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 200,
    tags: ['favors', 'personalized', 'monogram', 'guests'],
    vendor: 'Personal Touch',
    isFeatured: false,
    rating: 4.5,
    reviewCount: 78
  },
  {
    name: 'Wedding Welcome Sign',
    description: 'Beautiful wooden welcome sign for wedding ceremony',
    category: 'Signage',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop',
    stockQuantity: 15,
    tags: ['welcome sign', 'wooden', 'ceremony', 'rustic'],
    vendor: 'Rustic Charm',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 94
  },
  {
    name: 'Lace Table Runners',
    description: 'Elegant lace table runners for reception tables',
    category: 'Decor',
    price: 18.99,
    originalPrice: 28.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 60,
    tags: ['table runners', 'lace', 'elegant', 'reception'],
    vendor: 'Elegant Linens',
    isFeatured: false,
    rating: 4.4,
    reviewCount: 67
  },
  {
    name: 'Wedding Guest Book',
    description: 'Beautiful guest book with pen for wedding memories',
    category: 'Other',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 35,
    tags: ['guest book', 'memories', 'wedding', 'keepsake'],
    vendor: 'Memory Lane',
    isFeatured: false,
    rating: 4.6,
    reviewCount: 112
  },
  {
    name: 'Bridal Robe Set',
    description: 'Silk bridal robe and slippers for getting ready',
    category: 'Attire',
    price: 65.99,
    originalPrice: 85.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 20,
    tags: ['bridal robe', 'silk', 'getting ready', 'bridal party'],
    vendor: 'Bridal Bliss',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 189
  },
  {
    name: 'Wedding Photo Booth Props',
    description: 'Fun photo booth props and backdrop for reception',
    category: 'Party Favors',
    price: 39.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 25,
    tags: ['photo booth', 'props', 'fun', 'entertainment'],
    vendor: 'Party Time',
    isFeatured: false,
    rating: 4.3,
    reviewCount: 45
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
    await Task.deleteMany({});
    await Guest.deleteMany({});
    await Product.deleteMany({});
    await WeddingRole.deleteMany({});
    await Collaborator.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create wedding roles for each user's wedding
    const createdRoles = [];
    for (const user of createdUsers) {
      for (const roleData of sampleWeddingRoles) {
        const role = new WeddingRole({
          ...roleData,
          weddingId: user._id // Each user's wedding gets its own set of roles
        });
        await role.save();
        createdRoles.push(role);
        console.log(`Created wedding role: ${role.name} for ${user.name}`);
      }
    }

    // Create collaborators for each user (they are their own collaborators with Bride role)
    for (const user of createdUsers) {
      const collaborator = new Collaborator({
        userId: user._id,
        weddingId: user._id, // Using user ID as wedding ID for simplicity
        role: 'Bride', // Using string enum value
        name: user.name,
        email: user.email,
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
      await collaborator.save();
      console.log(`Created owner collaborator for ${user.name}`);
    }

    // Create tasks for each user with role assignments
    for (const user of createdUsers) {
      for (let i = 0; i < sampleTasks.length; i++) {
        const taskData = { 
          ...sampleTasks[i], 
          user: user._id,
          createdBy: user._id,
          assignedRoles: sampleTasks[i].assignedRoles // Keep as string array, don't convert to ObjectIds
        };
        const task = new Task(taskData);
        await task.save();
      }
      console.log(`Created ${sampleTasks.length} tasks for ${user.name}`);
    }

    // Create guests for each user with role assignments
    for (const user of createdUsers) {
      for (let i = 0; i < sampleGuests.length; i++) {
        const guestData = { 
          ...sampleGuests[i], 
          user: user._id,
          createdBy: user._id,
          assignedRoles: sampleGuests[i].assignedRoles // Keep as string array, don't convert to ObjectIds
        };
        const guest = new Guest(guestData);
        await guest.save();
      }
      console.log(`Created ${sampleGuests.length} guests for ${user.name}`);
    }

    // Create products - handle potential index issues
    try {
      for (const productData of sampleProducts) {
        const product = new Product(productData);
        await product.save();
      }
      console.log(`Created ${sampleProducts.length} products`);
    } catch (productError) {
      console.log('Note: Some products may not have been created due to database constraints');
      console.log('This is normal if there are existing indexes. Products can be added manually.');
    }

    console.log('Database seeding completed successfully!');
    console.log(`Created ${createdRoles.length} wedding roles`);
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdUsers.length} collaborators`);
    console.log(`Created ${createdUsers.length * sampleTasks.length} tasks`);
    console.log(`Created ${createdUsers.length * sampleGuests.length} guests`);
    console.log(`Attempted to create ${sampleProducts.length} products`);

    console.log('\nTest Accounts:');
    console.log('Sarah: sarah@example.com / password123');
    console.log('Emily: emily@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 