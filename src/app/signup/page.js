"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import ProfileContractABI from "../abis/Profile.json";

export default function signup() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const PROFILE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROFILE_CONTRACT_ADDRESS;

  const TELOS_TESTNET_PARAMS = {
    chainId: "0x29", // Chain ID for Telos Testnet (41 in decimal)
    chainName: "Telos Testnet",
    rpcUrls: ["https://rpc.testnet.telos.net"],
    nativeCurrency: {
      name: "Telos",
      symbol: "TLOS",
      decimals: 18,
    },
    blockExplorerUrls: ["https://testnet.teloscan.io"],
  };

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
  
      if (ProfileContractABI?.abi && PROFILE_CONTRACT_ADDRESS) {
        const contractInstance = new web3Instance.eth.Contract(
          ProfileContractABI.abi,
          PROFILE_CONTRACT_ADDRESS
        );
        setContract(contractInstance);
      } else {
        setMessage("Profile ABI or contract address is missing or invalid.");
      }
    } else {
      setMessage("MetaMask is not installed. Please install it to continue.");
    }
  }, []);
  

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected.");

      // Switch to Telos Testnet
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [TELOS_TESTNET_PARAMS],
      });

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setMessage("Wallet connected: " + accounts[0]);
    } catch (error) {
      setMessage("Error connecting wallet: " + error.message);
    }
  };

  const signup = async () => {
    if (!username || !name) {
      setMessage("Please fill in both username and name fields.");
      return;
    }
  
    if (!contract) {
      setMessage("Contract not loaded.");
      return;
    }
  
    try {
      setMessage("Submitting transaction...");
      const gasPrice = await web3.eth.getGasPrice(); // Get the current gas price

      console.log("Gas Price:", gasPrice);
  
      await contract.methods
        .updateProfile(username, name)
        .send({ from: account, gasPrice }); // Specify gasPrice for legacy transactions
  
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile: " + error.message);
    }
  };  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sign Up</h1>
      <p>Network: Telos Testnet</p>
      <button onClick={connectWallet} style={{ marginBottom: "10px" }}>
        Connect Wallet
      </button>
      {account && <p>Connected Account: {account}</p>}

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={signup} style={{ marginLeft: "10px" }}>
          Sign Up
        </button>
      </div>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}
