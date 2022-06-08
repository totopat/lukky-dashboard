import React, { useEffect, useState } from "react";
import "./App.css";
import Web3Modal from "web3modal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import axios from "axios";
import { useQuery } from "react-query";
import Home from "./Home";
import routerAbi from 'config/abi/unirouter.json'
import lukkyAbi from 'config/abi/lukky.json'
import {
  chainID,
  TokenAddress,
  pancakerouterv2,
} from "config/constants";

let web3Modal: Web3Modal;
let web3: any;
let provider;

async function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: "https://bsc-dataseed.binance.org/",
        },
        network: "Binance",
      },
    },
  };

  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
  });
}

function App() {
  const [address, setaddress] = useState(
    "0x0000000000000000010000000000000000000000"
  );
  const [chainId, setchainId] = useState(0);
  const [Token, setToken] = useState<any>({});
  const [active, setactive] = useState(false);
  const [currentBalance, setcurrentBalance] = useState(0);
  const [price, setprice] = useState(0);
  const [pricePerToken, setpricePerToken] = useState(0);
  const [lastBuyer, setlastBuyer] = useState([
    "0x0000000000000000000000000000000000000000",
    0,
  ]);
  const [contractTokenBalance, setcontractTokenBalance] = useState(0);
  const [usdEqui, setusdEqui] = useState(0);
  const [luckZoneWinners, setluckZoneWinners] = useState<any[]>([]);
  const [lastBuyers, setlastBuyers] = useState<any[]>([]);
  const [walletbal, setwalletbal] = useState(0);
  const [router, setrouter] = useState<any>({});
  const [totalReflection, settotalReflection] = useState([0, 0]);
  const [contractBnb, setcontractBnb] = useState(0);
  const [lastBuyerData, setlastBuyerData] = useState<number[]>([]);
  const [hardLimit, sethardLimit] = useState(0);
  const [totalBuySell, settotalBuySell] = useState<number | undefined>();

  const endpoint =
    "https://api.thegraph.com/subgraphs/name/black-fire07/jackpot";

  const transfers = `
    {
      transfers(where :{id : "${address}"}) {
        sent
        received
      }
    }
    `;

  const { refetch } = useQuery("key", async () => {
    const response = await axios({
      url: endpoint,
      method: "POST",
      data: {
        query: transfers,
      },
    });
    if (response.data.data["transfers"].length > 0) {
      let sent = Number(response.data.data["transfers"][0].sent);
      let received = Number(response.data.data["transfers"][0].received);
      settotalBuySell(received - sent);
    } else {
      settotalBuySell(0);
    }

    return response.data.data;
  });

  async function fet() {
    await init();
    await loadBlockdata();
  }

  useEffect(() => {
    if (active) {
      fet();
    }
  }, [active]);

  const loadBlockdata = async () => {
    try {
      provider = await web3Modal.connect();
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      return;
    }
    web3 = new Web3(provider);

    loadBlockdat();
  };

  const loadBlockdat = async () => {
    let chain;
    await web3.eth.getChainId().then((values: number) => {
      setchainId(values);
      chain = values;
    });

    if (chain == chainID) {
      const accounts = await new web3.eth.getAccounts();
      await new web3.eth.getBalance(accounts[0]).then((val: number) => {
        setwalletbal(val);
      });

      await new web3.eth.getBalance(TokenAddress).then((val: number) => {
        setcontractBnb(val / 1e18);
      });
      setaddress(accounts[0]);
      const token = new web3.eth.Contract(lukkyAbi, TokenAddress);
      setToken(token);
      const _router = new web3.eth.Contract(routerAbi, pancakerouterv2);
      setrouter(_router);
      const bal = await token.methods.balanceOf(accounts[0]).call();
      setcurrentBalance(Math.floor(bal / 1e9));

      const _pricePerToken = await _router.methods
        .getAmountsOut("1000000000000000000", [
          "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          "0xdC7CF330750361C62920391E76aB52Ae9E25b70D",
        ])
        .call();
      setpricePerToken(Number(_pricePerToken[1]) / 1e9);

      const contractBalance = await token.methods
        .balanceOf(TokenAddress)
        .call();
      setcontractTokenBalance(contractBalance / 1e9);

      const reflection = await token.methods.totalFees().call();

      const test = await _router.methods
        .getAmountsIn(reflection, [
          "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          "0xdC7CF330750361C62920391E76aB52Ae9E25b70D",
        ])
        .call();

      const usdEquivalent = await token.methods.usdEquivalent(1).call();
      setusdEqui(usdEquivalent);
      const finalPrice = Number(usdEquivalent) / Number(_pricePerToken[1]);
      setprice(finalPrice);
      let tfUsd = (test[0] / 1e18) * usdEquivalent;
      let tsUsd;
      if (tfUsd > 1) {
        tsUsd = tfUsd.toFixed(2);
      } else {
        tsUsd = tfUsd.toFixed(5);
      }
      settotalReflection([reflection, tfUsd]);
      let _luckyZoneWinners = [];

      for (let i = 0; i < 12; i++) {
        _luckyZoneWinners.push(await token.methods.lastWinners(i).call());
      }
      setluckZoneWinners(_luckyZoneWinners);

      let _lastBuyers = [];

      for (let i = 0; i < 12; i++) {
        _lastBuyers.push(await token.methods.lastBuyers(i).call());
      }
      setlastBuyers(_lastBuyers);

      const _lastBuyer = await token.methods._lastBuyer().call();
      const _lastBuyerTime = await token.methods._lastBuyTimestamp().call();
      setlastBuyer([_lastBuyer, Number(_lastBuyerTime) * 1000]);

      const lastBuyerBal = await token.methods.balanceOf(_lastBuyer).call();

      await new web3.eth.getBalance(_lastBuyer).then((val: number) => {
        setlastBuyerData([val / 1e18, lastBuyerBal / 1e9]);
      });

      const jackpotHardLimit = await token.methods.jackpotHardLimit().call();
      sethardLimit(Math.floor(jackpotHardLimit / 1e18));
      await refetch();
    } else {
      setactive(false);
      alert("Connect to BSC");
    }

    return;
  };

  setInterval(async () => {
    if (
      Token.methods !== undefined &&
      router.methods !== undefined &&
      address !== "0x0000000000000000000000000000000000000000"
    ) {
      const contractBalance = await Token.methods
        .balanceOf(TokenAddress)
        .call();
      setcontractTokenBalance(Number(contractBalance) / 1e9);
      const reflection = await Token.methods.totalFees().call();

      const test = await router.methods
        .getAmountsIn(reflection, [
          "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          "0xdC7CF330750361C62920391E76aB52Ae9E25b70D",
        ])
        .call();

      let tfUsd: number = (test[0] / 1e18) * usdEqui;
      let tsUsd;
      if (tfUsd > 1) {
        tsUsd = tfUsd.toFixed(2);
      } else {
        tsUsd = tfUsd.toFixed(5);
      }
      settotalReflection([reflection, tsUsd]);

      const _lastBuyer = await Token.methods._lastBuyer().call();
      const _lastBuyerTime = await Token.methods._lastBuyTimestamp().call();
      setlastBuyer([_lastBuyer, Number(_lastBuyerTime) * 1000]);

      const lastBuyerBal = await Token.methods.balanceOf(_lastBuyer).call();

      await new web3.eth.getBalance(_lastBuyer).then((val: number) => {
        setlastBuyerData([val / 1e18, lastBuyerBal / 1e9]);
      });
    }
  }, 30000);

  useEffect(() => {
    async function setValues() {
      if (lastBuyer[1] > 0) {
        let _lastBuyers = [];

        for (let i = 0; i < 12; i++) {
          _lastBuyers.push(await Token.methods.lastBuyers(i).call());
        }
        setlastBuyers(_lastBuyers);
        let _luckyZoneWinners = [];

        for (let i = 0; i < 12; i++) {
          _luckyZoneWinners.push(await Token.methods.lastWinners(i).call());
        }
        setluckZoneWinners(_luckyZoneWinners);
      }
    }

    setValues();
  }, [lastBuyer[1]]);

  const changeActive = () => {
    setactive(!active);
  };

  return (
    <>
      <Home
        changeActive={changeActive}
        active={active}
        price={Number(price)}
        pricePerToken={pricePerToken}
        balance={currentBalance}
        lastBuyer={lastBuyer}
        chainId={chainId}
        contractTokenBalance={Number(contractTokenBalance)}
        usdEqui={Number(usdEqui)}
        luckZoneWinners={luckZoneWinners}
        lastBuyers={lastBuyers}
        walletbal={walletbal}
        totalReflection={totalReflection}
        contractBnb={contractBnb}
        lastBuyerData={lastBuyerData}
        hardLimit={hardLimit}
        totalBuySell={totalBuySell}
      />
    </>
  );
}

export default App;
