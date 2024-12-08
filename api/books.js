import axios from "axios";

const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
  let attempt = 0;
  let lastError = null;

  while (attempt < retries) {
    try {
      const response = await axios.get(url); 
      return response;  
    } catch (error) {
      attempt++;
      lastError = error;
      if (attempt >= retries) {
        throw lastError;  
      }
  
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default async function handler(req, res) {
  try {
    const { start = 530001, end = 530800 } = req.query;
    const startIndex = parseInt(start, 10);
    const endIndex = parseInt(end, 10);

    if (isNaN(startIndex) || isNaN(endIndex) || startIndex <= 0 || endIndex <= 0) {
      return res.status(400).json({ error: "Invalid range parameters. Must be positive integers." });
    }

    console.log(`Fetching data from API: range ${startIndex}-${endIndex}`);

    const url = `http://openapi.seoul.go.kr:8088/58624c767a63796c37386a42726a66/xml/SeoulLibraryBookSearchInfo/${startIndex}/${endIndex}`;

    const response = await fetchWithRetry(url, 3, 1000); 

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(response.data);
    
  } catch (error) {
    console.error("Error in Serverless Function:", error.message);
    res.status(500).json({ error: "Failed to fetch data from OpenAPI" });
  }
}
