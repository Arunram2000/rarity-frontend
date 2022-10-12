import React, { useCallback, useEffect, useState } from "react";
import { Routes, useParams, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import { CardProps, CollectionProps } from "../../store/types";

import "../../styles/pages/collection.scss";
import CollectionDetails from "./components/CollectionDetails";
import Sidebar from "./components/Sidebar";
import { Button } from "../../components";
import { NewestCollection, TopCollection } from "../Home/components";
import { API } from "../../api";
import ExploreTraits from "./ExploreTraits";
import _ from "lodash";
import Wallet from "./Wallet";

interface IMethods {
  key: string;
  value: string;
}

const methodsArray: IMethods[] = [
  { key: "rank", value: "Rarity Score" },
  { key: "trait_count", value: "Trait Rarity" },
  { key: "average", value: "Average Rarity" },
  { key: "statistical", value: "Statistical Rarity" },
];

const Collection: React.FC = () => {
  const [settingsMethod, setSettingsMethod] = useState("rank");
  const [result, setResult] = useState<CollectionProps | null>(null);
  const { collection } = useParams();
  const location = useLocation();
  const [allCollections, setAllCollection] = useState<CollectionProps[]>([]);
  const [lookupValue, setLookupValue] = useState<CardProps | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState(false);

  const handleGetCollection = useCallback(async () => {
    try {
      setLoading(true);
      setResult(null);
      const collectionData = await API.get(`/api/v1/${collection}`);
      setResult(collectionData.data.result);
      setLoading(false);
      const { data } = await API.get("/collection/get_all_collection");
      setAllCollection(data);
      setErrorData(false);
    } catch (error) {
      console.log(error);
      setErrorData(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  useEffect(() => {
    handleGetCollection();
  }, [handleGetCollection]);

  if (errorData) {
    return (
      <div className="loader">
        <h4>Something went wrong</h4>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loader">
        <h4>Loading...</h4>
      </div>
    );
  }

  const renderMethods = (
    <div className="pl-32 pr-32 pt-15 pb-15">
      {!location.pathname.includes("/traits") && (
        <details>
          <summary>settings</summary>
          <div>
            <h5 className="mb-10">Method</h5>
            <div style={{ display: "flex", gridGap: 10, flexWrap: "wrap" }}>
              {methodsArray.map((a: IMethods, index: number) => {
                return (
                  <Button
                    key={index.toString()}
                    variant={a.key === settingsMethod ? "primary" : "secondary"}
                    onClick={() => setSettingsMethod(a.key)}
                  >
                    {a.value}
                  </Button>
                );
              })}
            </div>
          </div>
        </details>
      )}
    </div>
  );

  return (
    <>
      {result && (
        <div className="collection">
          <>
            <div className="collection_wrapper">
              <Sidebar {...result} setLookupValue={setLookupValue} />
              <div className="pb-50 collection_details-container">
                <CollectionDetails {...result} />
                {renderMethods}
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        result={result}
                        settingsMethod={settingsMethod}
                        setSettingsMethod={setSettingsMethod}
                        totalCount={totalCount}
                        setTotalCount={setTotalCount}
                        lookupValue={lookupValue}
                        setLookupValue={setLookupValue}
                      />
                    }
                  />
                  <Route
                    path="/traits"
                    element={
                      <ExploreTraits
                        traits={result?.traits}
                        setLookupValue={setLookupValue}
                        lookupValue={lookupValue}
                        data={result}
                        settingsMethod={settingsMethod}
                      />
                    }
                  />
                  <Route
                    path="/wallet"
                    element={
                      <Wallet
                        collection_slug={result?.collection_slug}
                        token_address={result.collection_contract_address}
                        chain={result.chain}
                      />
                    }
                  />
                </Routes>
                {!!result.showRecentCollections && (
                  <div className="pad mb-30">
                    <h3 className="mb-15  pb-10 line">Newest Collections Added</h3>
                    <div className="collection_container">
                      {allCollections &&
                        _.orderBy(allCollections, (a) => new Date(a.createdAt), ["desc"])
                          .filter((f) => f.collection_slug !== collection)
                          ?.slice(0, 12)
                          ?.map((collection: any, index: number) => (
                            <NewestCollection nftcollection={collection} key={index.toString()} />
                          ))}
                    </div>
                  </div>
                )}
                {allCollections?.length && (
                  <div className="pad mb-50">
                    <h3 className="mb-15  pb-10 line">Top Collections</h3>
                    <div className="topcollection_container">
                      <TopCollection title="By Owner Count" collection={allCollections} />
                    </div>
                  </div>
                )}
                <div className="pad pb-30">
                  <h5 style={{ textAlign: "center" }} className="mb-15">
                    Terms of Use - Powered by OpenSea
                  </h5>
                  <p>
                    Rarity.Tools is compensated for listing and ranking NFT collections in the form
                    of a listing fee. Listing fees are generally paid by NFT holders or creators.
                    Rarity.Tools is intended for informational and educational purposes only. We do
                    not provide financial or investment advice or recommend you purchase any NFTs.
                    Please do not rely on rarity scores, rankings, or other information provided on
                    this site for those or other purposes.
                  </p>
                </div>
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default Collection;
