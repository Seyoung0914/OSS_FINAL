import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowList = ({ cart = [], addToCart = () => {}, availableBooks = [] }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("TITLE");
  const [sortType, setSortType] = useState("");
  const [languageFilter, setLanguageFilter] = useState("ALL");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false); // 대여 가능 도서만 보기
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageGroup, setCurrentPageGroup] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 20;
  const pagesPerGroup = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/books");
        const xmlData = response.data;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "application/xml");

        const resultCode = xmlDoc.getElementsByTagName("CODE")[0]?.textContent;
        if (resultCode !== "INFO-000") {
          throw new Error(
            xmlDoc.getElementsByTagName("MESSAGE")[0]?.textContent || "API Error"
          );
        }

        const rows = xmlDoc.getElementsByTagName("row");
        const bookArray = Array.from(rows).map((row) => ({
          CTRLNO: row.getElementsByTagName("CTRLNO")[0]?.textContent || "N/A",
          TITLE: row.getElementsByTagName("TITLE")[0]?.textContent || "제목 없음",
          AUTHOR: row.getElementsByTagName("AUTHOR")[0]?.textContent || "저자 없음",
          PUBLER: row.getElementsByTagName("PUBLER")[0]?.textContent || "출판사 없음",
          PUBLER_YEAR:
            parseInt(
              row.getElementsByTagName("PUBLER_YEAR")[0]?.textContent || "0",
              10
            ),
          AVAILABLE: "대여 가능",
          LANG: row.getElementsByTagName("LANG")[0]?.textContent || "N/A",
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

  useEffect(() => {
    if (!books || books.length === 0) return;

    let updatedBooks = books;

    // 검색어 필터
    if (searchKeyword) {
      updatedBooks = updatedBooks.filter((book) =>
        book[filterType]?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 대여 가능 도서만 보기 필터
    if (showAvailableOnly) {
      updatedBooks = updatedBooks.filter(
        (book) => book.AVAILABLE === "대여 가능"
      );
    }

    // 언어 필터
    if (languageFilter !== "ALL") {
      updatedBooks = updatedBooks.filter((book) => book.LANG === languageFilter);
    }

    // 정렬 처리
    if (sortType === "TITLE_ASC") {
      updatedBooks = updatedBooks.sort((a, b) =>
        a.TITLE.localeCompare(b.TITLE, "ko", { sensitivity: "base" })
      );
    } else if (sortType === "CTRLNO_ASC") {
      updatedBooks = updatedBooks.sort((a, b) =>
        a.CTRLNO.localeCompare(b.CTRLNO, "ko", { sensitivity: "base" })
      );
    } else if (sortType === "PUBLER_YEAR_ASC") {
      updatedBooks = updatedBooks.sort((a, b) => a.PUBLER_YEAR - b.PUBLER_YEAR);
    }

    setFilteredBooks([...updatedBooks]);
  }, [books, searchKeyword, filterType, showAvailableOnly, languageFilter, sortType]);

  const displayedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  const changePageGroup = (direction) => {
    if (direction === "next" && currentPageGroup < totalGroups - 1) {
      setCurrentPageGroup(currentPageGroup + 1);
      setCurrentPage(currentPageGroup * pagesPerGroup + 1 + pagesPerGroup);
    } else if (direction === "prev" && currentPageGroup > 0) {
      setCurrentPageGroup(currentPageGroup - 1);
      setCurrentPage(currentPageGroup * pagesPerGroup + 1 - pagesPerGroup);
    }
  };

  const startPage = currentPageGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  if (loading) return <p>데이터를 불러오는 중입니다...</p>;
  if (error) return <p>오류 발생: {error}</p>;

  return (
    <div className="container">
      <h1>도서 리스트</h1>
      <div
        className="filters"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <input
            type="text"
            placeholder="검색어 입력"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <select
            onChange={(e) => setFilterType(e.target.value)}
            value={filterType}
          >
            <option value="TITLE">제목</option>
            <option value="AUTHOR">저자</option>
            <option value="PUBLER">출판사</option>
          </select>
          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            style={{ marginLeft: "10px" }}
          >
            <option value="">정렬 없음</option>
            <option value="TITLE_ASC">책 제목 가나다순</option>
            <option value="CTRLNO_ASC">자료 코드순</option>
            <option value="PUBLER_YEAR_ASC">출판 연도순</option>
          </select>
          <select
            onChange={(e) => setLanguageFilter(e.target.value)}
            value={languageFilter}
            style={{ marginLeft: "10px" }}
          >
            <option value="ALL">모든 언어</option>
            <option value="kor">한국어</option>
            <option value="eng">영어</option>
          </select>
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/cart")}
            style={{ marginRight: "10px" }}
          >
            장바구니 보기
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/rental")}>
            대여 리스트 보기
          </button>
          {/* 대여 가능 도서만 보기 토글 버튼 */}
          <button
            className="btn btn-toggle"
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            style={{ marginLeft: "10px" }}
          >
            {showAvailableOnly ? "모든 도서 보기" : "대여 가능 도서만 보기"}
          </button>
        </div>
      </div>

      <div id="data-list" style={{ marginTop: "20px" }}>
        {displayedBooks.map((book) => (
          <div
            key={book.CTRLNO}
            className="book-item"
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    console.log(`🛒 장바구니에 추가됨: ${book.TITLE}`);
                    
                    addToCart(book);
                  }}
                  disabled={book.AVAILABLE !== "대여 가능"}
                  style={{ marginRight: '10px' }}
                >
                  {cart.some((item) => item.CTRLNO === book.CTRLNO) ? '장바구니에 있음' : '장바구니 추가'}
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => navigate(`/book/${book.CTRLNO}`)}
                >
                  상세보기
                </button>
              </div>
              <span
                style={{
                  color: book.AVAILABLE === "대여 가능" ? "green" : "red",
                }}
              >
                {book.AVAILABLE}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => changePageGroup("prev")}
          disabled={currentPageGroup === 0}
          style={{ marginRight: "5px" }}
        >
          이전
        </button>
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`page-btn ${currentPage === pageNumber ? "active" : ""}`}
            onClick={() => changePage(pageNumber)}
            style={{ marginRight: "5px" }}
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="page-btn"
          onClick={() => changePageGroup("next")}
          disabled={currentPageGroup >= totalGroups - 1}
          style={{ marginRight: "5px" }}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ShowList;
