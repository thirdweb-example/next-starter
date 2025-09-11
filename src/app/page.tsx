"use client";

import thirdwebIcon from "@public/thirdweb.svg";
import Image from "next/image";
import { 
  ConnectButton,
  useActiveAccount,
  useContract,
  useSendTransaction,
  useTokenBalance,
  useMarketplace,
  useListings,
  useNFTDrop,
  useOwnedNFTs
} from "thirdweb/react";
import { useState, useEffect } from "react";
import { client } from "./client";

// Add your supported tokens here
const TOKENS = [
  { symbol: "ETH", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
  { symbol: "ZAMN", address: "0x04E7ec1573937De178AFBf588b2e6189e66b807c", decimals: 18 },
  { symbol: "FBDC", address: "0x3049a1BB4D90038Fd98b17dF2609718a489795CF", decimals: 18 },
  { symbol: "FEM", address: "0x580d9E8FA7f8F85b1d27626d005A0290D1EC83bA", decimals: 18 },
  { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
  { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
  { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
  { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
  { symbol: "NEW", address: "0x74C93527aC3A8b1655B707e03eC49560EA04C7c9", decimals: 18 }, // Your new token
  { symbol: "UNI", address: "0x2046701A7DED2490515a98E8fEcb13A4B94dE37d", decimals: 18 }, // Uniswap token
];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4 gap-8">
      <Header />
      <ConnectButton client={client} />
      <CyberfamMembership />
      <PlatinumMembership />
      <FemprenoirAccess />
      <MintFromDrop />
      <ListNFTForSale />
      <MarketplaceListings />
      <MyNFTs />
      <ThirdwebResources />
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-blue-500"> Next.js </span>
      </h1>

      <p className="text-zinc-300 text-base">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
    </header>
  );
}

function ThirdwebResources() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 justify-center">
      <ArticleCard
        title="thirdweb SDK Docs"
        href="https://portal.thirdweb.com/typescript/v5"
        description="thirdweb TypeScript SDK documentation"
      />

      <ArticleCard
        title="Components and Hooks"
        href="https://portal.thirdweb.com/typescript/v5/react"
        description="Learn about the thirdweb React components and hooks in thirdweb SDK"
      />

      <ArticleCard
        title="thirdweb Dashboard"
        href="https://thirdweb.com/dashboard"
        description="Deploy, configure, and manage your smart contracts from the dashboard."
      />
    </div>
  );
}

function ArticleCard(props: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <a
      href={props.href + "?utm_source=next-template"}
      target="_blank"
      className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
    >
      <article>
        <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
        <p className="text-sm text-zinc-400">{props.description}</p>
      </article>
    </a>
  );
}

