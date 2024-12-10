import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ShowList from "./Pages/ShowList.js";
import CartList from "./Pages/CartList.js";
import Detail from "./Pages/Detail.js";
import RentalList from "./Pages/RentalList.js";

const Router = () => {
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [rentalList, setRentalList] = useState([]); // 대여 목록 상태
  const [availableBooks, setAvailableBooks] = useState([]); // 대여 가능 도서 상태

  // API에서 도서 목록을 받아오는 함수
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books"); // 실제 API 엔드포인트로 변경해야 함
        const data = await response.json();

        // API로 받은 데이터를 대여 가능 도서 목록으로 설정
        setAvailableBooks(
          data.map((book) => ({
            ...book,
            AVAILABLE: "대여 가능", // 대여 상태는 클라이언트에서 관리
          }))
        );
      } catch (error) {
        console.error("도서 목록을 가져오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchBooks();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 장바구니에 도서 추가하는 함수
  const addToCart = (book) => {
    if (!cart.some((item) => item.CTRLNO === book.CTRLNO)) {
      setCart([...cart, book]);

      // 도서 상태 변경: '대여 가능' -> '대여 중'
      setAvailableBooks((prevBooks) =>
        prevBooks.map((item) =>
          item.CTRLNO === book.CTRLNO ? { ...item, AVAILABLE: "대여 중" } : item
        )
      );
    } else {
      alert("이 도서는 이미 장바구니에 추가되어 있습니다.");
    }
  };

  // 장바구니에서 도서 삭제하는 함수
  const removeFromCart = (ctrlNo) => {
    setCart(cart.filter((item) => item.CTRLNO !== ctrlNo));
  };

  // 대여 리스트에서 반납하기
  const handleReturnBook = (book) => {
    // 대여 목록에서 해당 도서 제거
    setRentalList(rentalList.filter((item) => item.CTRLNO !== book.CTRLNO));

    // 상태 업데이트: '대여 중' -> '대여 가능'
    setAvailableBooks((prevBooks) =>
      prevBooks.map((item) =>
        item.CTRLNO === book.CTRLNO ? { ...item, AVAILABLE: "대여 가능" } : item
      )
    );
  };

  // 장바구니 전체 대여 완료
  const checkout = () => {
    if (cart.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    // 장바구니의 모든 도서를 대여 목록에 추가하고, 해당 도서를 '대여 중'으로 변경
    setRentalList([...rentalList, ...cart]);
    setCart([]); // 장바구니 초기화
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <ShowList
              cart={cart}
              addToCart={addToCart}
              availableBooks={availableBooks}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartList
              cart={cart}
              removeFromCart={removeFromCart}
              checkout={checkout}
            />
          }
        />
        <Route
          path="/book/:CTRLNO"
          element={<Detail cart={cart} addToCart={addToCart} />} // 여기 수정
        />
        <Route
          path="/rental"
          element={
            <RentalList rentalList={rentalList} handleReturnBook={handleReturnBook} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
