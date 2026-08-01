import { createContext, useContext, useState, type ReactNode } from 'react';

type Page = 'home' | 'tvshows' | 'movies' | 'newandhot' | 'mylist' | 'search' | 'comingsoon' | 'games' | 'categories';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  myList: any[];
  addToList: (item: any) => void;
  removeFromList: (id: number) => void;
  isInList: (id: number) => boolean;
  streamingItem: any | null;
  setStreamingItem: (item: any | null) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [myList, setMyList] = useState<any[]>([]);
  const [streamingItem, setStreamingItem] = useState<any | null>(null);

  const addToList = (item: any) => {
    setMyList(prev => prev.find(m => m.id === item.id) ? prev : [...prev, item]);
  };

  const removeFromList = (id: number) => {
    setMyList(prev => prev.filter(m => m.id !== id));
  };

  const isInList = (id: number) => myList.some(m => m.id === id);

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      searchQuery, setSearchQuery,
      myList, addToList, removeFromList, isInList,
      streamingItem, setStreamingItem,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
