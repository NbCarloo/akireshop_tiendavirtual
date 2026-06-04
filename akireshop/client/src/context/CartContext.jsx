import { createContext, useContext, useReducer, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'akire_cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.productId}-${action.item.color}-${action.item.size}`;
      const existing = state.find(i => i.key === key);
      if (existing) {
        return state.map(i => i.key === key ? { ...i, qty: i.qty + action.item.qty } : i);
      }
      return [...state, { ...action.item, key }];
    }
    case 'REMOVE':
      return state.filter(i => i.key !== action.key);
    case 'UPDATE_QTY':
      return state.map(i => i.key === action.key ? { ...i, qty: action.qty } : i);
    case 'CLEAR':
      return [];
    case 'LOAD':
      return action.items;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (saved.length) dispatch({ type: 'LOAD', items: saved });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => dispatch({ type: 'ADD', item });
  const removeItem = (key) => dispatch({ type: 'REMOVE', key });
  const updateQty = (key, qty) => dispatch({ type: 'UPDATE_QTY', key, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
