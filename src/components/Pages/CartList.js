import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartList = ({ cart = [], removeFromCart = () => {}, checkout = () => {} }) => {
  const navigate = useNavigate();

  const handleRemove = (ctrlNo) => {
    removeFromCart(ctrlNo);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('장바구니에 도서가 없습니다.');
      return;
    }
    checkout();
    alert('대여가 완료되었습니다.');
    navigate('/home');
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <h1>장바구니</h1>
        <p>장바구니에 도서가 없습니다.</p>
        <button className="btn btn-primary" onClick={() => navigate('/home')} style={{ marginTop: '20px' }}>
          도서 리스트로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>장바구니</h1>

      <div id="cart-list" style={{ marginTop: '20px' }}>
        {cart.map((book) => (
          <div
            key={book.CTRLNO}
            className="cart-item"
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
              <button
                className="btn btn-danger"
                onClick={() => handleRemove(book.CTRLNO)}
                style={{ marginBottom: '10px' }}
              >
                삭제
              </button>
              <span
                style={{
                  color: book.AVAILABLE === '대여 가능' ? 'green' : 'red',
                }}
              >
                {book.AVAILABLE}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-actions" style={{ marginTop: '20px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/home')} style={{ marginRight: '10px' }}>
          도서 리스트로 돌아가기
        </button>
        <button className="btn btn-success" onClick={handleCheckout}>
          대여하기
        </button>
      </div>
    </div>
  );
};

export default CartList;
