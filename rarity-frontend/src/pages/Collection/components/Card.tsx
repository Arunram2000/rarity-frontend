import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "react-lazy-load-image-component/src/effects/blur.css";
import { CardProps } from "../../../store/types";
import CardPopup from "../../../components/CardPopup";

interface ICard {
  totalSupply: number;
  data: CardProps;
  idVisible: boolean;
  imageVisible: boolean;
  opensea_compatible: boolean;
  marketplace_url: string;
  settingsMethod: string;
  currentPage: number;
  index: number;
}

const Card: React.FC<ICard> = ({
  data,
  totalSupply,
  idVisible,
  imageVisible,
  opensea_compatible,
  marketplace_url,
  settingsMethod,
  currentPage,
  index,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {imageVisible ? (
        <div className="card-image-container">
          <LazyLoadImage alt={data.tokenId} effect="blur" src={data.image} />
        </div>
      ) : (
        <div key={data.objectId} className="collection_card" onClick={() => setIsVisible(true)}>
          <div>
            <h4>#{settingsMethod === "rank" ? data.rank : (currentPage - 1) * 48 + (index + 1)}</h4>
          </div>
          <div className="image mt-10 mb-10">
            <LazyLoadImage alt={data.tokenId} effect="blur" src={data.image} />
          </div>
          <div>
            <h5>
              {idVisible ? `#${data.tokenId}` : `${data.name.slice(0, 10)}... #${data.tokenId}`}
            </h5>
          </div>
        </div>
      )}
      {isVisible && (
        <CardPopup
          data={data}
          marketplace_url={marketplace_url}
          opensea_compatible={opensea_compatible}
          setIsVisible={setIsVisible}
          totalSupply={totalSupply}
          settingsMethod={settingsMethod}
        />
      )}
    </>
  );
};

export default Card;