function MarketplaceListings() {
  const marketplaceAddress = "0x3E6e21fF8acb419458dd4E6D98647B45E00229f8";
  const marketplace = useMarketplace(marketplaceAddress);
  const { data: listings, isLoading, error } = useListings(marketplace);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [tx, setTx] = useState<string | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleBuy = async (listingId: string) => {
    setBuyingId(listingId);
    setBuyError(null);
    setTx(null);
    try {
      const txResult = await marketplace?.buyoutListing(listingId, 1);
      setTx(txResult?.receipt.transactionHash);
    } catch (e: any) {
      setBuyError(e.message || "Buy failed");
    }
    setBuyingId(null);
  };

  if (isLoading) return <div>Loading listings...</div>;
  if (error) return <div>Error loading listings: {error.message}</div>;
  if (!listings || listings.length === 0) return <div>No listings found.</div>;

  // Filter listings by search
  const filteredListings = listings.filter((listing) =>
    (listing.asset?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search NFTs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-white w-full max-w-xs"
      />
      <div className="grid gap-4 mt-8">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="border p-4 rounded">
            <div>
              <strong>{listing.asset?.name || "NFT"}</strong>
            </div>
            <div>
              Price: {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </div>
            <div>
              {/* Example: Display fee info if you store it in listing metadata */}
              Fee: {listing.metadata?.feeTier || "5"}%
            </div>
            {listing.asset?.image && (
              <img src={listing.asset.image} alt={listing.asset.name} width={100} />
            )}
            <button
              onClick={() => handleBuy(listing.id)}
              disabled={buyingId === listing.id}
              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              {buyingId === listing.id ? "Buying..." : "Buy"}
            </button>
            {tx && buyingId === null && (
              <p className="mt-2 text-green-400 text-sm">
                Bought! Tx:{" "}
                <a
                  href={`https://basescan.org/tx/${tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {tx.slice(0, 10)}...
                </a>
              </p>
            )}
            {buyError && (
              <p className="mt-2 text-red-400 text-sm">
                Error: {buyError}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MintFromDrop() {
  const dropAddress = "0xEDd22Fa609a3bcFc5172E6Ca7ed262cD85a025cA";
  const drop = useNFTDrop(dropAddress);
  const [isMinting, setIsMinting] = useState(false);
  const [tx, setTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currency, setCurrency] = useState(TOKENS[0].address);
  const [tokenPrice, setTokenPrice] = useState<string>("0");
  const [priceWarning, setPriceWarning] = useState<string | null>(null);

  useEffect(() => {
    // Welcome deal: $3 per NFT (6 tokens at $0.50 each) for your ERC20s for first month
    // After first month: increase price as needed (e.g., $6 per NFT = 12 tokens)
    const now = Date.now();
    const welcomeEnd = new Date("2025-11-01").getTime(); // adjust as needed

    // List your ERC20 addresses here
    const myTokens = [
      "0x04E7ec1573937De178AFBf588b2e6189e66b807c", // ZAMN
      "0x3049a1BB4D90038Fd98b17dF2609718a489795CF", // FBDC
      "0x580d9E8FA7f8F85b1d27626d005A0290D1EC83bA", // FEM
      "0x74C93527aC3A8b1655B707e03eC49560EA04C7c9", // NEW
      "0x2046701A7DED2490515a98E8fEcb13A4B94dE37d", // UNI
    ];
    const decimals = TOKENS.find(t => t.address.toLowerCase() === currency.toLowerCase())?.decimals || 18;

    if (myTokens.map(a => a.toLowerCase()).includes(currency.toLowerCase())) {
      // For your ERC20s
      setTokenPrice(
        now < welcomeEnd
          ? (6 * 10 ** decimals).toString() // 6 tokens ($3 at $0.50/token)
          : (12 * 10 ** decimals).toString() // 12 tokens ($6 at $0.50/token) after welcome
      );
      setPriceWarning(null);
    } else if (currency === "0x0000000000000000000000000000000000000000") {
      // For ETH: $3 per NFT for first month, $6 after (fetch ETH/USD price)
      // You can use a price oracle or set a fixed value for simplicity
      setPriceWarning("ETH price is not auto-updated. Please update manually for $3 equivalent.");
      setTokenPrice(
        now < welcomeEnd
          ? (0.001 * 10 ** decimals).toString() // Example: 0.001 ETH per NFT
          : (0.002 * 10 ** decimals).toString() // Example: 0.002 ETH per NFT after welcome
      );
    } else {
      // For stablecoins or others, set a fixed price or use USD logic
      setTokenPrice(
        now < welcomeEnd
          ? (3 * 10 ** decimals).toString() // $3 per NFT
          : (6 * 10 ** decimals).toString() // $6 per NFT after welcome
      );
      setPriceWarning("Check stablecoin price logic if needed.");
    }
  }, [currency]);

  const handleMint = async () => {
    setIsMinting(true);
    setError(null);
    setTx(null);
    try {
      const txResult = await drop?.claimTo?.(undefined, quantity, {
        currencyAddress: currency,
        pricePerToken: tokenPrice,
      });
      setTx(txResult?.receipt.transactionHash);
    } catch (e: any) {
      setError(e.message || "Mint failed");
    }
    setIsMinting(false);
  };

  const decimals = TOKENS.find(t => t.address === currency)?.decimals || 18;

  return (
    <div className="flex flex-col items-center my-6">
      <input
        type="number"
        min={1}
        max={100}
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        className="mb-2 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-white w-24 text-center"
      />
      <select
        value={currency}
        onChange={e => setCurrency(e.target.value)}
        className="mb-2 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-white w-32 text-center"
      >
        {TOKENS.map(token => (
          <option key={token.address} value={token.address}>{token.symbol}</option>
        ))}
      </select>
      <div className="mb-2 text-zinc-400 text-sm">
        Mint price: {tokenPrice !== "0" ? (
          <>
            {(parseFloat(tokenPrice) / 10 ** decimals).toFixed(6)}{" "}
            {TOKENS.find(t => t.address === currency)?.symbol}
          </>
        ) : (
          "N/A"
        )}
        {" "}per NFT
      </div>
      {priceWarning && (
        <div className="mb-2 text-yellow-400 text-xs">{priceWarning}</div>
      )}
      <button
        onClick={handleMint}
        disabled={isMinting || tokenPrice === "0"}
        className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors"
      >
        {isMinting ? `Minting...` : `Mint ${quantity} NFT${quantity > 1 ? "s" : ""}`}
      </button>
      {tx && (
        <p className="mt-2 text-green-400 text-sm">
          Minted! Tx:{" "}
          <a
            href={`https://basescan.org/tx/${tx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {tx.slice(0, 10)}...
          </a>
        </p>
      )}
      {error && (
        <p className="mt-2 text-red-400 text-sm">
          Error: {error}
        </p>
      )}
    </div>
  );
}

function ListNFTForSale() {
  const dropAddress = "0xEDd22Fa609a3bcFc5172E6Ca7ed262cD85a025cA";
  const marketplaceAddress = "0x3E6e21fF8acb419458dd4E6D98647B45E00229f8";
  const { contract: drop } = useContract(dropAddress, "nft-drop");
  const { contract: marketplace } = useContract(marketplaceAddress, "marketplace-v3");
  const account = useActiveAccount();
  const { data: nfts, isLoading } = useOwnedNFTs(drop, account?.address);
  const [selected, setSelected] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState(TOKENS[0].address);
  const [listingTx, setListingTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fee, setFee] = useState("5"); // Default 5% fee
  const [feeTier, setFeeTier] = useState("5"); // default 5%

  const handleList = async () => {
    if (!selected || !price || !marketplace) return;
    setError(null);
    setListingTx(null);
    try {
      const txResult = await marketplace.directListings.createListing({
        assetContractAddress: dropAddress,
        tokenId: selected,
        pricePerToken: price,
        currencyContractAddress: currency,
        quantity: 1,
        startTimestamp: new Date(),
        endTimestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        // Add fee info if your contract supports it
        // platformFeeBps: parseInt(fee) * 100, // e.g., 5% = 500 bps
      });
      setListingTx(txResult?.receipt.transactionHash);
    } catch (e: any) {
      setError(e.message || "Listing failed");
    }
  };

  if (!account) return null;
  if (isLoading) return <div>Loading your NFTs...</div>;
  if (!nfts || nfts.length === 0) return <div>You own no NFTs to list.</div>;

  return (
    <div className="my-8 p-4 border rounded">
      <h3 className="font-bold mb-2">List Your NFT for Sale</h3>
      <select
        value={selected || ""}
        onChange={e => setSelected(e.target.value)}
        className="mb-2 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-white"
      >
        <option value="">Select NFT</option>
        {nfts.map(nft => (
          <option key={nft.metadata.id} value={nft.metadata.id}>
            {nft.metadata.name || `NFT #${nft.metadata.id}`}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        className="mb-2 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-white ml-2"
      />
      <select
        value={currency}
        onChange={e => setCurrency(e.target.value)}
        className="mb-2 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-white ml-2"
      >
        {TOKENS.map(token => (
          <option key={token.address} value={token.address}>{token.symbol}</option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        max={100}
        placeholder="Fee (%)"
        value={fee}
        onChange={e => setFee(e.target.value)}
        className="mb-2 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-white ml-2"
      />
      <select
        value={feeTier}
        onChange={e => setFeeTier(e.target.value)}
        className="mb-2 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-white ml-2"
      >
        <option value="2">2% Fee</option>
        <option value="5">5% Fee</option>
        <option value="10">10% Fee</option>
      </select>
      <button
        onClick={handleList}
        disabled={!selected || !price}
        className="ml-2 bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800 transition-colors"
      >
        List NFT
      </button>
      {listingTx && (
        <p className="mt-2 text-green-400 text-sm">
          Listed! Tx:{" "}
          <a
            href={`https://basescan.org/tx/${listingTx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {listingTx.slice(0, 10)}...
          </a>
        </p>
      )}
      {error && (
        <p className="mt-2 text-red-400 text-sm">
          Error: {error}
        </p>
      )}
    </div>
  );
}

function CyberfamMembership() {
  const account = useActiveAccount();
  const { data: balance } = useTokenBalance("0x04E7ec1573937De178AFBf588b2e6189e66b807c", account?.address);

  if (!account) return null;
  if (!balance) return <div>Checking membership...</div>;

  const isMember = parseFloat(balance.displayValue) >= 100; // e.g., 100 ZAMN tokens

  return (
    <div className="my-4">
      {isMember ? (
        <div className="text-green-400 font-bold">Welcome, Cyberfam Member! 🎉</div>
      ) : (
        <div className="text-yellow-400">Hold 100+ ZAMN tokens to join Cyberfam!</div>
      )}
    </div>
  );
}

// Add this component for Platinum Membership (ERC1155)
function PlatinumMembership() {
  const platinumAddress = "0x4749cEE5b75a8303aC3D2AF46d673785b6aD7Aa";
  const { contract } = useContract(platinumAddress, "edition");
  const account = useActiveAccount();
  const { data: nfts } = useOwnedNFTs(contract, account?.address);

  // If user owns any Platinum NFT, they are a Platinum member
  const isPlatinum = nfts && nfts.length > 0;

  return (
    <div className="my-4">
      {isPlatinum ? (
        <div className="text-blue-400 font-bold">
          🏆 Platinum Member! Exclusive access unlocked.
        </div>
      ) : (
        <div className="text-gray-400">
          Earn Platinum status by collecting enough points!
        </div>
      )}
    </div>
  );
}
function FemprenoirAccess() {
  const femContract = useContract("0x4749cEE5b75a8303aC3D2AF46d673785b6aD7Aa", "edition");
  const account = useActiveAccount();
  const { data: femNFTs } = useOwnedNFTs(femContract.contract, account?.address);

  const ownsFEM = femNFTs && femNFTs.length > 0;

  return (
    <div className="my-4">
      {ownsFEM ? (
        <button className="bg-pink-600 text-white px-4 py-2 rounded">
          Access Femprenoir Features
        </button>
      ) : (
        <button className="bg-gray-400 text-white px-4 py-2 rounded" disabled>
          Mint or Buy FEM to Access Femprenoir
        </button>
      )}
    </div>
  );
}

function MyNFTs() {
  const dropAddress = "0xEDd22Fa609a3bcFc5172E6Ca7ed262cD85a025cA";
  const { contract } = useContract(dropAddress, "nft-drop");
  const account = useActiveAccount();
  const { data: nfts, isLoading } = useOwnedNFTs(contract, account?.address);

  if (!account) return null;
  if (isLoading) return <div>Loading your NFTs...</div>;
  if (!nfts || nfts.length === 0) return <div>You don't own any NFTs yet.</div>;

  return (
    <div className="my-8">
      <h3 className="font-bold mb-2">My NFTs</h3>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {nfts.map(nft => (
          <div key={nft.metadata.id} className="border p-2 rounded">
            <div>{nft.metadata.name || `NFT #${nft.metadata.id}`}</div>
            {nft.metadata.image && (
              <img src={nft.metadata.image} alt={nft.metadata.name} width={80} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// TODO: Add a Buy with Card / Fiat button here using Paper.xyz, Crossmint, or Stripe
