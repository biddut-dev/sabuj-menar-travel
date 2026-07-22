"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  ClipboardList, 
  PackageOpen, 
  BookOpen, 
  FileText, 
  HelpCircle,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Briefcase,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, token } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Stats Data
  const [stats, setStats] = useState<any>({
    counters: {},
    distributions: { status: [], category: [] },
    recentBookings: [],
    recentMessages: []
  });

  // State Lists for tables
  const [bookings, setBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  // Settings & Homepage configs
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [homepageContent, setHomepageContent] = useState<any>({});

  // Loading indicator
  const [loading, setLoading] = useState(true);

  // Forms modals & current edit items
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any>(null);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  // Simple Add Modals
  const [faqForm, setFaqForm] = useState({ question: '', questionEn: '', answer: '', answerEn: '', category: 'General', order: 0 });
  const [testForm, setTestForm] = useState({ name: '', nameEn: '', city: '', cityEn: '', rating: 5, review: '', reviewEn: '', imageUrl: '' });
  const [teamForm, setTeamForm] = useState({ name: '', nameEn: '', role: '', roleEn: '', phone: '', email: '', bio: '', bioEn: '', imageUrl: '' });
  const [galForm, setGalForm] = useState({ imageUrl: '', caption: '', captionEn: '', category: 'KAABA' });

  // Security gate redirection
  useEffect(() => {
    const checkUserSession = () => {
      const storedToken = localStorage.getItem('sabuj_menar_token');
      if (!storedToken) {
        router.push('/admin/login');
      }
    };
    checkUserSession();
  }, [token]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [
        statsRes, pkgsRes, booksRes, blogsRes, 
        faqsRes, testRes, msgRes, galRes, teamRes, 
        staffRes, settingsRes, homeRes
      ] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/packages'),
        api.get('/bookings'),
        api.get('/blogs'),
        api.get('/faqs'),
        api.get('/testimonials'),
        api.get('/messages'),
        api.get('/gallery'),
        api.get('/team'),
        api.get('/auth/staff'),
        api.get('/settings'),
        api.get('/settings/homepage')
      ]);

      setStats(statsRes.data);
      setPackages(pkgsRes.data);
      setBookings(booksRes.data);
      setBlogs(blogsRes.data);
      setFaqs(faqsRes.data);
      setTestimonials(testRes.data);
      setMessages(msgRes.data);
      setGallery(galRes.data);
      setTeam(teamRes.data);
      setStaff(staffRes.data);
      setSiteSettings(settingsRes.data);
      setHomepageContent(homeRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [token, activeTab]);

  // 1. Image upload handling
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      callback(res.data.imageUrl);
      alert('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    }
  };

  // 2. Booking controls
  const handleBookingStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus });
      alert('Booking status updated!');
      loadDashboardData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleBookingAssigneeChange = async (id: string, newStaffId: string) => {
    try {
      await api.patch(`/bookings/${id}/assign`, { assignedStaffId: newStaffId });
      alert('Staff assigned successfully!');
      loadDashboardData();
    } catch (err) {
      alert('Failed to assign staff.');
    }
  };

  const handleBookingDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking request?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete booking.');
    }
  };

  const exportBookingsToCSV = () => {
    if (bookings.length === 0) return;
    
    const headers = ['Date', 'Name', 'Phone', 'Email', 'Passport', 'Travelers', 'Type', 'Month', 'Status', 'Notes'];
    const rows = bookings.map(b => [
      new Date(b.createdAt).toLocaleDateString(),
      b.fullName,
      b.phone,
      b.email,
      b.passportNumber || 'N/A',
      b.numTravelers,
      b.packageType,
      b.preferredMonth,
      b.status,
      (b.notes || '').replace(/"/g, '""')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sabuj_Menar_Bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Package submit
  const handlePackageSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...editingPkg };
    
    // Parse highlights array
    if (typeof data.highlights === 'string') {
      data.highlights = data.highlights.split(',').map((h: string) => h.trim()).filter((h: string) => h.length > 0);
    }
    if (typeof data.highlightsEn === 'string') {
      data.highlightsEn = data.highlightsEn.split(',').map((h: string) => h.trim()).filter((h: string) => h.length > 0);
    }

    try {
      if (data.id) {
        await api.put(`/packages/${data.id}`, data);
      } else {
        await api.post('/packages', data);
      }
      setPkgModalOpen(false);
      setEditingPkg(null);
      loadDashboardData();
      alert('Package saved successfully!');
    } catch (err) {
      alert('Failed to save package.');
    }
  };

  const handlePackageDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete package.');
    }
  };

  // 4. Blog submit
  const handleBlogSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...editingBlog };
    try {
      if (data.id) {
        await api.put(`/blogs/${data.id}`, data);
      } else {
        data.author = user?.name || 'Admin';
        await api.post('/blogs', data);
      }
      setBlogModalOpen(false);
      setEditingBlog(null);
      loadDashboardData();
      alert('Blog post saved!');
    } catch (err) {
      alert('Failed to save blog post.');
    }
  };

  const handleBlogDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete blog.');
    }
  };

  // 5. Messages controls
  const handleMessageStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/messages/${id}/status`, { status });
      loadDashboardData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleMessageDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete message.');
    }
  };

  // 6. Settings updates
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/settings', siteSettings);
      alert('Settings updated successfully!');
    } catch (err) {
      alert('Failed to update settings.');
    }
  };

  const handleHomepageSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/settings/homepage', homepageContent);
      alert('Homepage copy updated!');
    } catch (err) {
      alert('Failed to update homepage.');
    }
  };

  // 7. Add simple models
  const addFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/faqs', faqForm);
      setFaqForm({ question: '', questionEn: '', answer: '', answerEn: '', category: 'General', order: 0 });
      loadDashboardData();
      alert('FAQ added successfully!');
    } catch (err) {
      alert('Failed to add FAQ.');
    }
  };

  const addTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/testimonials', testForm);
      setTestForm({ name: '', nameEn: '', city: '', cityEn: '', rating: 5, review: '', reviewEn: '', imageUrl: '' });
      loadDashboardData();
      alert('Testimonial added successfully!');
    } catch (err) {
      alert('Failed to add review.');
    }
  };

  const addTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/team', teamForm);
      setTeamForm({ name: '', nameEn: '', role: '', roleEn: '', phone: '', email: '', bio: '', bioEn: '', imageUrl: '' });
      loadDashboardData();
      alert('Team member added successfully!');
    } catch (err) {
      alert('Failed to add member.');
    }
  };

  const addGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/gallery', galForm);
      setGalForm({ imageUrl: '', caption: '', captionEn: '', category: 'KAABA' });
      loadDashboardData();
      alert('Gallery item added!');
    } catch (err) {
      alert('Failed to add photo.');
    }
  };

  // Standard CRUD deletion helpers
  const deleteFAQ = async (id: string) => {
    try {
      await api.delete(`/faqs/${id}`);
      loadDashboardData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await api.delete(`/testimonials/${id}`);
      loadDashboardData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      await api.delete(`/team/${id}`);
      loadDashboardData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      await api.delete(`/gallery/${id}`);
      loadDashboardData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  if (loading && stats.counters?.totalBookings === undefined) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      
      {/* Sidebar Controls */}
      <aside className="w-full md:w-64 bg-brand-dark text-white flex-shrink-0 flex flex-col justify-between border-r border-brand-gold/20">
        <div className="p-6">
          <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-gold bg-white">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-serif-title font-bold text-sm tracking-wide text-brand-gold">Sabuj Menar</h2>
              <p className="text-[10px] uppercase font-bold text-gray-400">Control Panel</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {[
              { id: 'overview', name: 'Overview', icon: LayoutDashboard },
              { id: 'bookings', name: 'Bookings', icon: ClipboardList, badge: stats.counters?.pendingBookings },
              { id: 'packages', name: 'Packages', icon: PackageOpen },
              { id: 'blogs', name: 'Blog Posts', icon: BookOpen },
              { id: 'messages', name: 'Inbox Messages', icon: MessageSquare, badge: stats.counters?.unreadMessages },
              { id: 'faq-testimonial', name: 'FAQs & Testimonials', icon: HelpCircle },
              { id: 'team-gallery', name: 'Team & Gallery', icon: Users },
              { id: 'settings', name: 'Site Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-brand-emerald text-white border-l-4 border-brand-gold shadow'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-brand-gold" />
                    {tab.name}
                  </span>
                  {tab.badge > 0 && (
                    <span className="bg-brand-gold text-brand-dark font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-6 border-t border-white/10 text-center">
          <div className="text-left text-xs mb-3 text-gray-400">
            <p className="font-bold text-brand-gold">Logged in as:</p>
            <p className="truncate font-semibold text-white mt-0.5">{user?.name || 'Administrator'}</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="w-full flex items-center justify-center gap-2 border border-red-500/30 hover:bg-red-500/10 text-red-400 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen">

        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <h3 className="font-serif-title font-bold text-2xl text-brand-emerald">Dashboard Statistics</h3>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Bookings</p>
                  <p className="font-serif-title font-bold text-2xl text-brand-emerald">{stats.counters?.totalBookings}</p>
                  <p className="text-[10px] text-brand-gold font-semibold">{stats.counters?.pendingBookings} Pending Actions</p>
                </div>
                <ClipboardList className="w-8 h-8 text-brand-gold" />
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Est. Revenue</p>
                  <p className="font-serif-title font-bold text-2xl text-brand-emerald">৳ {stats.counters?.estimatedRevenue?.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">From Confirmed Sales</p>
                </div>
                <UserCheck className="w-8 h-8 text-brand-gold" />
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Active Packages</p>
                  <p className="font-serif-title font-bold text-2xl text-brand-emerald">{stats.counters?.totalPackages}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{stats.counters?.hajjPackages} Hajj / {stats.counters?.umrahPackages} Umrah</p>
                </div>
                <PackageOpen className="w-8 h-8 text-brand-gold" />
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Inbox Enquiries</p>
                  <p className="font-serif-title font-bold text-2xl text-brand-emerald">{stats.counters?.totalMessages}</p>
                  <p className="text-[10px] text-red-500 font-semibold">{stats.counters?.unreadMessages} Unread Messages</p>
                </div>
                <MessageSquare className="w-8 h-8 text-brand-gold" />
              </div>
            </div>

            {/* Simple distribution charts using flexbars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
                <h4 className="font-serif-title font-bold text-sm text-brand-emerald uppercase tracking-wider border-b border-gray-50 pb-3">
                  Booking Request Pipeline
                </h4>
                <div className="space-y-4">
                  {stats.distributions?.status?.map((st: any) => {
                    const pct = stats.counters?.totalBookings > 0 
                      ? Math.round((st.value / stats.counters.totalBookings) * 100) 
                      : 0;
                    return (
                      <div key={st.name} className="space-y-1 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span>{st.name} Requests</span>
                          <span>{st.value} ({pct}%)</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-emerald" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
                <h4 className="font-serif-title font-bold text-sm text-brand-emerald uppercase tracking-wider border-b border-gray-50 pb-3">
                  Recent Booking Requests
                </h4>
                <div className="space-y-3">
                  {stats.recentBookings?.map((b: any) => (
                    <div key={b.id} className="flex justify-between items-center text-xs p-3.5 bg-brand-bg rounded-lg">
                      <div>
                        <p className="font-bold text-brand-emerald">{b.fullName}</p>
                        <p className="text-gray-400 mt-0.5">{b.package?.title || `${b.packageType} Request`}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                  {stats.recentBookings?.length === 0 && (
                    <p className="text-center py-6 text-xs text-gray-400">No booking requests available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS PANEL */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="font-serif-title font-bold text-2xl text-brand-emerald">Booking Inquiries</h3>
              <button 
                onClick={exportBookingsToCSV}
                className="bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Download className="w-4 h-4 text-brand-gold" />
                Export CSV Data
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-dark text-white border-b border-gray-100">
                    <th className="p-4 uppercase tracking-wider font-extrabold">Pilgrim Info</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Package Info</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Travel Month</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Status</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Assigned Staff</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-brand-bg/50">
                      <td className="p-4 space-y-1">
                        <p className="font-bold text-brand-emerald">{b.fullName} ({b.nationality})</p>
                        <p className="text-gray-500 font-semibold">{b.phone} | {b.email}</p>
                        {b.passportNumber && <p className="text-[10px] text-brand-gold font-bold">Passport: {b.passportNumber}</p>}
                      </td>
                      <td className="p-4 space-y-1">
                        <p className="font-bold">{b.package?.title || `${b.packageType} Consultation`}</p>
                        <p className="text-gray-400 font-semibold">{b.numTravelers} Travelers</p>
                      </td>
                      <td className="p-4 font-semibold">{b.preferredMonth}</td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleBookingStatusChange(b.id, e.target.value)}
                          className="border border-gray-300 rounded px-2.5 py-1 focus:outline-none focus:border-brand-emerald bg-white font-bold"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <select
                          value={b.assignedStaffId || ''}
                          onChange={(e) => handleBookingAssigneeChange(b.id, e.target.value)}
                          className="border border-gray-300 rounded px-2.5 py-1 focus:outline-none focus:border-brand-emerald bg-white font-semibold"
                        >
                          <option value="">Unassigned</option>
                          {staff.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleBookingDelete(b.id)}
                          className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400">No booking requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PACKAGES PANEL */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif-title font-bold text-2xl text-brand-emerald">Hajj & Umrah Packages</h3>
              <button
                onClick={() => {
                  setEditingPkg({
                    title: '', titleEn: '', slug: '', description: '', descriptionEn: '', type: 'UMRAH', category: 'STANDARD',
                    durationDays: 14, price: 150000, hotelDetailsMakkah: '', hotelDetailsMakkahEn: '', hotelDetailsMadinah: '', hotelDetailsMadinahEn: '',
                    departureDate: new Date().toISOString().split('T')[0], mealsIncluded: true,
                    visaIncluded: true, flightIncluded: true, guideIncluded: true, ziyaratIncluded: true,
                    highlights: '', highlightsEn: '', isPublished: true
                  });
                  setPkgModalOpen(true);
                }}
                className="bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Package
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-dark text-white border-b border-gray-100">
                    <th className="p-4 uppercase tracking-wider font-extrabold">Title</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Type / Category</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Duration / Price</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Departure</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Status</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packages.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-brand-bg/50">
                      <td className="p-4 font-bold text-brand-emerald">{pkg.title}</td>
                      <td className="p-4 space-y-0.5">
                        <span className="font-extrabold uppercase bg-brand-bg text-brand-emerald px-2 py-0.5 rounded border border-brand-emerald/20 text-[9px] mr-2">
                          {pkg.type}
                        </span>
                        <span className="font-bold text-brand-gold">{pkg.category}</span>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="font-semibold">{pkg.durationDays} Days</p>
                        <p className="font-bold text-brand-gold">৳ {pkg.price.toLocaleString()}</p>
                      </td>
                      <td className="p-4 font-semibold">{new Date(pkg.departureDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          pkg.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pkg.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 flex gap-1">
                        <button
                          onClick={() => {
                            setEditingPkg({
                              ...pkg,
                              departureDate: new Date(pkg.departureDate).toISOString().split('T')[0],
                              highlights: pkg.highlights.join(', '),
                              highlightsEn: (pkg.highlightsEn || []).join(', ')
                            });
                            setPkgModalOpen(true);
                          }}
                          className="text-brand-emerald hover:text-brand-emerald-dark p-2 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePackageDelete(pkg.id)}
                          className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400">No packages created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BLOGS PANEL */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif-title font-bold text-2xl text-brand-emerald">Dynamic Articles & Checklists</h3>
              <button
                onClick={() => {
                  setEditingBlog({
                    title: '', titleEn: '', slug: '', summary: '', summaryEn: '', content: '', contentEn: '', imageUrl: '',
                    category: 'Hajj Guide', isPublished: true
                  });
                  setBlogModalOpen(true);
                }}
                className="bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Article
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-dark text-white border-b border-gray-100">
                    <th className="p-4 uppercase tracking-wider font-extrabold">Title</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Category</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Author</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Status</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blogs.map(blog => (
                    <tr key={blog.id} className="hover:bg-brand-bg/50">
                      <td className="p-4 font-bold text-brand-emerald">{blog.title}</td>
                      <td className="p-4 font-semibold text-brand-gold">{blog.category}</td>
                      <td className="p-4 font-medium">{blog.author}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          blog.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 flex gap-1">
                        <button
                          onClick={() => {
                            setEditingBlog(blog);
                            setBlogModalOpen(true);
                          }}
                          className="text-brand-emerald hover:text-brand-emerald-dark p-2 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleBlogDelete(blog.id)}
                          className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400">No blog posts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INBOX MESSAGES PANEL */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h3 className="font-serif-title font-bold text-2xl text-brand-emerald">Inbox Inquiries</h3>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-dark text-white border-b border-gray-100">
                    <th className="p-4 uppercase tracking-wider font-extrabold">Sender Info</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Interest / Month</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Message</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Status</th>
                    <th className="p-4 uppercase tracking-wider font-extrabold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {messages.map(msg => (
                    <tr key={msg.id} className="hover:bg-brand-bg/50">
                      <td className="p-4 space-y-1">
                        <p className="font-bold text-brand-emerald">{msg.name}</p>
                        <p className="text-gray-500 font-semibold">{msg.phone} | {msg.email}</p>
                        <p className="text-[9px] text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="font-bold text-brand-gold">{msg.packageInterest}</p>
                        <p className="text-gray-400">Month: {msg.preferredMonth || 'Any'}</p>
                      </td>
                      <td className="p-4 text-gray-600 max-w-xs truncate leading-normal whitespace-pre-wrap">{msg.message}</td>
                      <td className="p-4">
                        <select
                          value={msg.status}
                          onChange={(e) => handleMessageStatusChange(msg.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-brand-emerald bg-white font-semibold"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="READ">READ</option>
                          <option value="REPLIED">REPLIED</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleMessageDelete(msg.id)}
                          className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400">Inbox is empty.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQS & TESTIMONIALS PANEL */}
        {activeTab === 'faq-testimonial' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Manage FAQs */}
            <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-serif-title font-bold text-lg text-brand-emerald border-b border-gray-100 pb-3 uppercase tracking-wider">
                Add FAQ Accordion
              </h3>
              
              <form onSubmit={addFAQ} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Question (Bangla) *</label>
                    <input
                      type="text"
                      required
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Question (English) *</label>
                    <input
                      type="text"
                      required
                      value={faqForm.questionEn}
                      onChange={(e) => setFaqForm({ ...faqForm, questionEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Answer (Bangla) *</label>
                    <textarea
                      required
                      rows={3}
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Answer (English) *</label>
                    <textarea
                      required
                      rows={3}
                      value={faqForm.answerEn}
                      onChange={(e) => setFaqForm({ ...faqForm, answerEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Category</label>
                    <select
                      value={faqForm.category}
                      onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald bg-white"
                    >
                      <option value="General">General</option>
                      <option value="Packages">Packages</option>
                      <option value="Requirements">Requirements</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={faqForm.order}
                      onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <button type="submit" className="bg-brand-emerald text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">
                  Add FAQ
                </button>
              </form>

              <div className="pt-6 border-t border-gray-100 max-h-[300px] overflow-y-auto space-y-3">
                <h4 className="font-serif-title font-bold text-xs text-brand-emerald">Existing FAQs</h4>
                {faqs.map(faq => (
                  <div key={faq.id} className="flex justify-between items-center text-xs p-3 bg-brand-bg rounded-lg border border-gray-100">
                    <div className="space-y-0.5 max-w-[80%]">
                      <p className="font-bold text-brand-emerald">{faq.question}</p>
                      <p className="text-gray-400 text-[10px]">{faq.category} (Order: {faq.order})</p>
                    </div>
                    <button onClick={() => deleteFAQ(faq.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-serif-title font-bold text-lg text-brand-emerald border-b border-gray-100 pb-3 uppercase tracking-wider">
                Add Pilgrim Testimonial
              </h3>

              <form onSubmit={addTestimonial} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Pilgrim Name (Bangla) *</label>
                    <input
                      type="text"
                      required
                      value={testForm.name}
                      onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Pilgrim Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={testForm.nameEn}
                      onChange={(e) => setTestForm({ ...testForm, nameEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">City (Bangla) *</label>
                    <input
                      type="text"
                      required
                      value={testForm.city}
                      onChange={(e) => setTestForm({ ...testForm, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">City (English) *</label>
                    <input
                      type="text"
                      required
                      value={testForm.cityEn}
                      onChange={(e) => setTestForm({ ...testForm, cityEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Star Rating</label>
                  <select
                    value={testForm.rating}
                    onChange={(e) => setTestForm({ ...testForm, rating: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald bg-white font-bold"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Review Text (Bangla) *</label>
                    <textarea
                      required
                      rows={3}
                      value={testForm.review}
                      onChange={(e) => setTestForm({ ...testForm, review: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Review Text (English) *</label>
                    <textarea
                      required
                      rows={3}
                      value={testForm.reviewEn}
                      onChange={(e) => setTestForm({ ...testForm, reviewEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <button type="submit" className="bg-brand-emerald text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">
                  Add Testimonial
                </button>
              </form>

              <div className="pt-6 border-t border-gray-100 max-h-[300px] overflow-y-auto space-y-3">
                <h4 className="font-serif-title font-bold text-xs text-brand-emerald">Existing Reviews</h4>
                {testimonials.map(t => (
                  <div key={t.id} className="flex justify-between items-center text-xs p-3 bg-brand-bg rounded-lg border border-gray-100">
                    <div className="space-y-0.5 max-w-[80%]">
                      <p className="font-bold text-brand-emerald">{t.name} ({t.city})</p>
                      <p className="text-gray-400 text-[10px] truncate">"{t.review}"</p>
                    </div>
                    <button onClick={() => deleteTestimonial(t.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEAM & GALLERY PANEL */}
        {activeTab === 'team-gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Gallery Upload */}
            <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-serif-title font-bold text-lg text-brand-emerald border-b border-gray-100 pb-3 uppercase tracking-wider">
                Upload Gallery Photo
              </h3>

              <form onSubmit={addGalleryItem} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700 block">Select Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, (url) => setGalForm({ ...galForm, imageUrl: url }))}
                      className="text-xs"
                    />
                    {galForm.imageUrl && (
                      <span className="text-[9px] text-emerald-600 font-bold">Uploaded ✓</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Caption</label>
                  <input
                    type="text"
                    required
                    value={galForm.caption}
                    onChange={(e) => setGalForm({ ...galForm, caption: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Category Tag</label>
                  <select
                    value={galForm.category}
                    onChange={(e) => setGalForm({ ...galForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald bg-white"
                  >
                    <option value="KAABA">KAABA</option>
                    <option value="HARAM">HARAM</option>
                    <option value="NABAWI">NABAWI</option>
                    <option value="PILGRIMS">PILGRIMS</option>
                    <option value="TOURS">TOURS</option>
                    <option value="ORIENTATION">ORIENTATION</option>
                    <option value="DEPARTURE">DEPARTURE</option>
                    <option value="CUSTOMERS">CUSTOMERS</option>
                  </select>
                </div>

                <button type="submit" disabled={!galForm.imageUrl} className="bg-brand-emerald disabled:opacity-40 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">
                  Add Image
                </button>
              </form>

              <div className="pt-6 border-t border-gray-100 max-h-[300px] overflow-y-auto space-y-3">
                <h4 className="font-serif-title font-bold text-xs text-brand-emerald">Current Gallery Photos</h4>
                {gallery.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs p-3 bg-brand-bg rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <p className="font-bold text-brand-emerald truncate max-w-[150px]">{item.caption}</p>
                        <p className="text-[9px] uppercase font-bold text-brand-gold">{item.category}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteGalleryItem(item.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-serif-title font-bold text-lg text-brand-emerald border-b border-gray-100 pb-3 uppercase tracking-wider">
                Add Team Member
              </h3>

              <form onSubmit={addTeamMember} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Role / Position</label>
                    <input
                      type="text"
                      required
                      value={teamForm.role}
                      onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Direct Phone</label>
                    <input
                      type="text"
                      value={teamForm.phone}
                      onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Direct Email</label>
                    <input
                      type="email"
                      value={teamForm.email}
                      onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Brief Bio</label>
                  <textarea
                    rows={2}
                    value={teamForm.bio}
                    onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <button type="submit" className="bg-brand-emerald text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">
                  Add Member
                </button>
              </form>

              <div className="pt-6 border-t border-gray-100 max-h-[250px] overflow-y-auto space-y-3">
                <h4 className="font-serif-title font-bold text-xs text-brand-emerald">Existing Team / Scholars</h4>
                {team.map(member => (
                  <div key={member.id} className="flex justify-between items-center text-xs p-3 bg-brand-bg rounded-lg border border-gray-100">
                    <div className="space-y-0.5">
                      <p className="font-bold text-brand-emerald">{member.name}</p>
                      <p className="text-gray-400 text-[10px]">{member.role}</p>
                    </div>
                    <button onClick={() => deleteTeamMember(member.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SITE SETTINGS PANEL */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Global Settings */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-serif-title font-bold text-lg text-brand-emerald border-b border-gray-100 pb-3 uppercase tracking-wider">
                Website Meta & Settings
              </h3>
              
              <form onSubmit={handleSettingsSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Office Physical Address (Bangla)</label>
                    <input
                      type="text"
                      value={siteSettings.officeAddress || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, officeAddress: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Office Physical Address (English)</label>
                    <input
                      type="text"
                      value={siteSettings.officeAddressEn || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, officeAddressEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Phone Hotline 1</label>
                    <input
                      type="text"
                      value={siteSettings.phone1 || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, phone1: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">WhatsApp Number</label>
                    <input
                      type="text"
                      value={siteSettings.whatsappNumber || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={siteSettings.emailAddress || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, emailAddress: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Business Hours (Bangla)</label>
                    <input
                      type="text"
                      value={siteSettings.businessHours || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, businessHours: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Business Hours (English)</label>
                    <input
                      type="text"
                      value={siteSettings.businessHoursEn || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, businessHoursEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Google Map Iframe Embed URL</label>
                  <input
                    type="text"
                    value={siteSettings.googleMapEmbedUrl || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, googleMapEmbedUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">SEO Meta Title</label>
                    <input
                      type="text"
                      value={siteSettings.seoTitle || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, seoTitle: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">SEO Description</label>
                    <input
                      type="text"
                      value={siteSettings.seoDescription || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, seoDescription: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <button type="submit" className="bg-brand-emerald text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow cursor-pointer">
                  Save Settings
                </button>
              </form>
            </div>

            {/* Homepage content */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-serif-title font-bold text-lg text-brand-emerald border-b border-gray-100 pb-3 uppercase tracking-wider">
                Homepage Content & Banners
              </h3>

              <form onSubmit={handleHomepageSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Hero Section Heading (Bangla)</label>
                    <input
                      type="text"
                      value={homepageContent.heroTitle || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, heroTitle: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Hero Section Heading (English)</label>
                    <input
                      type="text"
                      value={homepageContent.heroTitleEn || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, heroTitleEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Hero Subheading (Bangla)</label>
                    <textarea
                      rows={2}
                      value={homepageContent.heroSubtitle || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, heroSubtitle: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Hero Subheading (English)</label>
                    <textarea
                      rows={2}
                      value={homepageContent.heroSubtitleEn || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, heroSubtitleEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Govt Approval Reg (Bangla)</label>
                    <input
                      type="text"
                      value={homepageContent.govtRegistrationText || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, govtRegistrationText: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Govt Approval Reg (English)</label>
                    <input
                      type="text"
                      value={homepageContent.govtRegistrationTextEn || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, govtRegistrationTextEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Experience Years Stat</label>
                    <input
                      type="number"
                      value={homepageContent.experienceYears || 0}
                      onChange={(e) => setHomepageContent({ ...homepageContent, experienceYears: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Our Story Details (Bangla)</label>
                    <textarea
                      rows={3}
                      value={homepageContent.aboutStory || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, aboutStory: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Our Story Details (English)</label>
                    <textarea
                      rows={3}
                      value={homepageContent.aboutStoryEn || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, aboutStoryEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Mission (Bangla)</label>
                    <textarea
                      rows={2}
                      value={homepageContent.aboutMission || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, aboutMission: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Mission (English)</label>
                    <textarea
                      rows={2}
                      value={homepageContent.aboutMissionEn || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, aboutMissionEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Vision (Bangla)</label>
                    <textarea
                      rows={2}
                      value={homepageContent.aboutVision || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, aboutVision: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Vision (English)</label>
                    <textarea
                      rows={2}
                      value={homepageContent.aboutVisionEn || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, aboutVisionEn: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <button type="submit" className="bg-brand-emerald text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow cursor-pointer">
                  Save Homepage Content
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* --- CRUD MODALS FOR PACKAGES --- */}
      {pkgModalOpen && editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-gold/30 max-h-[90vh] flex flex-col">
            <div className="bg-brand-emerald text-white p-5 flex justify-between items-center flex-shrink-0">
              <h4 className="font-serif-title font-bold text-sm uppercase tracking-wide">
                {editingPkg.id ? 'Edit Package Information' : 'Add New Package'}
              </h4>
              <button onClick={() => { setPkgModalOpen(false); setEditingPkg(null); }} className="text-white hover:text-brand-gold text-xs font-bold cursor-pointer">
                Close
              </button>
            </div>

            <form onSubmit={handlePackageSave} className="p-6 overflow-y-auto flex-grow space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Package Title (Bangla) *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.title}
                    onChange={(e) => setEditingPkg({ ...editingPkg, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Package Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.titleEn}
                    onChange={(e) => setEditingPkg({ ...editingPkg, titleEn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Slug (URL-friendly text) *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.slug}
                    onChange={(e) => setEditingPkg({ ...editingPkg, slug: e.target.value })}
                    placeholder="e.g. premium-hajj-2027"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Description (Bangla) *</label>
                  <textarea
                    required
                    rows={2}
                    value={editingPkg.description}
                    onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Description (English) *</label>
                  <textarea
                    required
                    rows={2}
                    value={editingPkg.descriptionEn}
                    onChange={(e) => setEditingPkg({ ...editingPkg, descriptionEn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Type *</label>
                  <select
                    value={editingPkg.type}
                    onChange={(e) => setEditingPkg({ ...editingPkg, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald bg-white font-bold"
                  >
                    <option value="HAJJ">HAJJ</option>
                    <option value="UMRAH">UMRAH</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Category *</label>
                  <select
                    value={editingPkg.category}
                    onChange={(e) => setEditingPkg({ ...editingPkg, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald bg-white font-bold"
                  >
                    <option value="VIP">VIP</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="STANDARD">STANDARD</option>
                    <option value="ECONOMY">ECONOMY</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Duration (Days) *</label>
                  <input
                    type="number"
                    required
                    value={editingPkg.durationDays}
                    onChange={(e) => setEditingPkg({ ...editingPkg, durationDays: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Price (BDT ৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingPkg.price}
                    onChange={(e) => setEditingPkg({ ...editingPkg, price: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Makkah Hotel Details (Bangla) *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.hotelDetailsMakkah}
                    onChange={(e) => setEditingPkg({ ...editingPkg, hotelDetailsMakkah: e.target.value })}
                    placeholder="হোটেলের নাম ও দূরত্ব"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Makkah Hotel Details (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.hotelDetailsMakkahEn}
                    onChange={(e) => setEditingPkg({ ...editingPkg, hotelDetailsMakkahEn: e.target.value })}
                    placeholder="Hotel Name & Distance"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Madinah Hotel Details (Bangla) *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.hotelDetailsMadinah}
                    onChange={(e) => setEditingPkg({ ...editingPkg, hotelDetailsMadinah: e.target.value })}
                    placeholder="হোটেলের নাম ও দূরত্ব"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Madinah Hotel Details (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.hotelDetailsMadinahEn}
                    onChange={(e) => setEditingPkg({ ...editingPkg, hotelDetailsMadinahEn: e.target.value })}
                    placeholder="Hotel Name & Distance"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={editingPkg.departureDate}
                    onChange={(e) => setEditingPkg({ ...editingPkg, departureDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Highlights (Bangla - Comma Separated) *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.highlights}
                    onChange={(e) => setEditingPkg({ ...editingPkg, highlights: e.target.value })}
                    placeholder="যেমন: রিটার্ন ফ্লাইট, ৫-তারকা হোটেল, বুফে খাবার"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Highlights (English - Comma Separated) *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.highlightsEn}
                    onChange={(e) => setEditingPkg({ ...editingPkg, highlightsEn: e.target.value })}
                    placeholder="e.g. Return flights, 5-Star Hotel, Buffet Meals"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 border-t border-gray-100 pt-3">
                <label className="flex items-center gap-1.5 font-semibold">
                  <input
                    type="checkbox"
                    checked={editingPkg.flightIncluded}
                    onChange={(e) => setEditingPkg({ ...editingPkg, flightIncluded: e.target.checked })}
                  />
                  Flight
                </label>
                <label className="flex items-center gap-1.5 font-semibold">
                  <input
                    type="checkbox"
                    checked={editingPkg.visaIncluded}
                    onChange={(e) => setEditingPkg({ ...editingPkg, visaIncluded: e.target.checked })}
                  />
                  Visa
                </label>
                <label className="flex items-center gap-1.5 font-semibold">
                  <input
                    type="checkbox"
                    checked={editingPkg.mealsIncluded}
                    onChange={(e) => setEditingPkg({ ...editingPkg, mealsIncluded: e.target.checked })}
                  />
                  Meals
                </label>
                <label className="flex items-center gap-1.5 font-semibold">
                  <input
                    type="checkbox"
                    checked={editingPkg.guideIncluded}
                    onChange={(e) => setEditingPkg({ ...editingPkg, guideIncluded: e.target.checked })}
                  />
                  Scholar Guide
                </label>
                <label className="flex items-center gap-1.5 font-semibold">
                  <input
                    type="checkbox"
                    checked={editingPkg.ziyaratIncluded}
                    onChange={(e) => setEditingPkg({ ...editingPkg, ziyaratIncluded: e.target.checked })}
                  />
                  Ziyarat
                </label>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <label className="flex items-center gap-1.5 font-bold">
                  <input
                    type="checkbox"
                    checked={editingPkg.isPublished}
                    onChange={(e) => setEditingPkg({ ...editingPkg, isPublished: e.target.checked })}
                  />
                  Publish publicly immediately
                </label>
                <button type="submit" className="bg-brand-emerald text-white px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CRUD MODALS FOR BLOGS --- */}
      {blogModalOpen && editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-gold/30 max-h-[90vh] flex flex-col">
            <div className="bg-brand-emerald text-white p-5 flex justify-between items-center flex-shrink-0">
              <h4 className="font-serif-title font-bold text-sm uppercase tracking-wide">
                {editingBlog.id ? 'Edit Article Information' : 'Add New Article'}
              </h4>
              <button onClick={() => { setBlogModalOpen(false); setEditingBlog(null); }} className="text-white hover:text-brand-gold text-xs font-bold cursor-pointer">
                Close
              </button>
            </div>

            <form onSubmit={handleBlogSave} className="p-6 overflow-y-auto flex-grow space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Title (Bangla) *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.titleEn}
                    onChange={(e) => setEditingBlog({ ...editingBlog, titleEn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Slug (URL parameter) *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.slug}
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    placeholder="e.g. packing-list-umrah"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Cover Image URL *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.imageUrl}
                    onChange={(e) => setEditingBlog({ ...editingBlog, imageUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald mb-2"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-semibold">Or upload new:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, (url) => setEditingBlog({ ...editingBlog, imageUrl: url }))}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Category *</label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald bg-white font-semibold"
                  >
                    <option value="Hajj Guide">Hajj Guide</option>
                    <option value="Umrah Checklist">Umrah Checklist</option>
                    <option value="Travel Tips">Travel Tips</option>
                    <option value="Packing Guide">Packing Guide</option>
                    <option value="Religious Preparation">Religious Preparation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Summary description (Bangla) *</label>
                  <textarea
                    required
                    rows={2}
                    value={editingBlog.summary}
                    onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Summary description (English) *</label>
                  <textarea
                    required
                    rows={2}
                    value={editingBlog.summaryEn}
                    onChange={(e) => setEditingBlog({ ...editingBlog, summaryEn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Article Content (Bangla - HTML supported) *</label>
                  <textarea
                    required
                    rows={8}
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    placeholder="<p>এখানে বিস্তারিত লিখুন...</p>"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Article Content (English - HTML supported) *</label>
                  <textarea
                    required
                    rows={8}
                    value={editingBlog.contentEn}
                    onChange={(e) => setEditingBlog({ ...editingBlog, contentEn: e.target.value })}
                    placeholder="<p>Write your detailed article body here...</p>"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <label className="flex items-center gap-1.5 font-bold">
                  <input
                    type="checkbox"
                    checked={editingBlog.isPublished}
                    onChange={(e) => setEditingBlog({ ...editingBlog, isPublished: e.target.checked })}
                  />
                  Publish publicly immediately
                </label>
                <button type="submit" className="bg-brand-emerald text-white px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider cursor-pointer">
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
