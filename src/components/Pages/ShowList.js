import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShowList = ({ cart = [], addToCart = () => {}, rentalList = [] }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('title');
  const [sortType, setSortType] = useState('');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 10;

  const apiUrl = 'https://67582f9d60576a194d0f3f84.mockapi.io/book';

  useEffect(() => {
    console.log('ShowList page loaded');
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${apiUrl}?limit=100`);
        const bookArray = response.data.map((book) => ({
          ...book,
          loan_available: book.loan_available === 'Y' ? '대여 가능' : '대여 중', // 상태 표시 변경
        }));

        const updatedBooks = bookArray.map((book) => {
          if (rentalList.some((rentalBook) => rentalBook.CTRLNO === book.CTRLNO)) {
            return { ...book, loan_available: '대여 중' };
          }
          return book;
        });

        setBooks(bookArray);
        setFilteredBooks(bookArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('데이터를 가져오는데 실패했습니다. 페이지를 다시 열어주세요.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  /*정렬 수정 부분 시작*/
  useEffect(() => {
    if (!books || books.length === 0) return;

    let updatedBooks = [...books];

    if (searchKeyword) {
      updatedBooks = updatedBooks.filter((book) =>
        book[filterType]?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (showAvailableOnly) {
      updatedBooks = updatedBooks.filter((book) => book.loan_available === '대여 가능');
    }

    if (languageFilter !== 'ALL') {
      updatedBooks = updatedBooks.filter((book) => book.language === languageFilter);
    }

    if (sortType === 'title_asc') {
      updatedBooks = updatedBooks.sort((a, b) => a.title.localeCompare(b.title, 'ko', { sensitivity: 'base' }));
    } else if (sortType === 'control_number_asc') {
      updatedBooks = updatedBooks.sort((a, b) => parseInt(a.control_number, 10) - parseInt(b.control_number, 10));
    } else if (sortType === 'publication_year_asc') {
      updatedBooks = updatedBooks.sort((a, b) => a.publication_year - b.publication_year);
    }

    const uniqueBooks = [];
    const seenControlNumbers = new Set();
    updatedBooks.forEach((book) => {
      if (!seenControlNumbers.has(book.control_number)) {
        seenControlNumbers.add(book.control_number);
        uniqueBooks.push(book);
      }
    });

    setFilteredBooks((prev) => {
      const isSame = JSON.stringify(prev) === JSON.stringify(uniqueBooks);
      return isSame ? prev : uniqueBooks;
    });

    setCurrentPage(1);
  }, [books, searchKeyword, filterType, showAvailableOnly, languageFilter, sortType]);
  /*정렬 수정 부분 끝*/

  const displayedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  const startPage = 1;
  const endPage = totalPages;

  if (loading) return <p>데이터를 불러오는 중입니다...</p>;
  if (error) return <p>오류 발생: {error}</p>;

  return (
    <div className="container">
      <h1>도서 리스트</h1>

      {/* 오른쪽 상단에 장바구니 리스트 이동, 대여 리스트 이동 버튼 추가 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary ms-2" onClick={() => navigate('/cart')}>
          장바구니 보기
        </button>
        <button className="btn btn-secondary ms-2" onClick={() => navigate('/rental')}>
          대여 리스트 보기
        </button>
      </div>

      <div
        className="filters"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
          <select onChange={(e) => setSortType(e.target.value)} value={sortType} style={{ marginLeft: '10px' }}>
            <option value="">정렬 없음</option>
            <option value="title_asc">책 제목 가나다순</option>
            <option value="control_number_asc">자료 코드순</option>
            <option value="publication_year_asc">출판 연도순</option>
          </select>
          <select
            onChange={(e) => setLanguageFilter(e.target.value)}
            value={languageFilter}
            style={{ marginLeft: '10px' }}
          >
            <option value="ALL">모든 언어</option>
            <option value="한국어">한국어</option>
            <option value="영어">영어</option>
          </select>
          <label style={{ marginLeft: '10px' }}>
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
            />
            대여 가능 도서만 보기
          </label>
        </div>
      </div>

      <div id="data-list" style={{ marginTop: '20px' }}>
        {displayedBooks.map((book) => (
          <div
            key={book.control_number}
            className="book-item"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #ccc',
              padding: '10px 0',
            }}
          >
            <div>
              <strong>{book.title}</strong>
              <p>{`${book.author} / ${book.publisher}`}</p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <button
                  className="btn btn-warning"
                  onClick={() => addToCart(book)}
                  disabled={cart.some((item) => item.control_number === book.control_number)}
                  style={{ marginRight: '10px' }}
                >
                  {cart.some((item) => item.control_number === book.control_number)
                    ? '장바구니에 있음'
                    : '장바구니 추가'}
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => navigate(`/book/${book.control_number}`)} // control_number로 경로 이동
                >
                  상세보기
                </button>
              </div>
              <span
                style={{
                  color: book.loan_available === '대여 가능' ? 'green' : 'red',
                }}
              >
                {console.log('📘 Title: ${book.title}, Loan Available: ${book.loan_avilable')}
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
            className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => changePage(pageNumber)}
            style={{
              marginRight: '5px',
              backgroundColor: currentPage === pageNumber ? '#007bff' : '', // 선택된 페이지는 파란색으로 표시
              opacity: currentPage === pageNumber ? 1 : 0.7, // 선택된 페이지만 투명도 1
            }}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShowList;
