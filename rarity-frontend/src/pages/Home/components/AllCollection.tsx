import React from "react";
import moment from "moment";

import "../../../styles/pages/home.scss";
import { Link } from "react-router-dom";

const AllCollection: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="allcollection">
      <table>
        <thead>
          <tr>
            <th>Collection</th>
            <th>Volume (All Time)</th>
            <th>Sales (All Time)</th>
            <th>Total Supply</th>
            <th>Owners</th>
            <th>Owners %</th>
            {/* <th>Estimated Market Cap</th> */}
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {data
            ?.filter(
              (collection: any) =>
                collection.opensea_compatible === true && collection.stats !== null
            )
            ?.map((data: any, index: number) => {
              return (
                <tr key={index.toString()}>
                  <td>
                    <Link
                      to={`/${data.collection_slug}`}
                      style={{ display: "flex", alignItems: "center", gridGap: 5 }}
                    >
                      <img
                        src={data.image_url}
                        alt={data.name}
                        width={24}
                        height={24}
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                      />
                      <h3>{data.collection_name}</h3>
                    </Link>
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(data.stats.total_volume)}{" "}
                    ETH
                  </td>
                  <td>{data.stats.total_sales}</td>
                  <td>{data.stats.total_supply}</td>
                  <td>{data.stats.num_owners}</td>
                  <td>
                    {new Intl.NumberFormat("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format((data.stats.num_owners / data.stats.total_supply) * 100)}
                    %
                  </td>
                  {/* <td>677,343.87 ETH</td> */}
                  <td>{moment(data?.createdAt).format("L")}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default AllCollection;
