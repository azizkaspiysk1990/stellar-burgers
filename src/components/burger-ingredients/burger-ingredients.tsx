import { FC, useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const BurgerIngredients: FC = () => {
  const ingredients = useAppSelector(selectIngredients);

  const buns = ingredients.filter((item) => item.type === 'bun');
  const sauces = ingredients.filter((item) => item.type === 'sauce');
  const mains = ingredients.filter((item) => item.type === 'main');

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const bunTitleRef = useRef<HTMLHeadingElement>(null);
  const sauceTitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);

  const [bunRef, inViewBun] = useInView({ threshold: 0 });
  const [sauceRef, inViewSauce] = useInView({ threshold: 0 });
  const [mainRef, inViewMain] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBun) {
      setCurrentTab('bun');
    } else if (inViewSauce) {
      setCurrentTab('sauce');
    } else if (inViewMain) {
      setCurrentTab('main');
    }
  }, [inViewBun, inViewSauce, inViewMain]);

  const handleTabClick = (val: string) => {
    const tab = val as TTabMode;
    setCurrentTab(tab);
    const scrollOptions = { behavior: 'smooth' as const };

    switch (tab) {
      case 'bun':
        bunTitleRef.current?.scrollIntoView(scrollOptions);
        break;
      case 'sauce':
        sauceTitleRef.current?.scrollIntoView(scrollOptions);
        break;
      case 'main':
        mainTitleRef.current?.scrollIntoView(scrollOptions);
        break;
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      sauces={sauces}
      mains={mains}
      titleBunRef={bunTitleRef}
      titleSaucesRef={sauceTitleRef}
      titleMainRef={mainTitleRef}
      bunsRef={bunRef}
      saucesRef={sauceRef}
      mainsRef={mainRef}
      onTabClick={handleTabClick}
    />
  );
};
