import React from "react";
import TopCollectionItem from "./TopCollectionItem";

import "../../../styles/pages/home.scss";

interface ITopCollection {
  title: string;
  collection: any;
}
const TopCollection: React.FC<ITopCollection> = ({ title, collection }) => {
  const nftCollection = collection
    ?.filter(
      (collection: any) => collection.opensea_compatible === true && collection.stats !== null
    )
    ?.sort((a: any, b: any) => b.stats.num_owners - a.stats.num_owners);
  return (
    <div className="topcollection">
      <h2 style={{ padding: "0.5em 1em ", fontSize: 18 }} className="mb-20">
        {title}
      </h2>
      <div className="topcollection_wrapper">
        {nftCollection
          ?.filter((collection: any) => collection.opensea_compatible === true)
          ?.slice(0, 10)
          ?.map((data: any, index: number) => (
            <TopCollectionItem nftcollection={data} id={index + 1} key={index.toString()} />
          ))}
      </div>
    </div>
  );
};

export default TopCollection;
