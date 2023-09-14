import React, { useEffect, useState } from 'react';
import { FiBox, FiShoppingCart, FiPlus, FiPercent, FiMinus } from 'react-icons/fi';

const Menu = ({ addToCart }) => {
  const [menuData, setMenuData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [voucherValue, setVoucherValue] = useState(null);
  const [totalHarga, setTotalHarga] = useState(0);
  const [totalAhir, setTotalAhir] = useState(0);
  const [pesanan, setPesanan] = useState({
    nominal_diskon: '0', 
    nominal_pesanan: '0', 
    items: [], 
  });


  const handleBuatPesanan = async () => {
    try {
      const nominalDiskon = voucherValue || 0;
      const nominalPesanan = totalHarga;
      const dataPesanan = {
        nominal_diskon: nominalDiskon.toString(),
        nominal_pesanan: nominalPesanan.toString(),
        items: pesanan.items.map((item) => ({
          id: item.id.toString(),
          harga: item.harga.toString(),
          catatan: item.catatan || '',
        })),
      };

      const response = await fetch('https://tes-mobile.landa.id/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPesanan),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      alert('Pesanan berhasil dibuat!');
  
      setCartItems([]);
      setTotalHarga(0);

      setPesanan({
        nominal_diskon: '0',
        nominal_pesanan: '0',
        items: [],
      });
    } catch (error) {
      console.error('Error membuat pesanan:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://tes-mobile.landa.id/api/menus');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();
        setMenuData(jsonData.datas);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const increaseQuantity = (item) => {
    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    }
    setCartItems(updatedCart);

    setTotalHarga(totalHarga + item.harga);
  };
  
  const decreaseQuantity = (item) => {
    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find((cartItem) => cartItem.id === item.id);
  
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else if (existingItem && existingItem.quantity === 1) {

      const index = updatedCart.indexOf(existingItem);
      updatedCart.splice(index, 1);
    }
    setCartItems(updatedCart);

    setTotalHarga(totalHarga - item.harga);
  };

  const fetchVoucher = async (kode) => {
    try {
      const response = await fetch(`https://tes-mobile.landa.id/api/vouchers?kode=${kode}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();

      if (jsonData.status_code === 200 && jsonData.datas.length > 0) {
        setVoucherValue(jsonData.datas[0].nominal);
      } else {
        setVoucherValue(null);
      }
    } catch (error) {
      console.error('Error fetching voucher:', error);
    }
  };

  

  return (
    <div>
      <div className="flex w-full justify-between p-3">
        <h1 className="flex items-center text-lg p-2">
          <span className="text-blue-400 mr-3">
            <FiBox />
          </span>{' '}
          Main Course
        </h1>
        <button
          className="flex items-center text-lg p-2 border border-blue-400 hover:bg-white rounded-md"
          onClick={toggleCart}
        >
          <span className="text-blue-400 mr-3">
            <FiShoppingCart />
          </span>{' '}
          Keranjang
        </button>
      </div>
      {showCart && (
        <div className='relative'>
            <div className="absolute backdrop-blur-sm w-screen h-screen">
                <div className="absolute w-1/2 h-full right-0 bg-white p-4 shadow-md overflow-scroll">
                <h2 className="text-lg font-semibold mb-3">Keranjang Belanja</h2>
                <ul>
                    {cartItems.map((item) => (
                    <li key={item.id} className='grid'>
                        <div className='flex'>
                            <div class="bg-cover bg-center w-16 h-16 border rounded-md shadow-md mr-2" style={{ backgroundImage: `url(${item.gambar})` }}></div>
                            <div className='grid w-full'>
                                <h1 className='text-base font-semibold'>{item.nama}</h1>
                                <h1 className='text-sm text-blue-400'>Rp.{item.harga}</h1>
                                <h1 className='text-sm text-slate-400 font-light'>{item.tipe}</h1>
                            </div>
                                <div className='flex items-center justify-center'>
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded mx-2"
                                    onClick={() => decreaseQuantity(item)}
                                    >
                                    <FiMinus />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        className="border rounded p-1 mx-2 w-16"
                                        value={item.quantity}
                                        onChange={(e) => {
                                        const quantity = parseInt(e.target.value, 10) || 1;
                                        item.quantity = quantity;
                                        }}
                                    />
                                    <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                    onClick={() => increaseQuantity(item)}
                                    >
                                    <FiPlus/>
                                    </button>
                                </div>
                        </div>
                        <input type='text' className='w-full mt-2 p-2' placeholder='Masukan Catatan Anda...'/>
                    </li>
                    ))}
                </ul>
                    <hr className='mb-3'/>
                    <h1 className='w-full flex items-center mb-3 '><span className='text-blue-400 mr-3'><FiPercent/></span>Voucer</h1>
                    <input placeholder='Masukan Voucer kemudian hapus' className='p-2 w-full' onChange={(e) => fetchVoucher(e.target.value)}/>
                    {voucherValue !== null && (
                    <div className="p-4">
                        <p>Anda mendapatkan voucher bernilai {voucherValue}.</p>
                    </div>
                    )}
                    <div className="flex justify-between">
                        <p>Total Harga:</p>
                        <p>Rp. {totalHarga - voucherValue}</p>
                    </div>
                    <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
                    onClick={handleBuatPesanan}
                    >
                    Buat Pesanan
                    </button>
                </div>
            </div>
        </div>
      )}
      <div className='h-auto w-full grid grid-cols-4'>
        {menuData.map((item) => (
        <div key={item.id} className="h-1/2 m-2 rounded-lg overflow-hidden shadow-lg bg-white">
                <div className="h-1/2 w-full overflow-hidden items-center flex">
                   <img src={item.gambar} alt={item.nama} className="p-3 object-scale-down h-full w-full" /> 
                </div>
                    <div className="px-6 py-4">
                        <div className="font-bold text-md mb-2">{item.nama}</div>
                        <p className="text-blue-400 text-base">Rp.{item.harga}</p>
                    </div>
                    <div className="flex w-full justify-center px-2">
                        <button
                            className="bg-blue-400 w-full text-white px-4 py-2 rounded hover:bg-blue-600 flex justify-center items-center"
                            onClick={() => {addToCart(item);
                                setCartItems([...cartItems, item]);
                            }}
                            >
                            <span className="mr-2"><FiPlus/></span> Tambah ke Keranjang
                        </button>
                    </div>
                </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
