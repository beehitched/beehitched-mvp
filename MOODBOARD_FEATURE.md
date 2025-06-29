# Wedding Moodboard Feature

## Overview
The Wedding Moodboard feature allows users to create and manage visual inspiration boards for their wedding planning. It's like a private Pinterest board integrated directly into the BeeHitched wedding planning app.

## Features

### 🎨 Core Functionalities

1. **Image Upload**
   - Support for JPG, PNG, GIF, and WebP formats
   - File size limit: 5MB per image
   - Multiple file upload (up to 10 images at once)
   - Drag and drop interface (planned for future enhancement)

2. **Moodboard Management**
   - Create multiple moodboards by category
   - Categories: Florals, Tablescape, Venue Inspo, Dress Vibes, Decor, Food, Other
   - Add descriptions and notes to each moodboard
   - Delete moodboards (removes all associated images)

3. **Image Organization**
   - Add notes to individual images
   - Track source URLs (Pinterest, Etsy, etc.)
   - Source name attribution
   - Grid layout with hover effects
   - Image reordering (planned for future enhancement)

4. **Collaboration**
   - All wedding collaborators can view moodboards
   - Real-time updates across all users
   - Private to the wedding party

## Technical Implementation

### Backend (Node.js/Express)

#### Models
- **Moodboard**: Main moodboard entity
  - `weddingId`: Links to wedding
  - `name`, `description`, `category`
  - `images`: Array of moodboard images
  - `createdBy`: User who created the moodboard
  - `isPublic`: Future feature for public sharing

- **MoodboardImage**: Embedded schema for images
  - `filename`, `originalName`, `url`
  - `notes`, `sourceUrl`, `sourceName`
  - `position`: For future drag-and-drop positioning
  - `order`: For image ordering

#### API Endpoints
```
GET    /api/moodboards                    - Get all moodboards for wedding
GET    /api/moodboards/category/:category - Get moodboards by category
GET    /api/moodboards/:id                - Get single moodboard
POST   /api/moodboards                    - Create new moodboard
PUT    /api/moodboards/:id                - Update moodboard
DELETE /api/moodboards/:id                - Delete moodboard

POST   /api/moodboards/:id/images         - Upload images to moodboard
PUT    /api/moodboards/:id/images/:imgId  - Update image details
DELETE /api/moodboards/:id/images/:imgId  - Delete image
PUT    /api/moodboards/:id/reorder        - Reorder images (future)

GET    /api/uploads/moodboards/:filename  - Serve uploaded images
```

#### File Storage
- Images stored in `server/uploads/moodboards/`
- Unique filenames with timestamps
- Automatic cleanup when moodboards/images are deleted
- Static file serving via Express

### Frontend (Next.js/React)

#### Components
- **MoodboardPage**: Main moodboard interface
- **Navigation**: Added moodboard link
- **Dashboard**: Added moodboard inspiration card

#### Features
- Category filtering
- Modal-based image upload and editing
- Responsive grid layout
- Image preview with hover effects
- Form validation and error handling

#### State Management
- Local state for moodboards, modals, and forms
- Real-time updates via API calls
- Optimistic UI updates

## User Experience

### Creating a Moodboard
1. Navigate to `/moodboard`
2. Click "Create New Moodboard"
3. Fill in name, description, and select category
4. Click "Create"

### Adding Images
1. Click on a moodboard to open it
2. Use the upload form to select images
3. Add optional notes, source URL, and source name
4. Click "Upload Images"

### Managing Images
1. Hover over images to see edit/delete options
2. Click edit to modify notes and source information
3. Click delete to remove images (with confirmation)

### Organization
1. Use category filters to view specific types of inspiration
2. Each moodboard shows image count and preview
3. Grid layout makes it easy to browse collections

## Future Enhancements

### Planned Features
1. **Drag and Drop Reordering**
   - Install `react-beautiful-dnd`
   - Implement drag-and-drop for image reordering
   - Save positions to database

2. **Advanced Layout Options**
   - Masonry layout for varied image sizes
   - Custom grid layouts
   - Pin-style arrangement

3. **Sharing Features**
   - Public moodboard sharing
   - Export moodboards as PDF
   - Share with vendors

4. **Enhanced Image Features**
   - Image cropping and editing
   - Color palette extraction
   - Similar image suggestions

5. **Collaboration Enhancements**
   - Comments on images
   - Approval workflows
   - Activity feed

## Installation & Setup

### Backend Dependencies
```bash
cd server
npm install multer
```

### Frontend Dependencies (for future drag-and-drop)
```bash
cd client
npm install react-beautiful-dnd @types/react-beautiful-dnd
```

### Environment Variables
Ensure these are set in your `.env` files:
```
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
```

## Security Considerations

1. **File Upload Security**
   - File type validation (images only)
   - File size limits
   - Secure filename generation
   - Virus scanning (future enhancement)

2. **Access Control**
   - Users can only access moodboards for their weddings
   - Collaborator-based permissions
   - Authentication required for all endpoints

3. **Data Privacy**
   - Images stored privately
   - No public access without explicit sharing
   - Automatic cleanup of orphaned files

## Performance Optimizations

1. **Image Optimization**
   - Automatic image compression
   - Thumbnail generation
   - Lazy loading for large collections

2. **Database Optimization**
   - Indexed queries for wedding and category
   - Efficient image metadata storage
   - Pagination for large moodboards

3. **Caching**
   - Image caching via CDN (future)
   - API response caching
   - Client-side caching of moodboard data

## Testing

### Manual Testing Checklist
- [ ] Create new moodboard
- [ ] Upload single and multiple images
- [ ] Edit image details
- [ ] Delete images and moodboards
- [ ] Filter by categories
- [ ] Test with different user roles
- [ ] Verify file cleanup on deletion
- [ ] Test error handling

### Automated Testing (Future)
- Unit tests for API endpoints
- Integration tests for file uploads
- E2E tests for user workflows
- Performance testing for large image collections

## Troubleshooting

### Common Issues

1. **Images not uploading**
   - Check file size limits
   - Verify file type is supported
   - Ensure uploads directory exists

2. **Images not displaying**
   - Check static file serving configuration
   - Verify image URLs are correct
   - Check file permissions

3. **Permission errors**
   - Verify user authentication
   - Check collaborator status
   - Ensure wedding association

### Debug Commands
```bash
# Check uploads directory
ls -la server/uploads/moodboards/

# Check server logs
tail -f server/logs/app.log

# Verify database connections
mongo your_database --eval "db.moodboards.find().pretty()"
```

## Contributing

When adding new features to the moodboard:

1. Follow the existing code structure
2. Add proper error handling
3. Update this documentation
4. Test with different user roles
5. Consider performance implications
6. Add appropriate TypeScript types

## Support

For issues or questions about the moodboard feature:
1. Check this documentation
2. Review the troubleshooting section
3. Check GitHub issues
4. Contact the development team 