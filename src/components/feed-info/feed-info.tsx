import { FC } from 'react';
import { FeedInfoUI } from '../ui/feed-info';
import { useAppSelector } from '../../services/store';
import {
  getOrdersData,
  getTotal,
  getTotalToday
} from '../../services/slices/feedsSlice';
import { RootState } from '../../services/store';
import { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useAppSelector((state: RootState) => getOrdersData(state));
  const total = useAppSelector((state: RootState) => getTotal(state));
  const totalToday = useAppSelector((state: RootState) => getTotalToday(state));

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
