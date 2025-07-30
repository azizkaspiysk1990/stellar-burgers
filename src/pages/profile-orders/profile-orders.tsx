import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserOrders,
  getUserOrders,
  getLoadingStatus,
  getError,
  getUser,
  getAuthCheckedStatus
} from '../../services/slices/userSlice';
import {
  selectIngredients,
  selectIsLoading as selectIngredientsLoading,
  loadIngredients
} from '../../services/slices/ingredientsSlice';
import { useUserOrdersSocket } from '../../hooks/useUserOrdersSocket';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orders: TOrder[] = useAppSelector(getUserOrders);
  const isLoading = useAppSelector(getLoadingStatus);
  const error = useAppSelector(getError);
  const ingredients = useAppSelector(selectIngredients);
  const ingredientsLoading = useAppSelector(selectIngredientsLoading);
  const user = useAppSelector(getUser);
  const isAuthChecked = useAppSelector(getAuthCheckedStatus);

  useUserOrdersSocket();

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    if (ingredients.length === 0 && !ingredientsLoading) {
      dispatch(loadIngredients());
    }
  }, [dispatch, ingredients.length, ingredientsLoading]);

  useEffect(() => {
    if (
      error &&
      (error.includes('403') ||
        error.includes('401') ||
        error.includes('jwt expired'))
    ) {
      navigate('/login', { state: { from: '/profile/orders' } });
    }
  }, [error, navigate]);

  if (!isAuthChecked) {
    return <div>Проверка авторизации...</div>;
  }

  if (!user) {
    return (
      <div>
        <div>Пожалуйста, войдите в систему для просмотра заказов</div>
        <button onClick={() => navigate('/login')}>Войти в систему</button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Загрузка заказов...</div>;
  }

  if (error) {
    return (
      <div>
        <div>Ошибка загрузки заказов: {error}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          DEBUG: user={user ? 'exists' : 'null'}, isAuthChecked={isAuthChecked},
          isLoading={isLoading}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return <div>У вас пока нет заказов</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
