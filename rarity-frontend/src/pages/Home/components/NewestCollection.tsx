import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

import "../../../styles/pages/home.scss";

interface INewestCollection {
  nftcollection: any;
}

const NewestCollection: React.FC<INewestCollection> = ({ nftcollection }) => {
  return (
    <div className="newest_collection">
      <Link to={`/${nftcollection.collection_slug}`}>
        <div>
          <img src={nftcollection.banner_image_url} alt="collection" width="288" height="220" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.8fr 0.2fr",
            padding: "10px",
          }}
        >
          <div>
            <h3>{nftcollection.collection_name}</h3>
            <p>Added {moment(nftcollection.createdAt).format("ll")}</p>
            {nftcollection?.opensea_compatible && nftcollection.stats && (
              <p>Owners {nftcollection.stats.num_owners}</p>
            )}
            {nftcollection?.opensea_compatible && nftcollection.stats && (
              <p>
                Total Volume:&nbsp;
                {new Intl.NumberFormat("en-IN", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }).format(nftcollection.stats.total_volume)}
                ETH
              </p>
            )}
          </div>
          <div>
            <img src={nftcollection?.image_url} alt="collection" style={{ borderRadius: "50%" }} />
          </div>
        </div>
        <div style={{ padding: "10px" }}>
          <p style={{ color: "#000" }}>{nftcollection.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default NewestCollection;
