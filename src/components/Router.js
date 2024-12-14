import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ShowList from './Pages/ShowList.js';
import CartList from './Pages/CartList.js';
import Detail from './Pages/Detail.js';
import RentalList from './Pages/RentalList.js';
import axios from 'axios';

const Router = () => {
  const [books, setBooks] = useState([]); 
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://67582f9d60576a194d0f3f84.mockapi.io/book');
        const bookArray = response.data.map((book) => ({
          ...book,
          loan_available: book.loan_available === 'Y' ? '대여 가능' : '대여 중', 
        }));
        console.log(' API로부터 받은 책 데이터:', bookArray); 
        setBooks(bookArray);
      } catch (error) {
        console.error(' API 요청 중 오류 발생:', error);
      } finally {
        setLoading(false); 
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
          ? { ...book, loan_available: '대여 중' } 
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
          ? { ...book, loan_available: '대여 가능' } 
          : book
      )
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={<ShowList books={books} setBooks={setBooks} cart={cart} addToCart={addToCart} loading={loading} />}
        />
        <Route path="/cart" element={<CartList cart={cart} removeFromCart={removeFromCart} checkout={checkout} />} />
        <Route path="/book/:control_number" element={<Detail cart={cart} addToCart={addToCart} />} />
        <Route path="/rental" element={<RentalList books={books} setBooks={setBooks} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;