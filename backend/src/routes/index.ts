import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { upload } from '../middleware/upload';

// Import controllers
import * as authCtrl from '../controllers/authController';
import * as pkgCtrl from '../controllers/packageController';
import * as bookCtrl from '../controllers/bookingController';
import * as blogCtrl from '../controllers/blogController';
import * as msgCtrl from '../controllers/messageController';
import * as galCtrl from '../controllers/galleryController';
import * as testCtrl from '../controllers/testimonialController';
import * as faqCtrl from '../controllers/faqController';
import * as teamCtrl from '../controllers/teamController';
import * as setCtrl from '../controllers/settingsController';
import * as dashCtrl from '../controllers/dashboardController';

const router = Router();

// --- Auth Routes ---
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', authenticateJWT, authCtrl.getMe);
router.get('/auth/staff', authenticateJWT, authCtrl.getStaffMembers);

// --- Package Routes ---
router.get('/packages', pkgCtrl.getPackages);
router.get('/packages/:id', pkgCtrl.getPackageById);
router.get('/packages/slug/:slug', pkgCtrl.getPackageBySlug);
router.post('/packages', authenticateJWT, pkgCtrl.createPackage);
router.put('/packages/:id', authenticateJWT, pkgCtrl.updatePackage);
router.delete('/packages/:id', authenticateJWT, pkgCtrl.deletePackage);

// --- Booking Routes ---
router.get('/bookings', authenticateJWT, bookCtrl.getBookings);
router.post('/bookings', bookCtrl.createBooking);
router.patch('/bookings/:id/status', authenticateJWT, bookCtrl.updateBookingStatus);
router.patch('/bookings/:id/assign', authenticateJWT, bookCtrl.assignStaff);
router.delete('/bookings/:id', authenticateJWT, bookCtrl.deleteBooking);

// --- Blog Routes ---
router.get('/blogs', blogCtrl.getBlogs);
router.get('/blogs/:id', blogCtrl.getBlogById);
router.get('/blogs/slug/:slug', blogCtrl.getBlogBySlug);
router.post('/blogs', authenticateJWT, blogCtrl.createBlog);
router.put('/blogs/:id', authenticateJWT, blogCtrl.updateBlog);
router.delete('/blogs/:id', authenticateJWT, blogCtrl.deleteBlog);

// --- Message (Contact) Routes ---
router.get('/messages', authenticateJWT, msgCtrl.getMessages);
router.post('/messages', msgCtrl.createMessage);
router.patch('/messages/:id/status', authenticateJWT, msgCtrl.updateMessageStatus);
router.delete('/messages/:id', authenticateJWT, msgCtrl.deleteMessage);

// --- Gallery Routes ---
router.get('/gallery', galCtrl.getGalleryItems);
router.post('/gallery', authenticateJWT, galCtrl.createGalleryItem);
router.delete('/gallery/:id', authenticateJWT, galCtrl.deleteGalleryItem);

// --- Testimonial Routes ---
router.get('/testimonials', testCtrl.getTestimonials);
router.post('/testimonials', authenticateJWT, testCtrl.createTestimonial);
router.delete('/testimonials/:id', authenticateJWT, testCtrl.deleteTestimonial);

// --- FAQ Routes ---
router.get('/faqs', faqCtrl.getFAQs);
router.post('/faqs', authenticateJWT, faqCtrl.createFAQ);
router.put('/faqs/:id', authenticateJWT, faqCtrl.updateFAQ);
router.delete('/faqs/:id', authenticateJWT, faqCtrl.deleteFAQ);

// --- Team Routes ---
router.get('/team', teamCtrl.getTeamMembers);
router.post('/team', authenticateJWT, teamCtrl.createTeamMember);
router.put('/team/:id', authenticateJWT, teamCtrl.updateTeamMember);
router.delete('/team/:id', authenticateJWT, teamCtrl.deleteTeamMember);

// --- Settings & Homepage Routes ---
router.get('/settings', setCtrl.getSettings);
router.put('/settings', authenticateJWT, setCtrl.updateSettings);
router.get('/settings/homepage', setCtrl.getHomepageContent);
router.put('/settings/homepage', authenticateJWT, setCtrl.updateHomepageContent);

// --- Dashboard Routes ---
router.get('/dashboard/stats', authenticateJWT, dashCtrl.getDashboardStats);

// --- File Upload Route ---
router.post('/upload', authenticateJWT, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Return the web-accessible path
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ imageUrl: filePath });
});

export default router;
