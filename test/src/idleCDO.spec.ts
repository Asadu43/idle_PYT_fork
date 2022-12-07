import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { Contract, BigNumber, Signer, utils, constants } from "ethers";
import { parseEther, poll } from "ethers/lib/utils";
import hre, { ethers, network } from "hardhat";
import { Impersonate } from "../utils/utilities";

const UNISWAPV2_FACTORY = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const USDC_TOKEN = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WETH_TOKEN = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const ADAI_V2 = "0x028171bCA77440897B824Ca71D1c56caC55b68A3";

const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const HDRN = "0xF2E3A6Ba8955B345a88E5013D9a299c0E83a787e";

const BUSD = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";
const RAI = "0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919";
const BAT = "0x7abE0cE388281d2aCF297Cb089caef3819b13448";
const aToken = "0x030ba81f1c18d280636f32af80b9aad02cf0854e";
const AWETH_V2 = "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e";

describe.only("Idle Token", function () {
  let signer: SignerWithAddress;
  let user: SignerWithAddress;

  let idleCDO: Contract;
  let token: Contract;

  before(async () => {
    user = await Impersonate("0x1B7BAa734C00298b9429b518D621753Bb0f6efF2");
    signer = await Impersonate("0x10bf1Dcb5ab7860baB1C3320163C6dddf8DCC0e4");

    hre.tracer.nameTags[signer.address] = "ADMIN";

    idleCDO = await ethers.getContractAt("IIdleCDO", "0x46c1f702A6aAD1Fd810216A5fF15aaB1C62ca826", signer);

    token = await ethers.getContractAt("IERC20", DAI);
  });

  it("Should Revert : Because Not Approve", async () => {
    await expect(idleCDO.connect(user).depositAA(parseEther("10"))).to.be.revertedWith("Dai/insufficient-allowance");
  });

  it("Deposit AA ", async () => {
    await token.connect(user).approve(idleCDO.address, parseEther("100000"));

    await idleCDO.connect(user).depositAA(parseEther("10"));
  });

  it("Withdraw AA", async () => {
    await idleCDO.connect(user).withdrawAA(parseEther("5"));
  });

  it("Deposit BB", async () => {
    await idleCDO.connect(user).depositBB(parseEther("10"));
  });

  it("Withdraw BB", async () => {
    await idleCDO.connect(user).withdrawBB(parseEther("5"));
  });

  it("Check Address OF AA Tranche", async () => {
    console.log(await idleCDO.AATranche());
  });

  it("Check Address OF AA Tranche", async () => {
    console.log(await idleCDO.BBTranche());
  });

  it("Check Address OF Strategy Token", async () => {
    console.log(await idleCDO.strategyToken());
  });
});
