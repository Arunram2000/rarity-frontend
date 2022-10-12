import _ from "lodash";
import React, { useContext } from "react";
import { CollectionContext } from "../../store/context/collectionContext";
import { AllCollection, NewestCollection, RecentCollection, TopCollection } from "./components";

const Home: React.FC = () => {
  const { adminSettings, collectionApi }: any = useContext(CollectionContext);

  if (!collectionApi) {
    return (
      <div className="loader">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="rarity-homepage pad pt-50 pb-50">
      {!!adminSettings?.showNewestCollections && (
        <>
          <h1 style={{ textAlign: "center" }} className="mb-32">
            Newest Collections Added
          </h1>
          <div className="collection_container">
            {collectionApi &&
              _.orderBy(collectionApi, (a) => new Date(a.createdAt), ["desc"])
                ?.filter((f) => f.showNewestCollections === true)
                ?.slice(0, 12)
                ?.map((collection: any, index: number) => (
                  <NewestCollection nftcollection={collection} key={index.toString()} />
                ))}
          </div>
        </>
      )}
      <div style={{ marginTop: "3em" }}>
        <h1 style={{ textAlign: "center" }}>More Recent Collections</h1>
        <div className="recent_container">
          {collectionApi
            ?.filter((f) => f.showRecentCollections === true)
            ?.slice(0, 25)
            ?.map((collection: any, index: number) => (
              <RecentCollection nftcollection={collection} key={index.toString()} />
            ))}
        </div>
      </div>
      <div className="topcollection_div">
        <h1 style={{ textAlign: "center", marginBottom: "1em" }}>Top Collections</h1>
        <div className="topcollection_container">
          <TopCollection title="By Owner Count" collection={collectionApi} />
        </div>
      </div>
      <div>
        <h1 style={{ textAlign: "center", marginBottom: "1em" }}>All Collections</h1>
        <AllCollection data={collectionApi} />
      </div>
      <div className="mt-50">
        <h5 style={{ textAlign: "center" }} className="mb-15">
          Terms of use
        </h5>
        <p>
          Rarity.Tools is compensated for listing and ranking NFT collections in the form of a
          listing fee. Listing fees are generally paid by NFT holders or creators. Rarity.Tools is
          intended for informational and educational purposes only. We do not provide financial or
          investment advice or recommend you purchase any NFTs. Please do not rely on rarity scores,
          rankings, or other information provided on this site for those or other purposes.
        </p>
      </div>
    </div>
  );
};

export default Home;
