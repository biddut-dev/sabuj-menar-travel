import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalBookings = await prisma.bookingRequest.count();
    const pendingBookings = await prisma.bookingRequest.count({ where: { status: 'PENDING' } });
    const contactedBookings = await prisma.bookingRequest.count({ where: { status: 'CONTACTED' } });
    const confirmedBookings = await prisma.bookingRequest.count({ where: { status: 'CONFIRMED' } });
    const completedBookings = await prisma.bookingRequest.count({ where: { status: 'COMPLETED' } });

    const totalMessages = await prisma.contactMessage.count();
    const unreadMessages = await prisma.contactMessage.count({ where: { status: 'PENDING' } });

    const totalPackages = await prisma.package.count();
    const hajjPackages = await prisma.package.count({ where: { type: 'HAJJ' } });
    const umrahPackages = await prisma.package.count({ where: { type: 'UMRAH' } });

    const activeInquiries = await prisma.bookingRequest.findMany({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] }
      },
      include: {
        package: { select: { price: true } }
      }
    });

    const estimatedRevenue = activeInquiries.reduce((sum, item) => {
      const price = item.package?.price || 0;
      return sum + (price * item.numTravelers);
    }, 0);

    const economyCount = await prisma.package.count({ where: { category: 'ECONOMY' } });
    const standardCount = await prisma.package.count({ where: { category: 'STANDARD' } });
    const premiumCount = await prisma.package.count({ where: { category: 'PREMIUM' } });
    const vipCount = await prisma.package.count({ where: { category: 'VIP' } });

    const recentBookings = await prisma.bookingRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { package: { select: { title: true } } }
    });

    const recentMessages = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const statusDistribution = [
      { name: 'Pending', value: pendingBookings },
      { name: 'Contacted', value: contactedBookings },
      { name: 'Confirmed', value: confirmedBookings },
      { name: 'Completed', value: completedBookings }
    ];

    const categoryDistribution = [
      { name: 'Economy', value: economyCount },
      { name: 'Standard', value: standardCount },
      { name: 'Premium', value: premiumCount },
      { name: 'VIP', value: vipCount }
    ];

    res.json({
      counters: {
        totalBookings,
        pendingBookings,
        contactedBookings,
        confirmedBookings,
        completedBookings,
        totalMessages,
        unreadMessages,
        totalPackages,
        hajjPackages,
        umrahPackages,
        estimatedRevenue
      },
      distributions: {
        status: statusDistribution,
        category: categoryDistribution
      },
      recentBookings,
      recentMessages
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
