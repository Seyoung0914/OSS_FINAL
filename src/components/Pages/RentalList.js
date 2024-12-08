import React from 'react';
import { useNavigate } from 'react-router-dom';

const RentalList = ({ rentalList = [], removeFromRentalList = () => {}, setAvailableBooks = () => {} }) => {
  const navigate = useNavigate();

  const handleReturn = (book) => {
    // 반납 시, 대여 목록에서 제거
    removeFromRentalList(book.CTRLNO); // 대여 목록에서 해당 도서를 제거하는 함수

    // 대여 가능 도서 목록에서 해당 도서를 '대여 가능' 상태로 변경
    setAvailableBooks(prevBooks =>
      prevBooks.map(item =>
        item.CTRLNO === book.CTRLNO ? { ...item, AVAILABLE: "대여 가능" } : item
      )
    );

    alert(`${book.TITLE} 도서가 반납되었습니다.`);
  };

  if (rentalList.length === 0) {
    return (
      <div className="container">
        <h1>대여 리스트</h1>
        <p>대여한 도서가 없습니다.</p>
        <button className="btn btn-primary" onClick={() => navigate('/home')} style={{ marginTop: '20px' }}>
          도서 리스트로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>대여 리스트</h1>

      <div id="rental-list" style={{ marginTop: '20px' }}>
        {rentalList.map((book) => (
          <div
            key={book.CTRLNO}
            className="rental-item"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #ccc',
              padding: '10px 0',
            }}
          >
            <div>
              <strong>{book.TITLE}</strong>
              <p>{`${book.AUTHOR} / ${book.PUBLER}`}</p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: 'green', // 대여 중 도서 표시
                }}
              >
                대여 중
              </span>
              <button
                className="btn btn-danger"
                onClick={() => handleReturn(book)} // 반납하기 버튼 클릭 시
                style={{ marginTop: '10px' }}
              >
                반납하기
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rental-actions" style={{ marginTop: '20px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>
          도서 리스트로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default RentalList;
