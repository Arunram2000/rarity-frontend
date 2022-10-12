export interface statsProps {
  average_price: number;
  market_cap: number;
  num_owners: number;
  one_day_average_price: number;
  seven_day_average_price: number;
  thirty_day_average_price: number;
  one_day_change: number;
  seven_day_change: number;
  thirty_day_change: number;
  one_day_sales: number;
  seven_day_sales: number;
  thirty_day_sales: number;
  one_day_volume: number;
  seven_day_volume: number;
  thirty_day_volume: number;
  total_supply: number;
  total_volume: number;
  floor_price: number;
}

export interface CollectionProps {
  banner_image_url: string;
  image_url: string;
  collection_name: string;
  description: string;
  chain: string;
  marketplace_url: string;
  website_url: string;
  official_discord_url: string;
  official_instagram_url: string;
  medium_username: string;
  official_twitter_url: string;
  wiki_url: string;
  collection_contract_address: string;
  traits: any;
  opensea_compatible: boolean;
  stats: statsProps | null;
  allTraits: any;
  traitCount: any;
  createdAt: string;
  showRecentCollections: boolean;
  headerMenu: boolean;
  collection_slug: string;
}

export interface AttributesProps {
  trait_type: string;
  value: string;
  rarityScore: number;
  averageScore: number;
  statisticalScore: number;
}

export interface CardProps {
  rank: number;
  rarity: number;
  average: number;
  statistical: number;
  trait_count: number;
  tokenId: string;
  image: string;
  attributes: AttributesProps[];
  objectId: string;
  name: string;
}

export interface AdminProps {
  showRecentCollections: boolean;
  headerMenu: boolean;
  showNewestCollections: boolean;
}
