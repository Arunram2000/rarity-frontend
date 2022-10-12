import axios from "axios";

// export const API = axios.create({ baseURL: "http://localhost:5000" });
export const API = axios.create({ baseURL: "https://nft-rarity-backend.herokuapp.com" });

export const fetcher = (url: any) => API.get(url).then((res) => res.data);

export const addCollectionApi = (formData: any) => API.post("/collection/create", formData);

export const getAdminSettingsApi = () => API.get("/admin");

export const getNftApi = (address: string, formData: any) =>
  API.get(
    `/collection/getNft/${address}?chain=${formData?.chain}&token_address=${formData?.token_address}&collection_slug=${formData?.collection_slug}`
  );
