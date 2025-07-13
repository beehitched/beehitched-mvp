'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Heart, 
  Eye,
  Share2,
  Bookmark,
  Tag,
  CheckCircle,
  AlertCircle,
  Star,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import Navigation from '@/components/Navigation'

// Article data for ID 1
const articleData = {
  id: 1,
  title: 'The Ultimate Wedding Planning Timeline: 12 Months to Your Big Day',
  excerpt: 'Planning a wedding can feel overwhelming, but with our comprehensive 12-month timeline, you\'ll have everything organized and stress-free. From booking vendors to final details, we\'ve got you covered.',
  author: 'Alexandra Thompson',
  authorImage: '/api/placeholder/40/40',
  publishDate: '2024-01-15',
  readTime: '8 min read',
  category: 'Wedding Planning',
  image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=400&fit=crop&crop=center',
  featured: true,
  views: 2847,
  likes: 156,
  content: `
    <p class="lead">Planning your wedding is one of the most exciting journeys you'll ever embark on, but it can also be one of the most overwhelming. With so many details to coordinate and decisions to make, having a structured timeline is essential for keeping your sanity and ensuring nothing falls through the cracks.</p>

    <p>This comprehensive 12-month wedding planning timeline will guide you through every step of the process, from the moment you say "yes" to the final moments before you walk down the aisle. Whether you're planning a grand celebration or an intimate gathering, this timeline will help you stay organized and stress-free.</p>

    <h2>12 Months Before: Foundation & Vision</h2>
    
    <h3>Week 1-2: Celebrate and Set the Foundation</h3>
    <ul>
      <li><strong>Celebrate your engagement!</strong> Take time to enjoy this special moment with family and friends</li>
      <li>Discuss your wedding vision with your partner - style, size, and overall feel</li>
      <li>Set a preliminary budget and determine who's contributing financially</li>
      <li>Create a wedding email address for all vendor communications</li>
      <li>Start a wedding planning notebook or digital folder</li>
    </ul>

    <h3>Week 3-4: Research and Inspiration</h3>
    <ul>
      <li>Create Pinterest boards or save inspiration images</li>
      <li>Research wedding venues in your desired location</li>
      <li>Start looking at wedding photographers and videographers</li>
      <li>Consider hiring a wedding planner if it fits your budget</li>
      <li>Begin compiling your guest list (rough estimate)</li>
    </ul>

    <h2>11 Months Before: Venue & Key Vendors</h2>
    
    <h3>Month 11: Secure Your Venue</h3>
    <ul>
      <li><strong>Book your ceremony and reception venues</strong> - this is your top priority</li>
      <li>Schedule venue tours and ask about availability for your preferred dates</li>
      <li>Review contracts carefully and understand cancellation policies</li>
      <li>Confirm what's included (tables, chairs, linens, etc.)</li>
      <li>Book your officiant or religious leader</li>
    </ul>

    <h3>Month 10: Photography & Catering</h3>
    <ul>
      <li>Book your wedding photographer and videographer</li>
      <li>Schedule engagement photo sessions</li>
      <li>Research and book your caterer</li>
      <li>Start looking at wedding dress options</li>
      <li>Begin researching DJs or bands</li>
    </ul>

    <h2>9-8 Months Before: Attire & Beauty</h2>
    
    <h3>Month 9: Wedding Attire</h3>
    <ul>
      <li><strong>Order your wedding dress</strong> - most dresses take 6-8 months to arrive</li>
      <li>Shop for bridesmaid dresses</li>
      <li>Help your partner choose their wedding day outfit</li>
      <li>Book hair and makeup artists</li>
      <li>Schedule dress fittings</li>
    </ul>

    <h3>Month 8: Beauty & Accessories</h3>
    <ul>
      <li>Purchase wedding rings</li>
      <li>Shop for wedding accessories (veil, jewelry, shoes)</li>
      <li>Book hair and makeup trials</li>
      <li>Start skincare routines if needed</li>
      <li>Research honeymoon destinations</li>
    </ul>

    <h2>7-6 Months Before: Details & Decor</h2>
    
    <h3>Month 7: Flowers & Decor</h3>
    <ul>
      <li>Book your florist</li>
      <li>Choose your wedding colors and theme</li>
      <li>Start planning your ceremony and reception decor</li>
      <li>Book your wedding cake baker</li>
      <li>Research transportation options</li>
    </ul>

    <h3>Month 6: Invitations & Paper Goods</h3>
    <ul>
      <li>Design and order your wedding invitations</li>
      <li>Create your wedding website</li>
      <li>Order save-the-dates if you haven't already</li>
      <li>Plan your ceremony details</li>
      <li>Book your honeymoon</li>
    </ul>

    <h2>5-4 Months Before: Guest Management</h2>
    
    <h3>Month 5: Guest List & Accommodations</h3>
    <ul>
      <li>Finalize your guest list</li>
      <li>Book hotel room blocks for out-of-town guests</li>
      <li>Send save-the-dates</li>
      <li>Plan rehearsal dinner details</li>
      <li>Book transportation for wedding day</li>
    </ul>

    <h3>Month 4: Ceremony & Reception Details</h3>
    <ul>
      <li>Plan your ceremony timeline</li>
      <li>Choose your wedding music</li>
      <li>Plan your reception timeline</li>
      <li>Book any additional vendors (photo booth, etc.)</li>
      <li>Start planning your honeymoon itinerary</li>
    </ul>

    <h2>3-2 Months Before: Final Details</h2>
    
    <h3>Month 3: Legal & Administrative</h3>
    <ul>
      <li>Obtain your marriage license</li>
      <li>Send out wedding invitations</li>
      <li>Plan your wedding day timeline</li>
      <li>Book your rehearsal dinner venue</li>
      <li>Start tracking RSVPs</li>
    </ul>

    <h3>Month 2: Final Preparations</h3>
    <ul>
      <li>Schedule final dress fittings</li>
      <li>Book your honeymoon flights</li>
      <li>Plan your wedding day timeline</li>
      <li>Purchase wedding day accessories</li>
      <li>Start writing your vows</li>
    </ul>

    <h2>1 Month Before: The Home Stretch</h2>
    
    <h3>Week 4: Final Vendor Meetings</h3>
    <ul>
      <li>Meet with all vendors to confirm details</li>
      <li>Finalize your wedding day timeline</li>
      <li>Plan your ceremony rehearsal</li>
      <li>Purchase wedding day emergency kit</li>
      <li>Confirm all vendor payments</li>
    </ul>

    <h3>Week 3: Beauty & Wellness</h3>
    <ul>
      <li>Schedule final hair and makeup trials</li>
      <li>Start getting adequate sleep</li>
      <li>Practice your wedding day routine</li>
      <li>Pack for your honeymoon</li>
      <li>Plan your wedding day breakfast</li>
    </ul>

    <h3>Week 2: Final Details</h3>
    <ul>
      <li>Have your ceremony rehearsal</li>
      <li>Finalize your wedding day timeline</li>
      <li>Pack your wedding day emergency kit</li>
      <li>Confirm all vendor arrival times</li>
      <li>Plan your wedding day breakfast</li>
    </ul>

    <h3>Week 1: Wedding Week</h3>
    <ul>
      <li>Get plenty of rest</li>
      <li>Attend your rehearsal dinner</li>
      <li>Delegate last-minute tasks</li>
      <li>Pack your wedding day bag</li>
      <li>Take time to relax and enjoy the moment</li>
    </ul>

    <h2>Wedding Day: Your Special Day</h2>
    
    <p>On your wedding day, remember to:</p>
    <ul>
      <li>Eat a good breakfast</li>
      <li>Stay hydrated throughout the day</li>
      <li>Take moments to breathe and enjoy</li>
      <li>Delegate any issues to your wedding planner or trusted friend</li>
      <li>Remember why you're getting married - focus on your love story</li>
    </ul>

    <h2>Pro Tips for Success</h2>
    
    <h3>Budget Management</h3>
    <p>Create a detailed budget spreadsheet and track all expenses. Consider using wedding planning apps like BeeHitched to keep everything organized in one place.</p>

    <h3>Vendor Communication</h3>
    <p>Keep all vendor contracts and communications in one place. Create a shared folder with your partner for easy access.</p>

    <h3>Guest Management</h3>
    <p>Use digital tools to track RSVPs and guest information. Consider creating a wedding website to share important information with guests.</p>

    <h3>Self-Care</h3>
    <p>Don't forget to take care of yourself during the planning process. Schedule regular date nights with your partner that don't involve wedding talk.</p>

    <h2>Common Mistakes to Avoid</h2>
    
    <ul>
      <li><strong>Booking vendors without reading contracts thoroughly</strong></li>
      <li><strong>Not setting a realistic budget from the start</strong></li>
      <li><strong>Waiting too long to book popular vendors</strong></li>
      <li><strong>Not having a backup plan for outdoor ceremonies</strong></li>
      <li><strong>Forgetting to plan for vendor meals on wedding day</strong></li>
      <li><strong>Not delegating tasks to trusted friends and family</strong></li>
    </ul>

    <h2>Using BeeHitched for Your Timeline</h2>
    
    <p>BeeHitched's wedding planning platform makes it easy to stay organized throughout your planning journey. Our timeline feature helps you:</p>
    
    <ul>
      <li>Set deadlines for each task</li>
      <li>Track progress on your planning checklist</li>
      <li>Collaborate with your partner and wedding party</li>
      <li>Store vendor contact information and contracts</li>
      <li>Manage your guest list and RSVPs</li>
      <li>Create and share your wedding day timeline</li>
    </ul>

    <p>Start your wedding planning journey with confidence using our comprehensive timeline and powerful planning tools. Remember, the key to a stress-free wedding is staying organized and giving yourself plenty of time for each task.</p>

    <p>Happy planning!</p>
  `
}

