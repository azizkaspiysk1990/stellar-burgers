import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const user = useAppSelector(getUser);

  return <AppHeaderUI userName={user?.name} />;
};
