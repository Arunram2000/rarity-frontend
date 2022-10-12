import React, { createContext, useState } from "react";

export const CollectionContext = createContext({});

const CollectionContextProvider: React.FC = ({ children }) => {
  const [collectionApi, setCollectionApi] = useState<any[]>([]);
  const [adminSettings, setAdminSettings] = useState<any>(null);

  return (
    <CollectionContext.Provider
      value={{ collectionApi, setCollectionApi, adminSettings, setAdminSettings }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export default CollectionContextProvider;
