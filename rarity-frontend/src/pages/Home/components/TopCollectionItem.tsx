import React from "react";
import { Link } from "react-router-dom";

interface ITopCollection {
  nftcollection: any;
  id: number;
}
const TopCollectionItem: React.FC<ITopCollection> = ({ nftcollection, id }) => {
  return (
    <div className="collection-item">
      <Link to={`/${nftcollection.collection_slug}`}>
        <span>#{id}</span>
        <img
          src={nftcollection?.image_url}
          alt="collection"
          width="50"
          height="50"
          style={{ borderRadius: "50%" }}
        />
        <div>
          <h3>{nftcollection.collection_name}</h3>
          <p>{nftcollection.stats.num_owners} owners</p>
        </div>
      </Link>
    </div>
  );
};

export default TopCollectionItem;
