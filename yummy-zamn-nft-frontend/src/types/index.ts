export interface Nft {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    owner: string;
    price: number;
}

export interface Marketplace {
    nfts: Nft[];
    fetchNfts: () => Promise<Nft[]>;
}

export interface Transaction {
    from: string;
    to: string;
    nftId: string;
    amount: number;
    timestamp: Date;
}