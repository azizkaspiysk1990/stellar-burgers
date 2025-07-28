import '../../index.css';
import styles from './app.module.css';

import { FC, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';

import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
} from '@components';

import { ProtectedRoute } from '../protected-route';
import { useAppDispatch } from '../../services/store';

// Импорты экшенов из слайсов
import { loadIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUser, checkUserAuth } from '../../services/slices/userSlice';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Для модальных окон — запоминаем предыдущий маршрут
  const previousLocation = location.state?.background || null;

  useEffect(() => {
    dispatch(loadIngredients());

    dispatch(fetchUser())
      .unwrap()
      .catch(() => {
        // Ошибки игнорируем (пользователь не авторизован)
      })
      .finally(() => {
        dispatch(checkUserAuth());
      });
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={previousLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:orderId' element={<OrderInfo />} />
        <Route path='/ingredients/:ingredientId' element={<IngredientDetails />} />
        <Route path='/profile/orders/:orderId' element={<OrderInfo />} />

        {/* Страницы только для неавторизованных */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищённые страницы */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {previousLocation && (
        <Routes>
          <Route
            path='/feed/:orderId'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:ingredientId'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:orderId'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
