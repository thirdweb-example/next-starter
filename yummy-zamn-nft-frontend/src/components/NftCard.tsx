import React from 'react';

interface NftCardProps {
    title: string;
    imageUrl: string;
    description: string;
    price: number;
}

const NftCard: React.FC<NftCardProps> = ({ title, imageUrl, description, price }) => {
    return (
        <div className="nft-card">
            <img src={imageUrl} alt={title} className="nft-image" />
            <h3 className="nft-title">{title}</h3>
            <p className="nft-description">{description}</p>
            <p className="nft-price">{price} ETH</p>
        </div>
    );
};

export default NftCard;