import React, { createContext, useState } from "react";

export const HomeContext = createContext({});

const HomeContextProvider: React.FC = ({ children }) => {
  const [collectionValue, setCollectionValue] = useState<any>(null);
  const [selectedTraits, setSelectedTraits] = useState<any>(null);
  const [selectedTraitsLists, setSelectedTraitsLists] = useState<any[]>([]);

  return (
    <HomeContext.Provider
      value={{
        collectionValue,
        setCollectionValue,
        selectedTraits,
        setSelectedTraits,
        selectedTraitsLists,
        setSelectedTraitsLists,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export default HomeContextProvider;
