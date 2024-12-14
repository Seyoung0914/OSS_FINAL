import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Detail = ({ cart = [], addToCart = () => { } }) => {
  const { control_number } = useParams(); 
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = "https://67582f9d60576a194d0f3f84.mockapi.io/book";

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("📚 control_number:", control_number); 

   
        const response = await axios.get(`${apiUrl}?control_number=${control_number}`);
        const bookData = response.data[0]; 

        if (!bookData) throw new Error("도서 정보를 찾을 수 없습니다.");

        setBookDetails(bookData);

        const allBooksResponse = await axios.get(apiUrl);
        const allBooks = allBooksResponse.data;

        const recommended = allBooks
          .filter(
            (book) =>
              book.class_number?.startsWith(bookData.class_number[0]) && 
              book.control_number !== control_number 
          )
          .sort(() => 0.5 - Math.random()) 
          .slice(0, 3); 

        setRecommendedBooks(recommended);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("도서 정보를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    if (control_number) {
      fetchBookDetails(); 
    }
  }, [control_number]);

  if (loading) return <p>로딩 중...</p>;
  if (error)
    return (
      <div>
        <p>오류 발생: {error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button className="btn btn-primary" onClick={() => navigate("/cart")} style={{ marginRight: "10px" }}>
          장바구니 보기
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/rental")}>
          대여 리스트 보기
        </button>
      </div>

      <h1>도서 상세 정보</h1>
      {bookDetails && (
        <div className="book-details">
          <p><strong>제목:</strong> {bookDetails.title}</p>
          <p><strong>저자:</strong> {bookDetails.author}</p>
          <p><strong>출판사:</strong> {bookDetails.publisher}</p>
          <p><strong>출판 연도:</strong> {bookDetails.publication_year}</p>
          <p><strong>청구기호:</strong> {bookDetails.call_number}</p>
          <p><strong>분류기호:</strong> {bookDetails.class_number}</p>
          <p><strong>언어:</strong> {bookDetails.language}</p>
          <p><strong>페이지:</strong> {bookDetails.pages}</p>
          <p><strong>ISBN:</strong> {bookDetails.isbn}</p>
          <p><strong>등록일:</strong> {bookDetails.create_date}</p>
     
          <button
            className="btn btn-warning"
            onClick={() => addToCart(bookDetails)}
            disabled={cart.some((item) => item.control_number === bookDetails.control_number)}
            style={{ marginTop: "20px" }}
          >
            {cart.some((item) => item.control_number === bookDetails.control_number)
              ? "장바구니에 있음"
              : "장바구니 추가"}
          </button>
        </div>
      )}

      <h2>추천 도서</h2>
      <div className="recommended-books" style={{ marginTop: "20px" }}>
        {recommendedBooks.length === 0 ? (
          <p>추천할 도서가 없습니다.</p>
        ) : (
          recommendedBooks.map((book) => (
            <div
              key={book.control_number}
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
                <strong>{book.title}</strong>
                <p>{`${book.author} / ${book.publisher}`}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <button
                  className="btn btn-warning"
                  onClick={() => addToCart(book)}
                  disabled={cart.some((item) => item.control_number === book.control_number)}
                  style={{ marginBottom: "10px" }}
                >
                  {cart.some((item) => item.control_number === book.control_number)
                    ? "장바구니에 있음"
                    : "장바구니 추가"}
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => navigate(`/book/${book.control_number}`)} 
                >
                  상세보기
                </button>
              </div>
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