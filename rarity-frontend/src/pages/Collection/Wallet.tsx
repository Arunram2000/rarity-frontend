import React, { useCallback, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getNftApi } from "../../api";
import { Button } from "../../components";
import { CardProps } from "../../store/types";
import "react-lazy-load-image-component/src/effects/blur.css";

interface WalletProps {
  chain: string;
  collection_slug: string;
  token_address: string;
}

const { ethereum } = window as any;

const Wallet: React.FC<WalletProps> = ({ chain, collection_slug, token_address }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [userData, setUserData] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetNft = useCallback(async () => {
    if (address) {
      setLoading(true);
      try {
        const { data } = await getNftApi(address, { chain, collection_slug, token_address });
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    handleGetNft();
  }, [handleGetNft]);

  const handleConnect = async () => {
    if (!ethereum) {
      alert("Install Metamask to see your Nfts on this collection");
      return;
    }

    const accounts = await ethereum?.request({ method: "eth_requestAccounts" });
    setAddress(accounts?.[0]);
  };

  const checkIfWalletConnected = async () => {
    if (!ethereum) return;

    const accounts = await ethereum?.request({ method: "eth_accounts" });
    setAddress(accounts?.[0]);
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <div className="pad pb-20 pt-20">
      <Button
        style={{
          padding: "8px 1em",
          fontSize: 16,
          fontWeight: 600,
          whiteSpace: "pre-wrap",
          borderRadius: 8,
        }}
        onClick={!address ? () => handleConnect() : undefined}
      >
        {address
          ? `${address.slice(0, 8)}...${address.slice(address.length - 8)}`
          : " Connect wallet to view your Nfts"}
      </Button>
      {address && (
        <>
          {loading ? (
            <div className="loader" style={{ minHeight: 200 }}>
              <h4>Loading...</h4>
            </div>
          ) : (
            <>
              {!userData.length ? (
                <div className="loader" style={{ minHeight: 200 }}>
                  <h4>No Nfts found on this collection</h4>
                </div>
              ) : (
                <div className="collection_card_wrapper mt-20">
                  {userData.map((col, index) => {
                    return (
                      <div key={index} className="collection_card">
                        <div>
                          <h4>#{col.rank}</h4>
                        </div>
                        <div className="image mt-10 mb-10">
                          <LazyLoadImage alt={col.tokenId} effect="blur" src={col.image} />
                        </div>
                        <div>
                          <h5>{col.tokenId}</h5>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Wallet;
