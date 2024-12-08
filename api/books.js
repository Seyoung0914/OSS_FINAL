import axios from "axios";

export default async function handler(req, res) {
    try {
        const { start = 530001, end = 530700 } = req.query;
        const startIndex = parseInt(start, 10);
        const endIndex = parseInt(end, 10);
        if (isNaN(startIndex) || isNaN(endIndex) || startIndex <= 0 || endIndex <= 0) {
            return res.status(400).json({ error: "Invalid range parameters. Must be positive integers." });
        }
    
        console.log(`Fetching data from API: range ${startIndex}-${endIndex}`);
        const response = await axios.get(
            `http://openapi.seoul.go.kr:8088/58624c767a63796c37386a42726a66/xml/SeoulLibraryBookSearchInfo/${startIndex}/${endIndex}`
        );
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).send(response.data);
    } catch (error) {
        console.error("Error in Serverless Function:", error.message);
        res.status(500).json({ error: "Failed to fetch data from OpenAPI" });
    }
}
