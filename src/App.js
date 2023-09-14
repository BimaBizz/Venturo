import logo from './logo.svg';
import './App.css';
import Menu from './component/menu';
import { useState, useEffect } from 'react';

function App() {
  const [cartItems , setCartItems] = useState([]);
  const [pesanan, setPesanan] = useState({
    nominal_diskon: '0', 
    nominal_pesanan: '0', 
    items: [], 
  });

  const addToCart = (item) => {
    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...item, quantity: 1 });
    }
    setCartItems(updatedCart);
  
    setPesanan((prevPesanan) => ({
      ...prevPesanan,
      items: updatedCart.map((cartItem) => ({
        id: cartItem.id,
        harga: cartItem.harga,
        catatan: '',
      })),
    }));
  };

  return (
      <div className='bg-slate-100 h-min-screen w-full font-pop'>
        <Menu addToCart={addToCart}/>
      </div>

  );
}

export default App;
