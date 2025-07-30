import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  selectIngredients,
  selectIsLoading
} from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { ingredientId } = useParams<{ ingredientId: string }>();
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIsLoading);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === ingredientId
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div className='text text_type_main-medium mt-10 mb-6'>
        Ингредиент не найден
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
