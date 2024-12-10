import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowList = ({ cart = [], addToCart = () => {} }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("title");
  const [sortType, setSortType] = useState("");
  const [languageFilter, setLanguageFilter] = useState("ALL");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 10;

  const apiUrl = "https://67582f9d60576a194d0f3f84.mockapi.io/book";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${apiUrl}?limit=100`);
        const bookArray = response.data.map((book) => ({
          ...book,
          loan_available: book.loan_available === "Y" ? "대여 가능" : "대여 불가",
        }));

        setBooks(bookArray);
        setFilteredBooks(bookArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 가져오는데 실패했습니다. 페이지를 다시 열어주세요.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // 필터링과 정렬 적용 후 페이지를 1로 리셋
  useEffect(() => {
    let updatedBooks = [...books]; // 불변성을 유지하기 위해 새로운 배열 생성

    if (searchKeyword) {
      updatedBooks = updatedBooks.filter((book) =>
        book[filterType]?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (showAvailableOnly) {
      updatedBooks = updatedBooks.filter(
        (book) => book.loan_available === "대여 가능"
      );
    }

    if (languageFilter !== "ALL") {
      updatedBooks = updatedBooks.filter((book) => book.language === languageFilter);
    }

    // 정렬 로직 수정
    if (sortType === "title_asc") {
      updatedBooks = [...updatedBooks].sort((a, b) =>
        a.title.localeCompare(b.title, "ko", { sensitivity: "base" })
      );
    } else if (sortType === "control_number_asc") {
      updatedBooks = [...updatedBooks].sort((a, b) =>
        parseInt(a.control_number, 10) - parseInt(b.control_number, 10)
      );
    } else if (sortType === "publication_year_asc") {
      updatedBooks = [...updatedBooks].sort((a, b) => 
        Number(a.publication_year) - Number(b.publication_year)
      );
    }

    setFilteredBooks([...updatedBooks]); // 상태 변경을 인식시키기 위해 새로운 배열로 교체
    setCurrentPage(1); // 정렬 또는 필터링 시 1페이지로 리셋
  }, [books, searchKeyword, filterType, showAvailableOnly, languageFilter, sortType]);

  const displayedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  const startPage = 1;
  const endPage = totalPages;

  if (loading) return <p>데이터를 불러오는 중입니다...</p>;
  if (error) return <p>오류 발생: {error}</p>;

  return (
    <div className="container">
      <h1>도서 리스트</h1>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn btn-primary ms-2"
          onClick={() => navigate("/cart")}
        >
          장바구니 보기
        </button>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/rental")}
        >
          대여 리스트 보기
        </button>
      </div>

      <div className="filters">
        <div>
          <input
            type="text"
            placeholder="검색어 입력"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
            <option value="title">제목</option>
            <option value="author">저자</option>
            <option value="publisher">출판사</option>
          </select>
          <select onChange={(e) => setSortType(e.target.value)} value={sortType} style={{ marginLeft: "10px" }}>
            <option value="">정렬 없음</option>
            <option value="title_asc">책 제목 가나다순</option>
            <option value="control_number_asc">자료 코드순</option>
            <option value="publication_year_asc">출판 연도순</option>
          </select>
        </div>
      </div>

      <div id="data-list">
        {displayedBooks.map((book) => (
          <div key={book.control_number} className="book-item">
            <div>
              <strong>{book.title}</strong>
              <p>{`${book.author} / ${book.publisher}`}</p>
            </div>
            <div>
              <button 
                className="btn btn-warning" 
                onClick={() => addToCart(book)} 
                disabled={cart.some((item) => item.control_number === book.control_number)}
              >
                {cart.some((item) => item.control_number === book.control_number) ? '장바구니에 있음' : '장바구니 추가'}
              </button>
              <button className="btn btn-info" onClick={() => navigate(`/book/${book.control_number}`)}>상세보기</button>
              <span style={{ color: book.loan_available === "대여 가능" ? "green" : "red" }}>
                {book.loan_available}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: endPage }, (_, i) => startPage + i).map((pageNumber) => (
          <button 
            key={pageNumber} 
            className={`page-btn ${currentPage === pageNumber ? "active" : ""}`} 
            onClick={() => changePage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShowList;
