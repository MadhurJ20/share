// import dbConnect from "../../utils/db";
// import Url from "../../models/url";
// import { createObjectCsvStringifier } from "csv-writer";

// export const config = {
//   runtime: "edge",
// };

// export default async function handler(req) {
//   try {
//     await dbConnect();

//     if (req.method === "GET") {
//       const urls = await Url.find({});
//       const csvStringifier = createObjectCsvStringifier({
//         header: [
//           { id: "_id", title: "ID" },
//           { id: "url", title: "URL" },
//           // Add other fields as necessary
//         ],
//       });
//       const csv =
//         csvStringifier.getHeaderString() +
//         csvStringifier.stringifyRecords(urls);

//       return new Response(csv, {
//         headers: {
//           "Content-Type": "text/csv",
//           "Content-Disposition": "attachment; filename=urls.csv",
//         },
//       });
//     } else {
//       return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
//         status: 405,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ message: "Server error" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// }
