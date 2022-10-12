import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { CollectionProps } from "../../../store/types";

const CollectionDetails: React.FC<CollectionProps> = ({
  banner_image_url,
  collection_name,
  description,
  stats,
  official_discord_url,
  official_twitter_url,
  official_instagram_url,
  website_url,
  image_url,
}) => {
  const { collection } = useParams();
  const location = useLocation();
  return (
    <div className="collection_details">
      <div className="collection_details-content">
        <div className="banner">
          <img src={banner_image_url} alt="banner_image_url" />
        </div>
      </div>
      <div className="pl-32 pr-32">
        <div className="content-title pb-15 mb-15 line">
          <div className="content_title-profile">
            <img src={image_url} alt={collection_name} />
            <h2>{collection_name}</h2>
          </div>
          <div>
            <Link
              to={`/${collection}`}
              className={
                location.pathname.includes("/traits") || location.pathname.includes("/wallet")
                  ? "navlink"
                  : "navlink active"
              }
            >
              View collection
            </Link>
            <Link
              to={`/${collection}/traits`}
              className={!location.pathname.includes("/traits") ? "navlink" : "navlink active"}
            >
              Explore Traits
            </Link>
            <Link
              to={`/${collection}/wallet`}
              className={!location.pathname.includes("/wallet") ? "navlink" : "navlink active"}
            >
              My wallet
            </Link>
          </div>
        </div>
        <div className="content-description">
          <div>
            <h4 className="mb-10">Description</h4>
            <p className="mb-10">{description}</p>
            <div className="social-links">
              {website_url && (
                <a href={website_url} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              )}
              {official_discord_url && (
                <a href={official_discord_url} target="_blank" rel="noopener noreferrer">
                  Discord
                </a>
              )}
              {official_twitter_url && (
                <a href={official_twitter_url} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              {official_instagram_url && (
                <a href={official_instagram_url} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
            </div>
          </div>
          <div className="flex">
            {stats && (
              <>
                <div>
                  <h4>Total Volume</h4>
                  <p>
                    {new Intl.NumberFormat("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(stats.total_volume)}{" "}
                    ETH
                  </p>
                </div>
                <div>
                  <h4>Owners</h4>
                  <p>{stats.num_owners}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetails;
