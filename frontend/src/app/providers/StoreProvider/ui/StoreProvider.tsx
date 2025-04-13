
import { createContext, useContext } from "react";
import { RootStore } from "shared/store/root-store";

export const RootStoreContext = createContext<RootStore | null>(null)
/**
 * Контекст может иметь значение null, 
 * если разработчик забыл передать значение контексту. 
 * Поэтому необходимо обработать эту ошибку.
 */
export const useStore = () => {
  const context = useContext(RootStoreContext);
  if (context === null) {
    throw new Error(
      "You have forgotten to wrap your root component with RootStoreProvider"
    );
  }
  return context;
};