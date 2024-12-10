import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Detail = () => {
  const { CTRLNO } = useParams();
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("/api/books"); // API 호출
        const xmlData = response.data;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "application/xml");

        const rows = xmlDoc.getElementsByTagName("row");
        const books = Array.from(rows).map((row) => ({
          CTRLNO: row.getElementsByTagName("CTRLNO")[0]?.textContent || "N/A",
          TITLE: row.getElementsByTagName("TITLE")[0]?.textContent || "제목 없음",
          BIB_TYPE_NAME:
            row.getElementsByTagName("BIB_TYPE_NAME")[0]?.textContent || "N/A",
          AUTHOR: row.getElementsByTagName("AUTHOR")[0]?.textContent || "저자 없음",
          PUBLER: row.getElementsByTagName("PUBLER")[0]?.textContent || "출판사 없음",
          PUBLER_YEAR:
            parseInt(
              row.getElementsByTagName("PUBLER_YEAR")[0]?.textContent || "0",
              10
            ),
          CALL_NO: row.getElementsByTagName("CALL_NO")[0]?.textContent || "N/A",
          CLASS_NO: row.getElementsByTagName("CLASS_NO")[0]?.textContent || "N/A",
          AUTHOR_NO: row.getElementsByTagName("AUTHOR_NO")[0]?.textContent || "N/A",
          LANG: row.getElementsByTagName("LANG")[0]?.textContent || "N/A",
          PAGE: row.getElementsByTagName("PAGE")[0]?.textContent || "N/A",
          ISBN: row.getElementsByTagName("ISBN")[0]?.textContent || "N/A",
        }));

        const currentBook = books.find((book) => book.CTRLNO === CTRLNO);
        if (!currentBook) throw new Error("해당 도서를 찾을 수 없습니다.");

        setBookDetails(currentBook);

        // CLASS_NO의 첫 자리수에 기반한 추천 도서 생성
        const firstClassDigit = currentBook.CLASS_NO[0];
        const recommended = books
          .filter((book) => book.CLASS_NO.startsWith(firstClassDigit) && book.CTRLNO !== CTRLNO)
          .sort(() => 0.5 - Math.random()) // 랜덤 정렬
          .slice(0, 5); // 5권만 선택

        setRecommendedBooks(recommended);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("도서 정보를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [CTRLNO]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류 발생: {error}</p>;

  return (
    <div className="container">
      <h1>도서 상세 정보</h1>
      {bookDetails && (
        <div className="book-details">
          <p><strong>제목:</strong> {bookDetails.TITLE}</p>
          <p><strong>자료유형:</strong> {bookDetails.BIB_TYPE_NAME}</p>
          <p><strong>저자:</strong> {bookDetails.AUTHOR}</p>
          <p><strong>출판사:</strong> {bookDetails.PUBLER}</p>
          <p><strong>출판 연도:</strong> {bookDetails.PUBLER_YEAR}</p>
          <p><strong>청구기호:</strong> {bookDetails.CALL_NO}</p>
          <p><strong>분류기호:</strong> {bookDetails.CLASS_NO}</p>
          <p><strong>저자기호:</strong> {bookDetails.AUTHOR_NO}</p>
          <p><strong>언어:</strong> {bookDetails.LANG}</p>
          <p><strong>페이지:</strong> {bookDetails.PAGE}</p>
          <p><strong>ISBN:</strong> {bookDetails.ISBN}</p>
        </div>
      )}

      <h2>추천 도서</h2>
      <div className="recommended-books" style={{ marginTop: "20px" }}>
        {recommendedBooks.length === 0 ? (
          <p>추천할 도서가 없습니다.</p>
        ) : (
          recommendedBooks.map((book) => (
            <div
              key={book.CTRLNO}
              className="recommended-book"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                padding: "10px 0",
              }}
            >
              <div>
                <strong>{book.TITLE}</strong>
                <p>{`${book.AUTHOR} / ${book.PUBLER}`}</p>
              </div>
              <button
                className="btn btn-info"
                onClick={() => navigate(`/book/${book.CTRLNO}`)}
              >
                상세보기
              </button>
            </div>
          ))
        )}
      </div>

      <button className="btn btn-primary" onClick={() => navigate("/home")} style={{ marginTop: "20px" }}>
        도서 리스트로 돌아가기
      </button>
    </div>
  );
};

export default Detail;
