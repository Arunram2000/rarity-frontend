import React, { useContext, useEffect, useState } from "react";
import { AttributesProps, CardProps } from "../store/types";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ReactComponent as Opensea } from "../assets/images/opensea.svg";

import "react-lazy-load-image-component/src/effects/blur.css";
import { HomeContext } from "../store/context/HomeContext";
import _ from "lodash";

interface CardPopupProps {
  data: CardProps;
  opensea_compatible: boolean;
  marketplace_url: string;
  totalSupply: number;
  setIsVisible: any;
  settingsMethod: string;
}

const filtersType = [
  { name: "Rarity score", value: "rarityScore" },
  { name: "Name", value: "valueName" },
];

const getFormatedScore = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
};

const CardPopup: React.FC<CardPopupProps> = ({
  data,
  opensea_compatible,
  marketplace_url,
  totalSupply,
  setIsVisible,
  settingsMethod,
}) => {
  const { selectedTraitsLists, setSelectedTraitsLists }: any = useContext(HomeContext);
  const [currentFilterType, setCurrentFilterType] = useState(filtersType[0].value);
  const [attributesArray, setAttributesArray] = useState<AttributesProps[] | null>(null);

  useEffect(() => {
    setAttributesArray(data.attributes);
  }, [data.attributes]);

  const handleSort = (value: string) => {
    setCurrentFilterType(value);
    if (value === "valueName")
      setAttributesArray(_.orderBy(data.attributes, ["trait_type"], ["asc"]));
    else setAttributesArray(data.attributes);
  };

  const getTraitCount = () => {
    // const t = attributesArray?.find((f) => f.trait_type === "TraitCount");
    return data.trait_count;
  };

  return (
    <>
      <div className="collection_modal">
        <div className="block">
          <div className="left">
            <h3>Rarity Rank #{data.rank}</h3>
            <LazyLoadImage src={data.image} effect="blur" alt="collection" />
            <h3>
              {data.name} #{data.tokenId}
            </h3>
            {opensea_compatible ? (
              <a
                href={`${marketplace_url}/${data.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Opensea />
                <span>View on Opensea</span>
              </a>
            ) : marketplace_url ? (
              <a
                href={`${marketplace_url}/${data.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View on Marketplace</span>
              </a>
            ) : null}
          </div>
          <div className="right">
            <div className="header">
              <p>
                {
                  {
                    rank: "Rarity Score",
                    trait_count: "Trait Count",
                    average: "Average Score",
                    statistical: "Statistical Score",
                  }[settingsMethod]
                }
              </p>
              <span>
                {
                  {
                    rank: getFormatedScore(data.rarity),
                    trait_count: getTraitCount(),
                    average: getFormatedScore(data.average),
                    statistical: getFormatedScore(data.statistical),
                  }[settingsMethod]
                }
              </span>
            </div>
            <div className="filter_options">
              {filtersType.map((f) => (
                <p
                  className={currentFilterType === f.value ? "active" : undefined}
                  key={f.value}
                  onClick={() => handleSort(f.value)}
                >
                  {f.name}
                </p>
              ))}
            </div>
            <div className="traits_wrapper">
              {attributesArray?.map((trait, index) => {
                return (
                  <div key={index.toString()} className="traits">
                    <div className="block-one">
                      <p>{trait.trait_type}</p>
                      <span>
                        +
                        {new Intl.NumberFormat("en-IN", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 0,
                        }).format(trait.rarityScore)}
                      </span>
                    </div>
                    <div
                      className={
                        trait.value !== null &&
                        selectedTraitsLists?.some(
                          (s) =>
                            s.value?.toString()?.toLowerCase() ===
                            trait?.value?.toString()?.toLowerCase()
                        )
                          ? "block-two active"
                          : "block-two"
                      }
                      onClick={() => {
                        if (selectedTraitsLists?.some((s) => s.trait_type === trait.trait_type)) {
                          setSelectedTraitsLists([
                            ...selectedTraitsLists?.filter(
                              (f) => f.trait_type !== trait.trait_type
                            ),
                          ]);
                          return;
                        }
                        setSelectedTraitsLists([
                          ...selectedTraitsLists,
                          { trait_type: trait.trait_type, value: trait.value },
                        ]);
                      }}
                    >
                      <p>{trait.value ?? "<none>"}</p>
                      <span>
                        {
                          trait.trait_type === "TraitCount"
                            ? (data.attributes.length * (totalSupply / trait.rarityScore)).toFixed(
                                0
                              ) //Only use this if rarity generator adjusted to 8x traitcount
                            : (totalSupply / trait.rarityScore).toFixed(0) //Also must be adjusted for collections with +- 10000 NFTs
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="backdrop" onClick={() => setIsVisible(false)} />
    </>
  );
};

export default CardPopup;
