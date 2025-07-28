import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useAppSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // Получаем детали ингредиентов заказа
    const ingredientsInfo = order.ingredients.reduce<TIngredient[]>((acc, itemId) => {
      const ingredient = ingredients.find((ing) => ing._id === itemId);
      if (ingredient) acc.push(ingredient);
      return acc;
    }, []);

    // Считаем общую стоимость заказа
    const total = ingredientsInfo.reduce((sum, ingredient) => sum + ingredient.price, 0);

    // Берём до maxIngredients ингредиентов для показа
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Считаем сколько ингредиентов скрыто
    const remains = Math.max(0, ingredientsInfo.length - maxIngredients);

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date,
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
