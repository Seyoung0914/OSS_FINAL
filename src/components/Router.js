import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ShowList from "./Pages/ShowList.js";
import CartList from "./Pages/CartList.js";
import Detail from "./Pages/Detail.js";
import RentalList from "./Pages/RentalList.js";

const Router = () => {
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [rentalList, setRentalList] = useState([]); // 대여 목록 상태

  // 장바구니에 도서 추가하는 함수
  const addToCart = (book) => {
    if (!cart.some((item) => item.control_number === book.control_number)) {
      setCart([...cart, book]);
    } else {
      alert("이 도서는 이미 장바구니에 추가되어 있습니다.");
    }
  };

  // 장바구니에서 도서 삭제하는 함수
  const removeFromCart = (control_number) => {
    setCart(cart.filter((item) => item.control_number !== control_number));
  };

  // 대여 리스트에서 반납하기
  const handleReturnBook = (book) => {
    setRentalList(rentalList.filter((item) => item.control_number !== book.control_number));
  };

  // 장바구니 전체 대여 완료
  const checkout = () => {
    if (cart.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }
    setRentalList([...rentalList, ...cart]);
    setCart([]); // 장바구니 초기화
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route 
          path="/home" 
          element={<ShowList cart={cart} addToCart={addToCart} />} 
        />
        <Route 
          path="/cart" 
          element={<CartList cart={cart} removeFromCart={removeFromCart} checkout={checkout} />} 
        />
        <Route 
          path="/book/:control_number" // 📘 control_number로 경로 수정
          element={<Detail cart={cart} addToCart={addToCart} />} 
        />
        <Route 
          path="/rental" 
          element={<RentalList rentalList={rentalList} handleReturnBook={handleReturnBook} />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
