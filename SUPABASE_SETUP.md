# Supabase Setup for RoboQuest

## 1. Database Setup

### Create the Content Table
Run the SQL script in `supabase-setup.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the script

This will create:
- `content` table with proper structure
- Indexes for performance
- Row Level Security (RLS) policies
- Sample content data

## 2. Real-time Subscriptions

The application now uses Supabase's real-time subscriptions to automatically update content when:
- New tutorials are uploaded
- Existing content is modified
- Content is deleted

### How it works:
- **OurProjects**: Listens for changes to `is_our_content = true`
- **TutorialsLibrary**: Listens for changes to `is_our_content = false`
- **VideoUpload**: Directly inserts into the `content` table

## 3. Admin Authentication

### Admin Access Control:
- Only users with email `rayaanm5409@gmail.com` can upload content
- Admin check is done in the application layer
- RLS policies provide additional database-level security

### Security Features:
- Row Level Security enabled
- Users can only modify their own content
- Public read access for all content
- Authenticated users can insert content

## 4. Content Structure

### Fields:
- `id`: Unique identifier (UUID)
- `title`: Tutorial title
- `description`: Tutorial description
- `type`: Content type (video, interactive, document)
- `category`: Content category (scratch, python, robotics, etc.)
- `difficulty`: Difficulty level (beginner, intermediate, advanced)
- `duration`: Estimated duration
- `youtube_id`: YouTube video ID
- `xp_reward`: Experience points reward
- `views`: View count
- `likes`: Like count
- `is_our_content`: Boolean flag for Our Projects vs Tutorials
- `uploaded_by`: User email who uploaded
- `uploaded_at`: Upload timestamp
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## 5. Testing the Setup

### Upload a Tutorial:
1. Navigate to VideoUpload component
2. Fill out the form
3. Choose destination (Tutorials or Our Projects)
4. Submit
5. Content should appear immediately in the appropriate section

### Real-time Updates:
- Open multiple browser tabs
- Upload content in one tab
- Watch it appear automatically in other tabs
- No manual refresh needed

## 6. Troubleshooting

### Common Issues:

**Content not appearing:**
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies
- Ensure real-time subscriptions are working

**Upload fails:**
- Verify admin email matches exactly
- Check Supabase authentication
- Review RLS policies
- Check table structure

**Real-time not working:**
- Verify Supabase project settings
- Check real-time configuration
- Ensure proper channel subscription
- Review network connectivity

## 7. Performance Optimization

### Indexes Created:
- `idx_content_is_our_content`: For filtering Our Projects vs Tutorials
- `idx_content_category`: For category filtering
- `idx_content_difficulty`: For difficulty filtering
- `idx_content_uploaded_at`: For sorting by upload date

### Real-time Configuration:
- Events per second: 10 (configurable in client.ts)
- Channel-based subscriptions for efficient updates
- Automatic cleanup of subscriptions

## 8. Next Steps

### Potential Enhancements:
- Add content approval workflow
- Implement content versioning
- Add analytics tracking
- Create content moderation tools
- Add bulk upload functionality

### Monitoring:
- Set up Supabase logging
- Monitor real-time subscription performance
- Track database query performance
- Set up alerts for errors

