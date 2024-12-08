import axios from "axios";

// 재시도 로직을 위한 함수
const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
  let attempt = 0;
  let lastError = null;

  while (attempt < retries) {
    try {
      const response = await axios.get(url); // 기본 요청
      return response;  // 성공하면 응답 반환
    } catch (error) {
      attempt++;
      lastError = error;
      if (attempt >= retries) {
        throw lastError;  // 재시도 횟수를 다 소진했으면 마지막 오류를 던짐
      }
      // 재시도 전에 대기
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default async function handler(req, res) {
  try {
    const { start = 530001, end = 530700 } = req.query;
    const startIndex = parseInt(start, 10);
    const endIndex = parseInt(end, 10);

    if (isNaN(startIndex) || isNaN(endIndex) || startIndex <= 0 || endIndex <= 0) {
      return res.status(400).json({ error: "Invalid range parameters. Must be positive integers." });
    }

    console.log(`Fetching data from API: range ${startIndex}-${endIndex}`);

    const url = `http://openapi.seoul.go.kr:8088/58624c767a63796c37386a42726a66/xml/SeoulLibraryBookSearchInfo/${startIndex}/${endIndex}`;

    // 재시도 로직을 사용하여 데이터 가져오기
    const response = await fetchWithRetry(url, 3, 1000); // 3번의 재시도, 1초의 대기 시간

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(response.data);
    
  } catch (error) {
    console.error("Error in Serverless Function:", error.message);
    res.status(500).json({ error: "Failed to fetch data from OpenAPI" });
  }
}
