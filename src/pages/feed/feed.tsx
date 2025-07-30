import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getOrdersData,
  getLoadingStatus,
  getFeeds,
  getTotal,
  getTotalToday
} from '../../services/slices/feedsSlice';
import {
  selectIngredients,
  selectIsLoading as selectIngredientsLoading,
  loadIngredients
} from '../../services/slices/ingredientsSlice';
import { useFeedSocket } from '../../hooks/useFeedSocket';

export const Feed: FC = () => {
  useFeedSocket();

  const dispatch = useAppDispatch();
  const orders = useAppSelector(getOrdersData);
  const isLoading = useAppSelector(getLoadingStatus);
  const total = useAppSelector(getTotal);
  const totalToday = useAppSelector(getTotalToday);
  const ingredients = useAppSelector(selectIngredients);
  const ingredientsLoading = useAppSelector(selectIngredientsLoading);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  useEffect(() => {
    if (ingredients.length === 0 && !ingredientsLoading) {
      dispatch(loadIngredients());
    }
  }, [dispatch, ingredients.length, ingredientsLoading]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h3>Лента заказов</h3>
        <p>Пока нет заказов для отображения</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          DEBUG: orders={orders?.length || 0}, total={total}, totalToday=
          {totalToday}
        </p>
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
