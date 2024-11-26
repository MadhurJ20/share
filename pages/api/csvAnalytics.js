import dbConnect from "../../utils/db";
import Url from "../../models/url";
import { createObjectCsvStringifier } from "csv-writer";

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const urls = await Url.find({});
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: "_id", title: "ID" },
          { id: "url", title: "URL" },
          // Add other fields as necessary
        ],
      });
      const csv =
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(urls);

      // Set the content type for the response as CSV
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=urls.csv");
      res.status(200).send(csv);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
