import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API, getAdminSettingsApi } from "../api";
import { CollectionContext } from "../store/context/collectionContext";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "react-lazy-load-image-component/src/effects/blur.css";

import "../styles/components/header.scss";
import { ReactComponent as CollectionSvg } from "../assets/icons/collection.svg";
import _ from "lodash";

const Header: React.FC = () => {
  const [openCollection, setOpenCollection] = useState(false);
  const { collectionApi, setCollectionApi }: any = useContext(CollectionContext);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { adminSettings, setAdminSettings }: any = useContext(CollectionContext);

  const handleSearch = useCallback(() => {
    let result: any[] = [];
    collectionApi?.forEach((col: any) => {
      if (col?.collection_name.toLowerCase().match(searchValue.toLowerCase())) {
        result.push(col);
      }
    });
    setFilteredData([...result]);
  }, [collectionApi, searchValue]);

  useEffect(() => {
    handleSearch();
  }, [searchValue, handleSearch]);

  const handleGetCollection = useCallback(async () => {
    const adminData = await getAdminSettingsApi();
    setAdminSettings(adminData.data);
    const { data } = await API.get("/collection/get_all_collection");
    setCollectionApi(data);
  }, [setCollectionApi, setAdminSettings]);

  useEffect(() => {
    handleGetCollection();
  }, [handleGetCollection]);

  const renderDropdown = (
    <div className="header_dropdown">
      <p onClick={() => setOpenCollection(true)}>
        <span style={{ height: 11 }}>
          <CollectionSvg />
        </span>
        <span>All Collections</span>
      </p>
      <div
        className={openCollection ? "header_dropdown-content active" : "header_dropdown-content"}
      >
        <div className="input">
          <input
            type="text"
            placeholder="search project name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="list">
          {!searchValue.length ? (
            collectionApi?.map((col: any, index: number) => {
              return (
                <div className="list_item" key={index}>
                  <Link to={`/${col.collection_slug}`} onClick={() => setOpenCollection(false)}>
                    <LazyLoadImage src={col?.image_url} alt="icon" className="logo" />
                    <h4>{col.collection_name}</h4>
                  </Link>
                </div>
              );
            })
          ) : filteredData.length ? (
            filteredData?.map((col: any, index: number) => {
              return (
                <div className="list_item" key={index}>
                  <Link to={`/${col.collection_slug}`}>
                    <LazyLoadImage src={col?.image_url} alt="icon" className="logo" />
                    <h4>{col.collection_name}</h4>
                  </Link>
                </div>
              );
            })
          ) : (
            <div>
              <h5>No matches found</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header>
        <div className="container pad">
          <div className="block-left">
            <main>rarity.tools</main>
            <Link to="/">Home</Link>
            <>
              {renderDropdown}
              {!!adminSettings?.headerMenu && (
                <div className="recent_collection">
                  <p style={{ color: "rgba(251, 191, 36,1)", fontWeight: 500 }}>New!</p>
                  <div style={{ display: "flex", alignItems: "center", gridGap: 10 }}>
                    {collectionApi &&
                      _.orderBy(collectionApi, (a) => new Date(a.createdAt), ["desc"])
                        .filter((f) => f.headerMenu === true)
                        .slice(0, 3)
                        .map((col: any) => (
                          <Link
                            to={`/${col?.collection_slug}`}
                            key={col?.collection_name}
                            style={{ display: "flex", alignItems: "center", gridGap: 5 }}
                          >
                            <img
                              src={col?.image_url}
                              alt={col?.collection_name}
                              style={{
                                width: 16,
                                height: 16,
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                            <span style={{ fontSize: 14 }}>{col?.collection_name}</span>
                          </Link>
                        ))}
                  </div>
                </div>
              )}
            </>
          </div>
          <div className="block-right">
            <Link to="/list-your-project">List your project</Link>
            <Link to="/contact-us">Contact Us</Link>
            <a href="/" target="_blank" rel="noopener">
              About
            </a>
          </div>
        </div>
      </header>
      {openCollection && (
        <div className="header_backdrop" onClick={() => setOpenCollection(false)}></div>
      )}
    </>
  );
};

export default React.memo(Header);
