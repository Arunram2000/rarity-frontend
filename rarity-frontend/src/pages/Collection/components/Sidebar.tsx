import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import flatten from "flat";

import { CardProps, CollectionProps } from "../../../store/types";
import Button from "../../../components/Button";
import { CollectionContext } from "../../../store/context/collectionContext";
import { HomeContext } from "../../../store/context/HomeContext";
import { ReactComponent as DownArrow } from "../../../assets/icons/downarrow.svg";
import { API } from "../../../api";

interface SidebarProps extends CollectionProps {
  setLookupValue: React.Dispatch<React.SetStateAction<CardProps | null>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  allTraits,
  setLookupValue,
  traitCount,
  opensea_compatible,
}) => {
  const navigate = useNavigate();
  const { collection } = useParams();
  const location = useLocation();
  const { collectionApi }: any = useContext(CollectionContext);
  const { collectionValue, setCollectionValue, setSelectedTraitsLists, selectedTraitsLists }: any =
    useContext(HomeContext);
  const [collectionName, setCollectionName] = useState<any>();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [networkTraits, setNetworkTraits] = useState<any[]>([]);
  const [lookup, setLookup] = useState<number>(0);

  useEffect(() => {
    if (allTraits) {
      const objkeys = Object.keys(allTraits);
      const flattenObj: any = flatten(allTraits);
      const flattenObjKeys = Object.keys(flattenObj);
      const finalResult = objkeys.map((obj) => {
        const traitsCategory = flattenObjKeys
          .filter((f) => f.includes(obj))
          .map((a) => {
            return {
              type: a.split(".")[1],
              value: Number(flattenObj[a]),
            };
          });
        return {
          category: obj,
          lists: traitsCategory,
        };
      });

      const filteredResult = finalResult.filter((f) => f.category !== "TraitCount");
      setNetworkTraits(filteredResult);
      setCollectionValue({
        trait_type: filteredResult?.[0].category,
        values: filteredResult?.[0].lists?.map((l) => l.type).filter((f) => f !== "occurences"),
      });
    }

    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [allTraits]);

  useEffect(() => {
    if (collectionApi && collection) {
      const col = collectionApi?.find((c: any) => c?.collection_slug === collection);
      setCollectionName(col?.collection_name);
    }
  }, [collectionApi, collection]);

  const handleLookup = async (id: number) => {
    try {
      const { data } = await API.get(`/collection/get_collection/${collection}/${id}`);
      const result: CardProps = data;
      setLookupValue(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="collection_sidebar">
      <div className="collection_sidebar-header mb-50">
        <h3>Project</h3>
        <div className="dropdown">
          <p onClick={() => setOpenDropdown(!openDropdown)}>
            <span>{collectionName}</span>
            <DownArrow />
          </p>
          <div className={openDropdown ? "dropdown_content active" : "dropdown_content"}>
            {collectionApi?.map((collection: any, index: number) => (
              <p key={index.toString()} onClick={() => navigate(`/${collection?.collection_slug}`)}>
                {collection?.collection_name}
              </p>
            ))}
          </div>
        </div>
        <div className="lookup">
          <input
            type="number"
            value={lookup === 0 ? "" : lookup}
            onChange={({ target }) => setLookup(Number(target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLookup(lookup);
            }}
            placeholder="ID...."
          />
          <Button onClick={() => handleLookup(lookup)}>lookup</Button>
        </div>
      </div>
      <div>
        {traitCount && (
          <div className="mb-20">
            <h4 className="line p-10 mb-10">Meta</h4>
            <details className="details-tag">
              <summary>Trait count</summary>
              <div>
                {Object.keys(traitCount).map((d: any, index) => {
                  return (
                    <div
                      key={index.toString()}
                      className={
                        selectedTraitsLists?.some(
                          (s) =>
                            s.trait_type === "TraitCount" &&
                            selectedTraitsLists?.some((s) => s.value === d)
                        )
                          ? "details-content active mt-10"
                          : selectedTraitsLists?.some((s) => s.trait_type === "TraitCount")
                          ? "details-content disabled mt-10"
                          : "details-content mt-10"
                      }
                      onClick={() => {
                        if (selectedTraitsLists?.some((s) => s.trait_type === "TraitCount")) {
                          setSelectedTraitsLists([
                            ...selectedTraitsLists?.filter((f) => f.trait_type !== "TraitCount"),
                          ]);
                          return;
                        }
                        let newlist = {
                          trait_type: "TraitCount",
                          value: d,
                        };
                        setSelectedTraitsLists([...selectedTraitsLists, newlist]);
                      }}
                    >
                      <p>{d}</p>
                      <span>{traitCount[d]}</span>
                    </div>
                  );
                })}
              </div>
            </details>
          </div>
        )}
        <div className="mb-20">
          <h4 className="line p-10 mb-10">Traits</h4>
          {!location.pathname.includes("/traits") ? (
            networkTraits.map((netTraits, index) => {
              return (
                <React.Fragment key={index}>
                  <details className="details-tag">
                    <summary>{netTraits.category}</summary>
                    <div className="wrapper">
                      {netTraits?.lists?.map((list, j) => {
                        if (list.type === "occurences") return null;
                        return (
                          <div
                            key={j}
                            className={
                              selectedTraitsLists?.some(
                                (s) =>
                                  s.value?.toString()?.toLowerCase() ===
                                  list?.type?.toString()?.toLowerCase()
                              )
                                ? "details-content active"
                                : selectedTraitsLists?.some(
                                    (s) =>
                                      s.trait_type?.toString()?.toLowerCase() ===
                                      netTraits?.category?.toString()?.toLowerCase()
                                  )
                                ? "details-content disabled"
                                : "details-content"
                            }
                            onClick={() => {
                              if (
                                selectedTraitsLists?.some(
                                  (s) => s.trait_type === netTraits?.category
                                )
                              ) {
                                setSelectedTraitsLists([
                                  ...selectedTraitsLists?.filter(
                                    (f) => f.trait_type !== netTraits?.category
                                  ),
                                ]);
                                return;
                              }
                              let newlist = {
                                trait_type: netTraits?.category,
                                value: list?.type,
                              };
                              setSelectedTraitsLists([...selectedTraitsLists, newlist]);
                            }}
                          >
                            <p>{list.type}</p>
                            <span>{list.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                </React.Fragment>
              );
            })
          ) : (
            <div className="explore_traits">
              {networkTraits.map((title, i) => {
                return (
                  <button
                    key={i.toString()}
                    onClick={() => {
                      setCollectionValue({
                        trait_type: title.category,
                        values: title?.lists?.map((l) => l.type).filter((f) => f !== "occurences"),
                      });
                    }}
                    className={
                      collectionValue?.trait_type === title.category ? "active" : undefined
                    }
                  >
                    {title.category}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
