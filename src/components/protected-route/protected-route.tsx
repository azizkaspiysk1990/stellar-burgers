import { FC, ReactElement } from 'react';
import { useAppSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

import { getAuthCheckedStatus, getUser } from '../../services/slices/userSlice';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children,
}) => {
  const isAuthChecked = useAppSelector(getAuthCheckedStatus);
  const user = useAppSelector(getUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location })?.from || { pathname: '/' };
    return <Navigate replace to={from} state={location} />;
  }

  return children;
};
