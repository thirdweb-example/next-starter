import React, { useEffect, useState } from 'react';
import NftCard from '../components/NftCard';
import { fetchNfts } from '../utils/contract';

const Marketplace: React.FC = () => {
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadNfts = async () => {
            try {
                const nftData = await fetchNfts();
                setNfts(nftData);
            } catch (error) {
                console.error("Error fetching NFTs:", error);
            } finally {
                setLoading(false);
            }
        };

        loadNfts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Marketplace</h1>
            <div className="nft-grid">
                {nfts.map((nft) => (
                    <NftCard key={nft.id} nft={nft} />
                ))}
            </div>
        </div>
    );
};

export default Marketplace;