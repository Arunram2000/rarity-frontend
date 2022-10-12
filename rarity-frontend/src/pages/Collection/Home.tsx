import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { API } from "../../api";
import { CardProps, CollectionProps } from "../../store/types";
import Button from "../../components/Button";
import Card from "./components/Card";
import Gallery from "../../components/icons/Gallery";
import { HomeContext } from "../../store/context/HomeContext";
import CardPopup from "../../components/CardPopup";
import _ from "lodash";

interface HomeProps {
  result: CollectionProps;
  settingsMethod: string;
  setSettingsMethod: any;
  totalCount: number;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  lookupValue: CardProps | null;
  setLookupValue: any;
}

const Home: React.FC<HomeProps> = ({
  result,
  settingsMethod,
  setSettingsMethod,
  totalCount,
  setTotalCount,
  lookupValue,
  setLookupValue,
}) => {
  const { collection } = useParams();
  const [collectionData, setCollectionData] = useState<CardProps[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [idVisible, setIdVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const { selectedTraitsLists, setSelectedTraitsLists }: any = useContext(HomeContext);

  const handleGetCollection = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(
        `/collection/v1/${collection}?filterBy=${settingsMethod}&page=${currentPage}&trait_type=${selectedTraitsLists?.[0]?.trait_type}&value=${selectedTraitsLists?.[0]?.value}`
      );
      const results: CardProps[] = data.results;
      const totPages: number = data.totalPages;
      setCollectionData(results);
      setTotalPages(totPages);
      setCurrentPage(data.currentPage);
      setTotalCount(data.totalCount);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, settingsMethod, currentPage, selectedTraitsLists]);

  useEffect(() => {
    handleGetCollection();
  }, [handleGetCollection]);

  return (
    <>
      <div className="home">
        {selectedTraitsLists?.length > 0 && (
          <div className="filtered_traits_wrapper mb-15">
            <h5>Active Filters</h5>
            {selectedTraitsLists?.map((list, i: number) => {
              return (
                <div key={i} className="traits_card">
                  <p>{list?.trait_type}</p>
                  <b className="mr-5">{list?.value ?? "<none>"}</b>
                  <span
                    onClick={() => {
                      setSelectedTraitsLists([
                        ...selectedTraitsLists.filter((f) => f.trait_type !== list.trait_type),
                      ]);
                    }}
                  >
                    X
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <div className="header">
          <div>
            <h5>
              {totalCount} Total {result.collection_name}
            </h5>
            {result.opensea_compatible && result.stats && (
              <h5>
                Price Floor:{" "}
                {new Intl.NumberFormat("en-IN", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
                }).format(result.stats.floor_price)}{" "}
                ETH
              </h5>
            )}
          </div>
          <div>
            <div className="sort-input">
              <h5>sort by:</h5>
              <select onChange={(e) => setSettingsMethod(e.target.value)}>
                <option value="rank">Rarity</option>
                <option value="id">ID</option>
              </select>
            </div>
            <Button
              variant={idVisible ? "primary" : "secondary"}
              onClick={() => setIdVisible((v) => !v)}
            >
              IDs
            </Button>
            <Button
              style={{ display: "grid", placeItems: "center", padding: "3px 5px" }}
              variant={imageVisible ? "primary" : "secondary"}
              onClick={() => setImageVisible((img) => !img)}
            >
              <Gallery />
            </Button>
            <div style={{ display: "flex", alignItems: "center", gridGap: 10 }}>
              {currentPage > 1 && (
                <Button
                  variant="primary"
                  disabled={loading}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  {"<"} Prev
                </Button>
              )}
              <h5>
                Page {currentPage} of {totalPages}
              </h5>
              {currentPage !== totalPages && (
                <Button
                  variant="primary"
                  disabled={loading}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next {">"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ minHeight: 250, display: "grid", placeItems: "center" }}>
            <h4 style={{ textAlign: "center" }}>Loading...</h4>
          </div>
        ) : (
          <div className="collection_card_wrapper mt-20">
            {collectionData.length && !selectedTraitsLists?.length ? (
              _.uniqWith(collectionData, _.isEqual).map((col, index) => {
                return (
                  <Card
                    data={col}
                    key={index}
                    idVisible={idVisible}
                    imageVisible={imageVisible}
                    opensea_compatible={result.opensea_compatible}
                    marketplace_url={result.marketplace_url}
                    totalSupply={totalCount}
                    settingsMethod={settingsMethod}
                    currentPage={currentPage}
                    index={index}
                  />
                );
              })
            ) : selectedTraitsLists?.length && !collectionData.length ? (
              <div className="p-30">
                <h5 style={{ textAlign: "center" }}>No Matches Found</h5>
              </div>
            ) : (
              _.uniqWith(collectionData, _.isEqual).map((col, index) => {
                return (
                  <Card
                    data={col}
                    key={index}
                    idVisible={idVisible}
                    imageVisible={imageVisible}
                    opensea_compatible={result.opensea_compatible}
                    marketplace_url={result.marketplace_url}
                    totalSupply={totalCount}
                    settingsMethod={settingsMethod}
                    currentPage={currentPage}
                    index={index}
                  />
                );
              })
            )}
          </div>
        )}
      </div>
      {!loading && (
        <div
          className="pad mb-30 mt-20"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gridGap: 15,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gridGap: 10, flexWrap: "wrap" }}>
            <h5>Page</h5>
            <Button
              variant={currentPage === 1 ? "secondary" : "primary"}
              disabled={loading}
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>
            {totalPages > 1 && (
              <Button
                variant={currentPage === 2 ? "secondary" : "primary"}
                disabled={loading}
                onClick={() => setCurrentPage(2)}
              >
                2
              </Button>
            )}
            {totalPages > 2 && (
              <Button
                variant={currentPage === 3 ? "secondary" : "primary"}
                disabled={loading}
                onClick={() => setCurrentPage(3)}
              >
                {3}
              </Button>
            )}
            {totalPages >= 7 && (
              <>
                <span>...</span>
                <Button
                  variant={currentPage === totalPages - 2 ? "secondary" : "primary"}
                  disabled={loading}
                  onClick={() => setCurrentPage(totalPages - 2)}
                >
                  {totalPages - 2}
                </Button>
                <Button
                  variant={currentPage === totalPages - 1 ? "secondary" : "primary"}
                  disabled={loading}
                  onClick={() => setCurrentPage(totalPages - 1)}
                >
                  {totalPages - 1}
                </Button>
                <Button
                  variant={currentPage === totalPages ? "secondary" : "primary"}
                  disabled={loading}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gridGap: 10 }}>
            {currentPage > 1 && (
              <Button
                variant="primary"
                disabled={loading}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {"<"} Prev
              </Button>
            )}
            <h5>
              Page {currentPage} of {totalPages}
            </h5>
            {currentPage !== totalPages && (
              <Button
                variant="primary"
                disabled={loading}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next {">"}
              </Button>
            )}
          </div>
        </div>
      )}
      {lookupValue && (
        <CardPopup
          data={lookupValue}
          marketplace_url={result?.marketplace_url}
          opensea_compatible={result?.opensea_compatible}
          setIsVisible={() => setLookupValue(null)}
          totalSupply={totalCount}
          settingsMethod={settingsMethod}
        />
      )}
    </>
  );
};

export default Home;
