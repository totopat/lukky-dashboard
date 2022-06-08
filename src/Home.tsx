import React, { useState } from "react";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Right from "./Right";
import Swap from "./Swap";
import { chainID } from "config/constants";
import logo from "./logo.png";

interface Props {
  changeActive: () => void,
  active: boolean,
  price: number,
  pricePerToken: number,
  balance: number,
  lastBuyer: any,
  chainId: number,
  contractTokenBalance: number,
  usdEqui: number,
  luckZoneWinners: any,
  lastBuyers: string[],
  walletbal: number,
  totalReflection: number[],
  contractBnb: any,
  lastBuyerData: any,
  hardLimit: number,
  totalBuySell: any,
};


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
}: Props) {

  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [swap, setswap] = useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const clickConnect = () => {
    setMobileOpen(false);
    changeActive();
  };

  const clickDashboard = () => {
    setMobileOpen(false);
    setswap(false);
  };

  const clickSwap = () => {
    setMobileOpen(false);
    setswap(true);
  };;

  const drawer = (
    <div>

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
          {((balance / pricePerToken) * usdEqui).toFixed(2)}
        </span>{" "}
        USD ({(balance / pricePerToken).toFixed(2)} BNB)
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
            {(pricePerToken).toFixed(2)} LUKKY / 1 BNB
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
        onClick={() => clickConnect()}
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
        <button onClick={() => clickDashboard()}>Dashboard</button>
        <button onClick={() => clickSwap()}>Swap</button>
      </div>
    </div>
  )

  return (
    <div className="home">
      <Box
        component="nav"
        sx={{ width: { md: '0', lg: '25%' }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              display: 'block',
              boxSizing: 'border-box',
              width: '350px',
              padding: '25px',
              backgroundColor: '#e5e9f2',
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: '25%',
                padding: '25px',
                backgroundColor: '#e5e9f2',

                '@media screen and (max-width: 1200px)': {
                  width: '350px', 
                }
              },
            }}
            open
          >
            {drawer}
        </Drawer>
      </Box>

      <section className="right">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

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
      </section>
    </div>
  );
}
