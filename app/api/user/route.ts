import { NextApiRequest, NextApiResponse } from 'next';
import { Schema, model, models } from 'mongoose';
import connectToDb from '@/utils/connectToDb';

// Define the User schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create the User model
const User = models.User || model('User', userSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await connectToDb();

  switch (method) {
    case 'POST':
      try {
        const { email, image, role } = req.body;
        const user = new User({ email, image, role });
        await user.save();
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'PUT':
      try {
        const { id, email, image, role } = req.body;
        const user = await User.findByIdAndUpdate(id, { email, image, role }, { new: true });
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.body;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
      break;
  }
}