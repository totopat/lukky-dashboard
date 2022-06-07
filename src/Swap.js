import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import bnblogo from "./bnb.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  borderRadius: "5px",
  boxShadow: 24,
  p: 2,
};

export default function Swap({
  walletbal,
  pricePerToken,
  usdEqui,
  price,
  swapEthtoLUKKY,
  swapLUKKYToEth,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [slippage, setslippage] = useState(12);
  const [tdeadline, settdeadline] = useState(20);
  const [reverse, setreverse] = useState(false);
  const [LUKKY, setLUKKY] = useState(0);
  const [bnb, setbnb] = useState(0);

  const swapBnbtoLUKKY = () => {
    let _tokens = (LUKKY * (100 - slippage)) / 100;
    _tokens = Math.floor(_tokens * 1e9);
    let currentTime = Math.round(new Date().getTime() / 1000);
    let deadline = currentTime + tdeadline * 60;
    // swapEthtoLUKKY(bnb, _tokens, deadline);
  };

  const swapLUKKYtobnb = () => {
    let _tokens = Math.floor(LUKKY * 1e9);
    let currentTime = Math.round(new Date().getTime() / 1000);
    let deadline = currentTime + tdeadline * 60;
    // swapLUKKYToEth(bnb, _tokens, deadline);
  };

  return (
    <section className="right" style={{ textAlign: "center" }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal">
          <div>
            <span style={{ fontSize: "20px", fontWeight: "700" }}>
              Settings
            </span>
            <CancelIcon
              className="cross"
              onClick={() => handleClose()}
              style={{ cursor: "pointer" }}
            />
          </div>
          <hr />
          <p style={{ fontWeight: "600" }}>Slippage Tolerance</p>
          <div>
            <button onClick={() => setslippage(0.1)}>0.1%</button>
            <button onClick={() => setslippage(0.5)}>0.5%</button>
            <button onClick={() => setslippage(12)}>12%</button>
            <input
              type="number"
              value={slippage}
              onChange={(e) => setslippage(e.target.value)}
            />
            <span style={{ alignSelf: "center" }}>%</span>
          </div>
          <p style={{ fontWeight: "600" }}>Transaction deadline</p>
          <div className="tdeadline">
            <input
              type="number"
              value={tdeadline}
              onChange={(e) => settdeadline(e.target.value)}
            />
            <span style={{ alignSelf: "center" }}>minutes</span>
          </div>
        </Box>
      </Modal>
      <p style={{ fontSize: "2.5rem", fontWeight: "400" }}>LukkySwap</p>

      <div className="swap">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p
            style={{
              textAlign: "left",
              color: "#344357",
              fontWeight: "500",
              marginBottom: "10px",
            }}
          >
            From
          </p>
          <SettingsIcon
            style={{ alignSelf: "center", cursor: "pointer" }}
            onClick={() => handleOpen()}
          />
        </div>
        <div className="swap_div">
          {!reverse ? (
            <>
              <input
                type="number"
                value={bnb > 0 ? bnb : null}
                onChange={(e) => {
                  setbnb(e.target.value);

                  setLUKKY(pricePerToken * e.target.value);
                  // console.log(pricePerToken * e.target.value);
                }}
              />

              <div>
                <img src={bnblogo} height="22vh" />
                <span style={{ paddingLeft: "4px" }}>BNB</span>
              </div>
            </>
          ) : (
            <>
              <input
                type="number"
                value={LUKKY > 0 ? LUKKY : null}
                onChange={(e) => {
                  setLUKKY(e.target.value);
                  setbnb(e.target.value / pricePerToken);
                }}
              />
              <div>
                <img src={bnblogo} height="22vh" />
                <span style={{ paddingLeft: "4px" }}>LUKKY</span>
              </div>
            </>
          )}
        </div>
        <div className="LUKKYBal">
          <span>sValue: ${!reverse ? bnb * usdEqui : LUKKY * price} USD</span>
          <span>Balance: {parseFloat(walletbal / 1e18).toFixed(2)} BNB</span>
        </div>
        <div>
          <KeyboardArrowDownIcon
            style={{ marginTop: "5px", cursor: "pointer" }}
            onClick={() => setreverse(!reverse)}
          />
        </div>
        <p
          style={{
            textAlign: "left",
            color: "#344357",
            fontWeight: "500",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          To
        </p>
        <div className="swap_div">
          {reverse ? (
            <>
              <input
                type="number"
                value={bnb > 0 ? bnb : null}
                onChange={(e) => {
                  setbnb(e.target.value);
                  setLUKKY(pricePerToken * e.target.value);
                }}
              />
              <div>
                <img src={bnblogo} height="22vh" />
                <span style={{ paddingLeft: "4px" }}>BNB</span>
              </div>
            </>
          ) : (
            <>
              <input
                type="number"
                value={LUKKY > 0 ? LUKKY : null}
                onChange={(e) => {
                  setLUKKY(e.target.value);
                  setbnb(e.target.value / pricePerToken);
                }}
              />

              <div>
                <img src={bnblogo} height="22vh" />
                <span style={{ paddingLeft: "4px" }}>LUKKY</span>
              </div>
            </>
          )}
        </div>
        <div className="LUKKYBal">
          <span>
            EST: {(LUKKY * (100 - slippage)) / 100} LUKKY (after {slippage}% buy
            tax)
          </span>
          <span>1 LUKKY = ${price} USD</span>
        </div>
        <span className="Lspan">sPrice: {LUKKY * price} LUKKY</span>
        <Button
          variant="contained"
          onClick={() => {
            if (!reverse) {
              swapBnbtoLUKKY();
            } else {
              swapLUKKYtobnb();
            }
          }}
        >
          SWAP
        </Button>
      </div>
    </section>
  );
}
