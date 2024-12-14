import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShowList from './Pages/ShowList';
import CartList from './Pages/CartList';
import Detail from './Pages/Detail';
import RentalList from './Pages/RentalList';

const Router = ({ books, setBooks, cart, addToCart, removeFromCart, checkout, returnBook, loading }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route 
        path="/home" 
        element={
          <ShowList 
            books={books} 
            setBooks={setBooks} 
            cart={cart} 
            addToCart={addToCart} 
            loading={loading} 
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
        path="/book/:control_number" 
        element={
          <Detail 
            cart={cart} 
            addToCart={addToCart} 
          />
        } 
      />
      <Route 
        path="/rental" 
        element={
          <RentalList 
            books={books} 
            setBooks={setBooks} 
          />
        } 
      />
    </Routes>
  );
};

export default Router;
