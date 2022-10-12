import React from "react";
import { Link } from "react-router-dom";

interface IRecentCollection {
  nftcollection: any;
}

const RecentCollection: React.FC<IRecentCollection> = ({ nftcollection }) => {
  return (
    <Link
      to={`/${nftcollection.collection_slug}`}
      style={{
        display: "flex",
        alignItems: "center",
        margin: "1em 0",
      }}
    >
      <img
        src={nftcollection?.image_url}
        alt="collection"
        style={{ borderRadius: "50%" }}
        width="50"
        height="50"
      />
      <h5 className="ml-10">{nftcollection.collection_name}</h5>
    </Link>
  );
};

export default RecentCollection;
