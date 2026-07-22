import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const { name, phone, email, packageInterest, preferredMonth, message } = req.body;

  try {
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ error: 'Name, phone, email, and message are required' });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        phone,
        email,
        packageInterest: packageInterest || 'General Inquiry',
        preferredMonth: preferredMonth || 'Not Specified',
        message
      }
    });

    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.contactMessage.delete({
      where: { id }
    });
    res.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
