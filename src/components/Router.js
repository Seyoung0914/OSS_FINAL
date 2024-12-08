import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ShowList from './Pages/ShowList.js';
import CartList from './Pages/CartList.js';
import Detail from './Pages/Detail.js';
import RentalList from './Pages/RentalList.js';
import axios from 'axios';

const Router = () => {
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [rentalList, setRentalList] = useState([]); // 대여 목록 상태
  const [availableBooks, setAvailableBooks] = useState([]); // 대여 가능 도서 상태

  // 초기 도서 목록을 받아오는 API 호출
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books');
        const books = response.data; // 예시로 API에서 받아오는 데이터

        setAvailableBooks(books); // 처음 로드된 도서를 대여 가능 도서로 설정
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // 장바구니에 도서 추가
  const addToCart = (book) => {
    if (!cart.some((item) => item.CTRLNO === book.CTRLNO)) {
      setCart([...cart, book]);

      // 대여 중 도서로 상태 변경 (대여 가능 -> 대여 중)
      setAvailableBooks((prevBooks) =>
        prevBooks.map((item) =>
          item.CTRLNO === book.CTRLNO ? { ...item, AVAILABLE: '대여 중' } : item
        )
      );
    } else {
      alert('이미 장바구니에 추가된 도서입니다.');
    }
  };

  // 장바구니에서 도서 제거
  const removeFromCart = (ctrlNo) => {
    setCart(cart.filter((item) => item.CTRLNO !== ctrlNo));
  };

  // 대여리스트에서 반납하기
  const handleReturnBook = (book) => {
    // 반납 시, 대여리스트에서 해당 도서 제거
    setRentalList(rentalList.filter((item) => item.CTRLNO !== book.CTRLNO));

    // 대여 가능 도서로 복원
    setAvailableBooks((prevBooks) =>
      prevBooks.map((item) =>
        item.CTRLNO === book.CTRLNO ? { ...item, AVAILABLE: '대여 가능' } : item
      )
    );
  };

  // 장바구니의 모든 도서를 대여 목록에 추가
  const checkout = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어 있습니다.');
      return;
    }

    setRentalList([...rentalList, ...cart]); // 대여 목록에 도서 추가
    setCart([]); // 장바구니 초기화
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={<ShowList cart={cart} addToCart={addToCart} availableBooks={availableBooks} />}
        />
        <Route
          path="/cart"
          element={<CartList cart={cart} removeFromCart={removeFromCart} checkout={checkout} />}
        />
        <Route path="/book/:CTRLNO" element={<Detail />} />
        <Route
          path="/rental"
          element={<RentalList rentalList={rentalList} handleReturnBook={handleReturnBook} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
