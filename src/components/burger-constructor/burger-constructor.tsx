import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  submitOrder,
  clearOrder,
  selectOrderLoading,
  selectOrderData
} from '../../services/slices/orderSlice';
import { getUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { clearConstructor } from '../../services/slices/burgerConstructor';

export const BurgerConstructor: FC = () => {
  const constructorItems = useAppSelector((state) => state.burgerConstructor);
  const orderRequest = useAppSelector(selectOrderLoading);
  const orderModalData = useAppSelector(selectOrderData);
  const user = useAppSelector(getUser);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onOrderClick = () => {
    if (!constructorItems.selectedBun) {
      return;
    }
    if (constructorItems.items.length === 0) {
      return;
    }
    if (orderRequest) {
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }
    const orderData: string[] = [
      constructorItems.selectedBun._id,
      ...constructorItems.items.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      constructorItems.selectedBun._id
    ];
    dispatch(submitOrder(orderData));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
    dispatch(clearOrder());
    navigate('/', { replace: true });
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.selectedBun
      ? constructorItems.selectedBun.price * 2
      : 0;
    const ingredientsPrice = constructorItems.items.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{
        bun: constructorItems.selectedBun,
        ingredients: constructorItems.items
      }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
