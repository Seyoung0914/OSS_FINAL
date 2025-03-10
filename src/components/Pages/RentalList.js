import React from 'react';
import { useNavigate } from 'react-router-dom';

const RentalList = ({ rentalList = [], returnBook }) => {
  const navigate = useNavigate();

  const handleReturn = (control_number) => {
    returnBook(control_number); // 반납 함수 호출
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
            key={book.control_number}
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
              <strong>{book.title}</strong>
              <p>{`${book.author} / ${book.publisher}`}</p>
              <p>
                {book.loan_available ? (
                  <span style={{ color: 'green' }}>대여 가능</span>
                ) : (
                  <span style={{ color: 'red' }}>대여 중</span>
                )}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {book.loan_available ? (
                <button
                  className="btn btn-danger"
                  onClick={() => handleReturn(book.control_number)}
                  style={{ marginTop: '10px' }}
                >
                  반납하기
                </button>
              ) : (
                <p>대여 중</p>
              )}
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
