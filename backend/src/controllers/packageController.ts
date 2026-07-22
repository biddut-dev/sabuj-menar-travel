import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getPackages = async (req: Request, res: Response) => {
  const { type, category, isPublished } = req.query;

  try {
    const filters: any = {};
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (isPublished !== undefined) {
      filters.isPublished = isPublished === 'true';
    }

    const packages = await prisma.package.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });

    res.json(packages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPackageBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const pkg = await prisma.package.findUnique({
      where: { slug }
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(pkg);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPackageById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pkg = await prisma.package.findUnique({
      where: { id }
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(pkg);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPackage = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    if (!data.title || !data.slug || !data.price) {
      return res.status(400).json({ error: 'Title, slug, and price are required' });
    }

    if (data.departureDate) {
      data.departureDate = new Date(data.departureDate);
    }
    if (data.durationDays) {
      data.durationDays = parseInt(data.durationDays);
    }
    if (data.price) {
      data.price = parseFloat(data.price);
    }

    const newPackage = await prisma.package.create({
      data
    });

    res.status(201).json(newPackage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    if (data.departureDate) {
      data.departureDate = new Date(data.departureDate);
    }
    if (data.durationDays) {
      data.durationDays = parseInt(data.durationDays);
    }
    if (data.price) {
      data.price = parseFloat(data.price);
    }

    const updatedPackage = await prisma.package.update({
      where: { id },
      data
    });

    res.json(updatedPackage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.package.delete({
      where: { id }
    });

    res.json({ message: 'Package deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
