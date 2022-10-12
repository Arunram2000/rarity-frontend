import React from "react";
import CollectionContextProvider from "./context/collectionContext";
import HomeContextProvider from "./context/HomeContext";

const Provider: React.FC = ({ children }) => {
  return (
    <CollectionContextProvider>
      <HomeContextProvider>{children}</HomeContextProvider>
    </CollectionContextProvider>
  );
};

export default Provider;
