// pages/api/analytics.js
import dbConnect from '../../utils/db';
import Url from '../../models/url';

export default async function handler(req, res) {
  try {
    await dbConnect();
    if (req.method === 'GET') {
      const urls = await Url.find({});
      return res.status(200).json(urls);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;  // Get the URL ID from the query parameters
      if (!id) {
        return res.status(400).json({ message: 'URL ID is required' });
      }
      const result = await Url.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: 'URL not found' });
      }
      return res.status(200).json({ message: 'URL deleted successfully' });
    }
    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
