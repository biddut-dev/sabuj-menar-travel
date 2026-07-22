import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(team);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTeamMember = async (req: Request, res: Response) => {
  const { name, role, imageUrl, phone, email, bio } = req.body;

  try {
    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    const member = await prisma.teamMember.create({
      data: { name, role, imageUrl, phone, email, bio }
    });

    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data
    });
    res.json(member);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.teamMember.delete({
      where: { id }
    });
    res.json({ message: 'Team member deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
