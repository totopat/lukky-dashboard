import React, { useState } from "react";
import logo from "./logo.png";
import Button from "@mui/material/Button";
import Right from "./Right";
import Swap from "./Swap";
import { chainID } from "./helper";

export default function Home({
  changeActive,
  active,
  price,
  pricePerToken,
  balance,
  lastBuyer,
  chainId,
  contractTokenBalance,
  usdEqui,
  luckZoneWinners,
  lastBuyers,
  walletbal,
  totalReflection,
  contractBnb,
  lastBuyerData,
  hardLimit,
  totalBuySell,
}) {
  const [swap, setswap] = useState(false);

  return (
    <div className="home">
      <section className="left">
        <img src={logo} alt="logo" style={{ maxHeight: "36px" }} />
        <p
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "#8094ae",
            letterSpacing: "0.2em",
          }}
        >
          CURRENT BALANCE
        </p>
        <p
          style={{
            fontSize: "1rem",
            fontWeight: "400",
            color: "#0971fe",
            marginTop: "0",
            marginBottom: "0",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>{balance}</span> LUKKY
        </p>
        <p style={{ marginTop: "0", color: "#526484", fontSize: "15px" }}>
          <span style={{ fontWeight: "700" }}>
            {parseFloat((balance / pricePerToken) * usdEqui).toFixed(2)}
          </span>{" "}
          USD ({parseFloat(balance / pricePerToken).toFixed(2)} BNB)
        </p>
        <div className="left_box">
          <div>
            <span style={{ color: "#8094ae", fontSize: "14px" }}>Price</span>
            <span
              style={{
                fontSize: "0.875 rem",
                color: "#526484",
                fontWeight: "400",
              }}
            >
              <span style={{ fontWeight: "700", color: "black" }}>{price}</span>{" "}
              LUKKY
            </span>
          </div>
          <div>
            <span style={{ color: "#8094ae", fontSize: "14px" }}>
              LUKKY/BNB
            </span>
            <span
              style={{
                fontSize: "0.865 rem",
                fontWeight: "700",
                color: "black",
              }}
            >
              {parseFloat(pricePerToken).toFixed(2)} LUKKY / 1 BNB
            </span>
          </div>
          <div>
            <span style={{ color: "#8094ae", fontSize: "13px" }}>
              Earned Rewards
            </span>
            <span
              style={{
                fontSize: "0.875 rem",
                fontWeight: "700",
                color: "black",
              }}
            >
              {Math.floor(totalBuySell) - balance} LUKKY
            </span>
          </div>
        </div>
        <Button
          onClick={() => changeActive()}
          variant="contained"
          style={{ margin: "25px auto", padding: "10px 25px" }}
        >
          {active && chainId === chainID ? "Connected" : "Connect"}
        </Button>
        <p
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "#8094ae",
            letterSpacing: "0.2em",
          }}
        >
          MENU
        </p>
        <div className="buttons">
          <button onClick={() => setswap(false)}>Dashboard</button>
          <button onClick={() => setswap(true)}>Swap</button>
        </div>
      </section>
      {swap ? (
        <Swap
          walletbal={walletbal}
          pricePerToken={pricePerToken}
          usdEqui={usdEqui}
          price={price}
        />
      ) : (
        <Right
          lastBuyer={lastBuyer}
          contractTokenBalance={contractTokenBalance}
          usdEqui={usdEqui}
          luckZoneWinners={luckZoneWinners}
          lastBuyers={lastBuyers}
          totalReflection={totalReflection}
          contractBnb={contractBnb}
          lastBuyerData={lastBuyerData}
          hardLimit={hardLimit}
        />
      )}
    </div>
  );
}