const relatedArticles = [
  {
    id: 2,
    title: '10 Creative Ways to Use QR Codes for Your Wedding RSVPs',
    excerpt: 'Discover innovative ways to incorporate QR codes into your wedding invitations and make RSVP collection effortless.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=200&fit=crop&crop=center',
    category: 'Guest Management',
    readTime: '6 min read'
  },
  {
    id: 7,
    title: 'Creating the Perfect Wedding Timeline with BeeHitched',
    excerpt: 'Master the art of timeline creation using BeeHitched\'s intuitive tools.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop&crop=center',
    category: 'Timeline Tips',
    readTime: '6 min read'
  },
  {
    id: 8,
    title: 'Guest List Management: The Do\'s and Don\'ts',
    excerpt: 'Managing your guest list can be one of the most challenging aspects of wedding planning.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=200&fit=crop&crop=center',
    category: 'Guest Management',
    readTime: '7 min read'
  }
]

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // For now, we'll only handle article ID 1
  if (params.id !== '1') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The article you're looking for doesn't exist.
          </p>
          <Link href="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Article Header */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </nav>

            {/* Article Meta */}
            <div className="mb-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  {articleData.category}
                </span>
                <span className="mx-3">•</span>
                <span>{formatDate(articleData.publishDate)}</span>
                <span className="mx-3">•</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {articleData.readTime}
                </span>
                <span className="mx-3">•</span>
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {articleData.views} views
                </span>
              </div>
            </div>

            {/* Article Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight"
            >
              {articleData.title}
            </motion.h1>

            {/* Article Excerpt */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              {articleData.excerpt}
            </motion.p>

            {/* Author Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{articleData.author}</p>
                  <p className="text-sm text-gray-500">Wedding Planning Expert</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Bookmark className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              src={articleData.image} 
              alt={articleData.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="article-content"
              dangerouslySetInnerHTML={{ __html: articleData.content }}
            />
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Related Articles
              </h2>
              <p className="text-lg text-gray-600">
                Continue your wedding planning journey with these helpful guides.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                        {article.category}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {article.excerpt}
                    </p>
                    
                    <Link 
                      href={`/blog/${article.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group"
                    >
                      Read More
                      <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              Ready to Start Planning?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Put this timeline into action with BeeHitched's powerful wedding planning tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                Start Planning Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 