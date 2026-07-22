import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  const { name, nameEn, city, cityEn, rating, review, reviewEn, imageUrl } = req.body;

  try {
    if (!name || !review || !rating) {
      return res.status(400).json({ error: 'Name, review, and rating are required' });
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        nameEn: nameEn || name,
        city: city || 'Pilgrim',
        cityEn: cityEn || city || 'Pilgrim',
        rating: parseInt(rating.toString()),
        review,
        reviewEn: reviewEn || review,
        imageUrl
      }
    });

    res.status(201).json(newTestimonial);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.testimonial.delete({
      where: { id }
    });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
