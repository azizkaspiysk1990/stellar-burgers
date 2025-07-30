import { useEffect } from 'react';
import { useAppDispatch } from '../services/store';
import { fetchUserOrders } from '../services/slices/userSlice';
import { getCookie } from '../utils/cookie';

export const useUserOrdersSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getCookie('accessToken');

    if (!token) {
      return;
    }

    const ws = new WebSocket(
      `wss://norma.nomoreparties.space/orders?token=${token}`
    );

    ws.onopen = () => {};

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.success && data.orders) {
          dispatch(fetchUserOrders());
        }
      } catch (e) {}
    };

    ws.onerror = (error) => {};

    ws.onclose = () => {};

    return () => {
      ws.close();
    };
  }, [dispatch]);
};
