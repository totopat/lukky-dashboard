import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import truncate from "./truncate";
import axios from "axios";
import { useQuery } from "react-query";
import { TokenAddress } from "./helper";
import Tooltip from "@mui/material/Tooltip";

function createData(num, address, bnb, usd) {
  return { num, address, bnb, usd };
}
function createDatawithDate(num, date, address, bnb, usd) {
  return { num, date, address, bnb, usd };
}

export default function Right({
  lastBuyer,
  contractTokenBalance,
  usdEqui,
  luckZoneWinners,
  lastBuyers,
  totalReflection,
  contractBnb,
  lastBuyerData,
  hardLimit,
}) {
  const [luckyZW, setluckyZW] = useState([]);
  const [_lastBuyers, set_lastBuyers] = useState([]);
  const [Jackpot, setJackpot] = useState([]);
  const [dailyWinner, setdailyWinner] = useState([]);
  const [finaldailyWinner, setfinaldailyWinner] = useState([]);
  const [copied, setcopied] = useState(false);
  const [time, settime] = useState([0, 0]);
  const endpoint =
    "https://api.thegraph.com/subgraphs/name/black-fire07/jackpot";
  const Daily_QUERY = `
  {
    dailyWinners(first: 10, orderBy: time, orderDirection: desc) {
      user
      time
    }
  }
  `;
  const Jackpot_QUERY = `
  {
    jackpotWinners(first: 1, orderBy: time, orderDirection: desc) {
      user
      time
    }
  }
  `;

  const { Graphdata, isLoading, error } = useQuery("launches", async () => {
    const response = await axios({
      url: endpoint,
      method: "POST",
      data: {
        query: Daily_QUERY,
      },
    });

    const response2 = await axios({
      url: endpoint,
      method: "POST",
      data: {
        query: Jackpot_QUERY,
      },
    });

    setJackpot(response2.data.data["jackpotWinners"]);
    setdailyWinner(response.data.data["dailyWinners"]);
    return response.data.data;
  });

  const getdate = (time) => {
    let date = new Date(Number(time) * 1000);
    date = date.toDateString();
    date = date.split(" ");
    let finaldate = date[2] + ", " + date[1] + " " + date[3];
    return finaldate;
  };

  useEffect(() => {
    let temp1 = [],
      temp2 = [],
      temp3 = [];
    let bnb = parseFloat(25 / usdEqui).toFixed(2);
    for (let i = 0; i < luckZoneWinners.length; i++) {
      temp1.push(
        createData(
          i + 1,
          truncate(luckZoneWinners[i]),
          luckZoneWinners[i] === "0x0000000000000000000000000000000000000000"
            ? "0.00"
            : bnb,
          luckZoneWinners[i] === "0x0000000000000000000000000000000000000000"
            ? 0
            : 25
        )
      );
      temp2.push(
        createData(
          i + 1,
          truncate(lastBuyers[i]),
          luckZoneWinners[i] === "0x0000000000000000000000000000000000000000"
            ? "0.00"
            : bnb,
          luckZoneWinners[i] === "0x0000000000000000000000000000000000000000"
            ? 0
            : 25
        )
      );
    }
    for (let i = 0; i < dailyWinner.length; i++) {
      temp3.push(
        createDatawithDate(
          i + 1,
          getdate(dailyWinner[i].time),
          truncate(dailyWinner[i].user),
          parseFloat(100 / usdEqui).toFixed(2),
          100
        )
      );
    }
    setfinaldailyWinner(temp3);
    setluckyZW(temp1);
    set_lastBuyers(temp2);
  }, [lastBuyers]);

  const getTime = () => {
    let time = new Date().getTime();
    time = time - lastBuyer[1];
    time = time / 1000;
    let minutes = time / 60;
    let liveJackpot = lastBuyer[1] / 1000 + 600;
    liveJackpot = liveJackpot - new Date().getTime() / 1000;
    let liveJackpotmin = 0,
      liveJackpotsec = 0;
    if (liveJackpot > 0) {
      liveJackpotmin = liveJackpot / 60;
      liveJackpotsec = liveJackpot % 60;
    }
    settime([
      Math.floor(minutes),
      Math.floor(liveJackpotsec),
      Math.floor(liveJackpotmin),
    ]);
  };

  useEffect(() => {
    if (lastBuyer[1] > 0) {
      getTime();
    }
  }, [lastBuyer, new Date().getSeconds()]);

  return (
    <section className="right">
      <div className="goldBox">
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: "600",
            marginTop: "0",
            marginBottom: "4px",
          }}
        >
          Caution
        </p>
        <p style={{ marginBottom: "0", marginTop: "0" }}>
          (Please make sure you are visiting https://dashboard.lukkyverse.com)
        </p>
      </div>
      <h1
        style={{
          fontWeight: "700",
          letterSpacing: "0.02em",
          color: "#364a63",
          marginBottom: "0",
        }}
      >
        Dashboard
      </h1>
      <p style={{ color: "#8094ae" }}>Welcome to LUKKY dashboard</p>
      <div className="cards">
        <div>
          <h3 style={{ fontWeight: "700", color: "#364a63", marginTop: "0" }}>
            Live Jackpot
          </h3>
          <div className="card" style={{ backgroundColor: "#f4bd0e" }}>
            <p
              style={{
                fontSize: "2.25rem",
                fontWeight: "500",
                marginTop: "-0.125rem",
                marginBottom: "0",
              }}
            >
              ${parseFloat(contractBnb * usdEqui).toFixed(2)}
            </p>
            <div className="flx">
              <div>
                <p
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    paddingTop: "5px",
                    marginBottom: "0",
                  }}
                >
                  BNB
                </p>
                <p
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: "500",
                    margin: "0",
                  }}
                >
                  {contractBnb > 1
                    ? parseFloat(contractBnb).toFixed(2)
                    : parseFloat(contractBnb).toFixed(3)}
                </p>
              </div>
              <div style={{ paddingLeft: "20px" }}>
                <p
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    paddingTop: "5px",
                    marginBottom: "0",
                  }}
                >
                  LUKKY
                </p>
                <p
                  style={{
                    fontSize: "1 rem",
                    fontWeight: "700",
                  }}
                >
                  {contractTokenBalance}
                </p>
              </div>
            </div>
            <p
              style={{
                fontStyle: "italic",
                fontSize: "13px",
                fontWeight: "400",
              }}
            >
              Time Left: {time[2]} minutes {time[1]} seconds
            </p>
          </div>
        </div>
        <div>
          <h3 style={{ fontWeight: "700", color: "#364a63", marginTop: "0" }}>
            Winner's Share
          </h3>
          <div
            className="card"
            style={{ border: "1px solid #dbdfea", color: "#526484" }}
          >
            <p
              style={{
                fontSize: "2.25rem",
                fontWeight: "500",
                marginTop: "-0.125rem",
                marginBottom: "0",
              }}
            >
              ${parseFloat((contractBnb * usdEqui * 55) / 100).toFixed(2)}
            </p>
            <div className="flx">
              <div>
                <p
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    paddingTop: "5px",
                    marginBottom: "0",
                  }}
                >
                  BNB
                </p>
                <p
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: "500",
                    margin: "0",
                  }}
                >
                  {contractBnb > 1
                    ? parseFloat((contractBnb * 55) / 100).toFixed(2)
                    : parseFloat((contractBnb * 55) / 100).toFixed(3)}
                </p>
              </div>
              <div style={{ paddingLeft: "20px" }}>
                <p
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    paddingTop: "5px",
                    marginBottom: "0",
                  }}
                >
                  LUKKY
                </p>
                <p
                  style={{
                    fontSize: "1 rem",
                    fontWeight: "700",
                  }}
                >
                  {contractTokenBalance}
                </p>
              </div>
            </div>
            <p
              style={{
                fontStyle: "italic",
                fontSize: "13px",
                fontWeight: "400",
              }}
            >
              Previous Winner{" "}
              {Jackpot.length > 0 ? truncate(Jackpot[0].user) : "0x000...0000"}
            </p>
          </div>
        </div>
        <div>
          <h3 style={{ fontWeight: "700", color: "#364a63", marginTop: "0" }}>
            Last Buyer
          </h3>
          <div
            className="card"
            style={{ border: "1px solid #dbdfea", color: "#526484" }}
          >
            <p
              style={{
                fontSize: "2.25rem",
                fontWeight: "500",
                marginTop: "-0.125rem",
                marginBottom: "0",
              }}
            >
              {truncate(lastBuyer[0])}
            </p>
            <div className="flx">
              <div>
                <p
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    paddingTop: "5px",
                    marginBottom: "0",
                  }}
                >
                  BNB
                </p>
                <p
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: "500",
                    margin: "0",
                  }}
                >
                  {parseFloat(lastBuyerData[0]).toFixed(3)}
                </p>
              </div>
              <div style={{ paddingLeft: "20px" }}>
                <p
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    paddingTop: "5px",
                    marginBottom: "0",
                  }}
                >
                  LUKKY
                </p>
                <p
                  style={{
                    fontSize: "1 rem",
                    fontWeight: "700",
                  }}
                >
                  {parseFloat(lastBuyerData[1]).toFixed(2)}
                </p>
              </div>
            </div>
            <p
              style={{
                fontStyle: "italic",
                fontSize: "13px",
                fontWeight: "400",
              }}
            >
              Last buy at{" "}
              {new Date(lastBuyer[1]).toLocaleString().split(" ")[1]}
              {"  "}({time[0]} mins ago)
            </p>
          </div>
        </div>
      </div>
      <div className="progress">
        <h6>Lightning Strike Target: ${hardLimit * usdEqui}</h6>
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={3}>
            <LinearProgress
              variant="determinate"
              value={(contractBnb * 100) / hardLimit}
              style={{ height: "12px", borderRadius: "2px" }}
            />
          </Box>
          <Box minWidth={35}>
            <div>
              {(contractBnb * 100) / hardLimit > 1
                ? parseFloat((contractBnb * 100) / hardLimit).toFixed(2)
                : parseFloat((contractBnb * 100) / hardLimit).toFixed(4)}
              %
            </div>
          </Box>
        </Box>
        <p style={{ margin: "0", fontSize: "14px" }}>
          <i>
            Approximately 100,000,000 LUKKY (25 BNB / $25,000.00 USD) will be
            sent back to the community.
          </i>
        </p>
      </div>
      <p
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#364a63",
          marginBottom: "0.5rem",
        }}
      >
        The Lucky Zone
      </p>
      <p
        style={{
          marginTop: "0",
          color: "#526484",
          fontWeight: "450",
          fontSize: "0.875rem",
        }}
      >
        The last 12 qualified buys that is currenly within the lucky zone.
      </p>
      <TableContainer component={Paper} className="tableContainer">
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Address</TableCell>
              <TableCell align="left">BNB</TableCell>
              <TableCell align="left">USD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_lastBuyers.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.num}
                </TableCell>
                <TableCell align="left">{row.address}</TableCell>
                <TableCell align="left">{row.bnb}</TableCell>
                <TableCell align="left">{row.usd}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <h1
        style={{
          fontWeight: "700",
          fontSize: "1.7rem",
          color: "#364a63",
          marginBottom: "0.5rem",
        }}
      >
        Previous Lucky Buy Winners
      </h1>
      <div className="divider"></div>

      <p
        style={{
          fontSize: "1.2rem",
          fontWeight: "550",
          color: "#364a63",
          marginBottom: "0.5rem",
        }}
      >
        Jackpot Winner
      </p>
      <div className="winBox">
        <div style={{ marginBottom: "3px" }}>
          <span>
            {truncate(
              Jackpot.length > 0
                ? Jackpot[0].user
                : "0x000000000000000000000000"
            )}
          </span>
          <span style={{ fontSize: "1.125rem", fontWeight: "550" }}>
            {parseFloat((((contractBnb * 55) / 100) * 9) / 10).toFixed(3)} BNB
          </span>
        </div>
        <div>
          <span>
            Winning buy at{" "}
            {Jackpot.length > 0
              ? new Date(Number(Jackpot[0].time) * 1000)
                  .toGMTString()
                  .split(" ")[4]
              : "09:38:07 "}
            <span> </span>GMT (
            {Jackpot.length > 0 ? getdate(Jackpot[0].time) : " 13, May 2022"})
          </span>
          <span>
            {parseFloat(
              (((contractBnb * usdEqui * 55) / 100) * 9) / 10
            ).toFixed(2)}{" "}
            USD
          </span>
        </div>
      </div>
      <p
        style={{
          fontSize: "1.2rem",
          fontWeight: "550",
          color: "#364a63",
          marginBottom: "0.5rem",
        }}
      >
        Lucky Zone Winners
      </p>
      <TableContainer component={Paper} className="tableContainer">
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Address</TableCell>
              <TableCell align="left">BNB</TableCell>
              <TableCell align="left">USD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {luckyZW.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.num}
                </TableCell>
                <TableCell align="left">{row.address}</TableCell>
                <TableCell align="left">{row.bnb}</TableCell>
                <TableCell align="left">{row.usd}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p
        style={{
          fontSize: "1.2rem",
          fontWeight: "550",
          color: "#364a63",
          marginBottom: "0.5rem",
        }}
      >
        Daily Lukky Draw Winners ( Last 7 Days )
      </p>
      <TableContainer component={Paper} className="tableContainer">
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Address</TableCell>
              <TableCell align="left">BNB</TableCell>
              <TableCell align="left">USD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finaldailyWinner.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.num}
                </TableCell>
                <TableCell align="left">{row.date}</TableCell>
                <TableCell align="left">{row.address}</TableCell>
                <TableCell align="left">{row.bnb}</TableCell>
                <TableCell align="left">{row.usd}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="goldBox">
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: "600",
            marginTop: "0",
            color: "black",
          }}
        >
          Pot of Gold
        </p>
        <p>
          If the pot of gold reaches capacity without a lucky buy winner,
          lightning will strike the pot of gold hurling 50% of the gold coins
          back into the LukkySwap. The swap will purchase the native token in
          one single transaction causing an explosive green candle and
          distribute the LUKKY tokens to holders
        </p>
        <p style={{ marginBottom: "0" }}>
          If no one gets lucky, we all get LUKKY!
        </p>
      </div>
      <div className="reflection">
        <div className="ref_left">
          <h5>Contract</h5>
          <p>Click button to copy address into clipboard.</p>
          <h5>Lukkyverse ( LUKKY )</h5>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid #dbdfea",
              padding: "5px",
            }}
          >
            <input
              type="text"
              value={TokenAddress}
              style={{ fontSize: "13px" }}
            />
            <Tooltip title={!copied ? "Copy" : "Copied"}>
              <span
                style={{
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "skyblue",
                  fontWeight: "600",
                }}
                onClick={() => {
                  setcopied(true);
                  navigator.clipboard.writeText(TokenAddress);
                }}
              >
                COPY
              </span>
            </Tooltip>
          </div>
        </div>
        <div className="ref_right">
          <h5>Total Reflections Paid Out</h5>
          <p style={{ marginBottom: "0" }}>
            Total reflections for the life of the contract
          </p>
          <div className="treflect">
            <div>
              <span className="f">
                {parseFloat(totalReflection[0] / 1e9).toFixed(2)}
              </span>
              <span className="g">LUKKY</span>
            </div>
            <div>
              <span className="f">{totalReflection[1]}</span>
              <span className="g">USD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
