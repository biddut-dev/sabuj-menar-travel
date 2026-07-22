import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.bookingRequest.findMany({
      include: {
        package: {
          select: { id: true, title: true, price: true }
        },
        assignedStaff: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const {
    fullName,
    phone,
    email,
    passportNumber,
    nationality,
    numTravelers,
    packageType,
    preferredMonth,
    notes,
    packageId
  } = req.body;

  try {
    if (!fullName || !phone || !email || !nationality || !packageType || !preferredMonth) {
      return res.status(400).json({ error: 'All fields except passport and notes are required' });
    }

    const booking = await prisma.bookingRequest.create({
      data: {
        fullName,
        phone,
        email,
        passportNumber,
        nationality,
        numTravelers: numTravelers ? parseInt(numTravelers.toString()) : 1,
        packageType,
        preferredMonth,
        notes,
        packageId
      }
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.bookingRequest.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const assignStaff = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { assignedStaffId } = req.body;

  try {
    const updated = await prisma.bookingRequest.update({
      where: { id },
      data: { assignedStaffId: assignedStaffId || null }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.bookingRequest.delete({
      where: { id }
    });
    res.json({ message: 'Booking request deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
