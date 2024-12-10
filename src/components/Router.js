import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ShowList from "./Pages/ShowList.js";
import CartList from "./Pages/CartList.js";
import Detail from "./Pages/Detail.js";
import RentalList from "./Pages/RentalList.js";
import axios from "axios";

const Router = () => {
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [rentalList, setRentalList] = useState([]); // 대여 목록 상태
  const [books, setBooks] = useState([]); // ShowList의 전체 도서 상태

  const apiUrl = "https://67582f9d60576a194d0f3f84.mockapi.io/book";

  // 📘 모든 도서 데이터를 Fetch
  const fetchBooks = async () => {
    const response = await axios.get(`${apiUrl}?limit=100`);
    const bookArray = response.data.map((book) => ({
      ...book,
      loan_available: book.loan_available === "Y" ? "대여 가능" : "대여 중",
    }));
    setBooks(bookArray);
  };

  // 📘 초기 데이터 로드
  React.useEffect(() => {
    fetchBooks();
  }, []);

  // 장바구니에 도서 추가
  const addToCart = (book) => {
    if (!cart.some((item) => item.control_number === book.control_number)) {
      setCart([...cart, book]);
    } else {
      alert("이 도서는 이미 장바구니에 추가되어 있습니다.");
    }
  };

  // 장바구니에서 도서 삭제
  const removeFromCart = (control_number) => {
    setCart(cart.filter((item) => item.control_number !== control_number));
  };

  // 장바구니에서 대여하기
  const checkout = async () => {
    if (cart.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    // API 업데이트: loan_available 값을 "N"으로 변경
    const updatedBooks = await Promise.all(
      cart.map(async (book) => {
        await axios.put(`${apiUrl}/${book.id}`, { loan_available: "N" });
        return { ...book, loan_available: "대여 중" };
      })
    );

    // 상태 업데이트
    setBooks(
      books.map((book) =>
        updatedBooks.some((updated) => updated.control_number === book.control_number)
          ? { ...book, loan_available: "대여 중" }
          : book
      )
    );

    setRentalList([...rentalList, ...cart]); // 대여 목록에 추가
    setCart([]); // 장바구니 초기화
  };

  // 대여 리스트에서 반납하기
  const handleReturnBook = async (book) => {
    // API 업데이트: loan_available 값을 "Y"로 변경
    await axios.put(`${apiUrl}/${book.id}`, { loan_available: "Y" });

    // 상태 업데이트
    setBooks(
      books.map((item) =>
        item.control_number === book.control_number
          ? { ...item, loan_available: "대여 가능" }
          : item
      )
    );

    setRentalList(rentalList.filter((item) => item.control_number !== book.control_number));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />
        <Route
          path="/home"
          element={<ShowList books={books} cart={cart} addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={<CartList cart={cart} removeFromCart={removeFromCart} checkout={checkout} />}
        />
        <Route
          path="/book/:control_number"
          element={<Detail books={books} cart={cart} addToCart={addToCart} />}
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
