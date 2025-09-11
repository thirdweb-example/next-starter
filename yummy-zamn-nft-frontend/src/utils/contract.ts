import { ethers } from 'ethers';

// Define the contract address and ABI
const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
const contractABI = [
    // Add your contract's ABI here
];

// Create a provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Function to fetch NFT data
export const fetchNFTs = async () => {
    try {
        const nfts = await contract.getAllNFTs(); // Replace with your contract's method
        return nfts;
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
    }
};

// Function to handle NFT purchase
export const purchaseNFT = async (tokenId) => {
    try {
        const transaction = await contract.purchaseNFT(tokenId); // Replace with your contract's method
        await transaction.wait();
        console.log('NFT purchased successfully');
    } catch (error) {
        console.error('Error purchasing NFT:', error);
        throw error;
    }
};