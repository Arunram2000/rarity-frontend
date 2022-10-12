import React, { useCallback, useContext, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";

import "react-lazy-load-image-component/src/effects/blur.css";

import { API } from "../../api";
import { Button } from "../../components";
import { HomeContext } from "../../store/context/HomeContext";
import { CardProps, CollectionProps } from "../../store/types";
import CardPopup from "../../components/CardPopup";
import QueryString from "qs";
import _ from "lodash";

interface ExploreTraitsProps {
  traits: any;
  lookupValue: CardProps | null;
  setLookupValue: React.Dispatch<React.SetStateAction<CardProps | null>>;
  data: CollectionProps;
  settingsMethod: string;
}

interface CollectionExploreTraitsProps {
  value: string;
  count: number;
  rarityScore: number;
  examples: {
    image: string;
    tokenId: string;
  }[];
}

const sortTraitsValueArr = [
  { name: "Least Count", value: "leastCount" },
  { name: "Rarity Score", value: "rarityScore" },
  { name: "Value Name", value: "valueName" },
];

const ExploreTraits: React.FC<ExploreTraitsProps> = ({
  setLookupValue,
  data,
  lookupValue,
  settingsMethod,
}) => {
  const { collection } = useParams();
  const { collectionValue }: any = useContext(HomeContext);
  const [collectionData, setCollectionData] = useState<CollectionExploreTraitsProps[] | null>(null);
  const [sortTraitsValue, setSortTraitsValue] = useState("leastCount");
  const [totalCount, setTotalCount] = useState(0);
  const [errorData, setErrorData] = useState(false);

  const handleGetTraitsCollection = useCallback(async () => {
    setCollectionData(null);
    setErrorData(false);
    try {
      if (collectionValue) {
        const { data } = await API.get(
          `/collection/get_traits/${collection}?trait_type=${collectionValue?.trait_type}`,
          {
            params: {
              values: collectionValue?.values,
            },
            paramsSerializer: (params) => {
              return QueryString.stringify(params);
            },
          }
        );
        setCollectionData([...data.traitsData?.sort((a, b) => a.count - b.count)]);
        setTotalCount(data.count);
      }
    } catch (error) {
      console.log(error);
      setErrorData(true);
    }
  }, [collectionValue, collection]);

  useEffect(() => {
    handleGetTraitsCollection();
  }, [handleGetTraitsCollection]);

  const handleLookup = async (id: string) => {
    try {
      const { data } = await API.get(`/collection/get_collection/${collection}/${id}`);
      const result: CardProps = data;
      setLookupValue(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="pad mb-50">
        <div className="m-20">
          <h3 style={{ textAlign: "center" }}>{collectionValue?.trait_type} Values</h3>
          <div>
            <h5 className="mb-15 mt-25" style={{ textAlign: "center" }}>
              Sort Trait Values by:
            </h5>
            <div style={{ display: "flex", gridGap: 15, justifyContent: "center" }}>
              {sortTraitsValueArr.map((d) => (
                <Button
                  key={d.value}
                  variant={d.value === sortTraitsValue ? "primary" : "secondary"}
                  onClick={() => {
                    setSortTraitsValue(d.value);
                    if (collectionData) {
                      if (d.value === "leastCount") {
                        setCollectionData([...collectionData.sort((a, b) => a.count - b.count)]);
                      }
                      if (d.value === "valueName") {
                        setCollectionData(_.orderBy(collectionData, ["value"], ["asc"]));
                      }
                      if (d.value === "rarityScore") {
                        setCollectionData([
                          ...collectionData.sort((a, b) => b.rarityScore - a.rarityScore),
                        ]);
                      }
                    }
                  }}
                >
                  {d.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="explore_traits_table">
          {errorData ? (
            <div className="loader" style={{ minHeight: 200 }}>
              <h3>Something went wrong.</h3>
            </div>
          ) : (
            <>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th className="p-10">Value</th>
                    <th className="p-10">Count</th>
                    <th className="p-10">Rarity Score</th>
                    <th className="p-10">Examples</th>
                  </tr>
                </thead>
                {!collectionData ? (
                  <tbody>
                    <tr>
                      <td
                        style={{
                          color: " #be185d",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        Loading...
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <>
                    {!collectionData.length ? (
                      <tbody>
                        <tr>
                          <td
                            style={{
                              color: " #be185d",
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            No Data Found...
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <>
                        <tbody>
                          {collectionData.map((col, index) => {
                            return (
                              <tr key={index}>
                                <td
                                  className="p-10"
                                  style={{
                                    color: " #be185d",
                                    fontSize: 14,
                                    fontWeight: 700,
                                  }}
                                >
                                  {col.value}
                                </td>
                                <td
                                  className="p-10"
                                  style={{
                                    color: " #be185d",
                                    fontSize: 14,
                                    fontWeight: 700,
                                  }}
                                >
                                  {col.count}
                                </td>
                                <td
                                  className="p-10"
                                  style={{
                                    color: "rgba(16, 185, 129, 1)",
                                    fontSize: 14,
                                    fontWeight: 700,
                                  }}
                                >
                                  +&nbsp;
                                  {new Intl.NumberFormat("en-IN", {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 0,
                                  }).format(col.rarityScore)}
                                </td>
                                <td className="p-10" style={{ display: "flex", gridGap: 10 }}>
                                  {col.examples.map((e, j) => {
                                    return (
                                      <p
                                        key={j}
                                        style={{ width: 150, height: 150, cursor: "pointer" }}
                                        onClick={() => handleLookup(e.tokenId)}
                                      >
                                        <LazyLoadImage
                                          src={e.image}
                                          alt={e.tokenId}
                                          effect="blur"
                                          style={{
                                            width: 150,
                                            height: 150,
                                            objectFit: "cover",
                                            borderRadius: 5,
                                          }}
                                        />
                                      </p>
                                    );
                                  })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </>
                    )}
                  </>
                )}
              </table>
            </>
          )}
        </div>
      </div>
      {lookupValue && (
        <CardPopup
          data={lookupValue}
          marketplace_url={data?.marketplace_url}
          opensea_compatible={data?.opensea_compatible}
          setIsVisible={() => setLookupValue(null)}
          totalSupply={totalCount}
          settingsMethod={settingsMethod}
        />
      )}
    </>
  );
};

export default ExploreTraits;
