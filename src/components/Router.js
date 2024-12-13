import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ShowList from './Pages/ShowList.js';
import CartList from './Pages/CartList.js';
import Detail from './Pages/Detail.js';
import RentalList from './Pages/RentalList.js';

const Router = () => {
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [rentalList, setRentalList] = useState([]); // 대여 목록 상태

  const returnBook = (control_number) => {
    // 반납 시 대여 목록에서 해당 도서를 삭제하고,
    // 그 도서의 loan_available을 "Y"로 바꿔서 "대여 가능" 상태로 설정
    const updatedRentalList = rentalList.filter((book) => book.control_number !== control_number);

    setRentalList(updatedRentalList);
    alert('도서가 반납되었습니다.'); // #2 대여중 작업 : 반납 알림 추가

    // 대여 목록에서 삭제된 도서의 loan_available을 "Y"로 변경하여 "대여 가능"으로 복원
    const updatedBooks = rentalList.map((book) => {
      if (book.control_number === control_number) {
        return { ...book, loan_available: 'Y' }; // 대여 가능으로 복원
      }
      return book;
    });

    // 새로운 상태를 반영
    setRentalList(updatedBooks);

    alert('도서가 반납되었습니다.');
  };

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

    const updatedRentalList = cartBooks.map((book) => ({
      ...book,
      loan_available: 'N',
    }));
    console.log(
      `📘 도서 제목: ${book.title}, 이전 상태: ${book.loan_available}, 변경 후 상태: ${updatedBook.loan_available}`
    );

    setRentalList([...rentalList, ...updatedRentalList]);

    console.log('📋 대여 상태가 변경된 도서 목록 (체크아웃 이후):', updatedRentalList);

    setCart([]);

    alert('대여가 완료되었습니다.');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<ShowList cart={cart} addToCart={addToCart} rentalList={rentalList} />} />
        <Route path="/cart" element={<CartList cart={cart} removeFromCart={removeFromCart} checkout={checkout} />} />
        <Route path="/book/:control_number" element={<Detail cart={cart} addToCart={addToCart} />} />
        <Route path="/rental" element={<RentalList rentalList={rentalList} returnBook={returnBook} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
