// pages/api/analytics.js
import dbConnect from '../../utils/db';
import Url from '../../models/url';

export default async function handler(req, res) {
  try {
    await dbConnect();
    const urls = await Url.find({});
    res.status(200).json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
