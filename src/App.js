import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './components/Router';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]); // OpenAPI로 받아온 책 데이터 저장
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://67582f9d60576a194d0f3f84.mockapi.io/book');
        const bookArray = response.data.map((book) => ({
          ...book,
          loan_available: book.loan_available === 'Y' ? '대여 가능' : '대여 중', // 상태 표시 변경
        }));
        console.log('📚 API로부터 받은 책 데이터:', bookArray); // 디버깅용 console.log
        setBooks(bookArray);
      } catch (error) {
        console.error('🚨 API 요청 중 오류 발생:', error);
      } finally {
        setLoading(false); // 로딩 완료 후 상태 변경
      }
    };

    fetchBooks();
  }, []);

  const addToCart = (book) => {
    if (!cart.some((item) => item.control_number === book.control_number)) {
      setCart([...cart, book]);
    } else {
      alert('이 도서는 이미 장바구니에 추가되어 있습니다.');
    }
  };

  const removeFromCart = (ctrlNo) => {
    setCart(cart.filter((item) => item.control_number !== ctrlNo));
  };

  const checkout = (cartBooks) => {
    console.log('🛒 장바구니의 도서 목록 (체크아웃 이전):', cartBooks);

    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        cartBooks.some((cartBook) => cartBook.control_number === book.control_number)
          ? { ...book, loan_available: '대여 중' } // 대여 중으로 변경
          : book
      )
    );

    setCart([]);

    alert('대여가 완료되었습니다.');
  };

  const returnBook = (control_number) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.control_number === control_number
          ? { ...book, loan_available: '대여 가능' } // 대여 가능으로 복원
          : book
      )
    );
  };

  return (
    <BrowserRouter>
      <Router 
        books={books} 
        setBooks={setBooks} 
        cart={cart} 
        addToCart={addToCart} 
        removeFromCart={removeFromCart} 
        checkout={checkout} 
        returnBook={returnBook} 
        loading={loading} 
      />
    </BrowserRouter>
  );
}

export default App;
