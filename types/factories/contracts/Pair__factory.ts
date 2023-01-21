/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Pair, PairInterface } from "../../contracts/Pair";

const _abi = [
  "constructor()",
  "event Approval(address indexed,address indexed,uint256)",
  "event Burn(address indexed,uint256,uint256,address indexed)",
  "event Claim(address indexed,address indexed,uint256,uint256)",
  "event Fees(address indexed,uint256,uint256)",
  "event Mint(address indexed,uint256,uint256)",
  "event Swap(address indexed,uint256,uint256,uint256,uint256,address indexed)",
  "event Sync(uint256,uint256)",
  "event Transfer(address indexed,address indexed,uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function blockTimestampLast() view returns (uint256)",
  "function burn(address) returns (uint256, uint256)",
  "function claimFees() returns (uint256, uint256)",
  "function claimable0(address) view returns (uint256)",
  "function claimable1(address) view returns (uint256)",
  "function current(address,uint256) view returns (uint256)",
  "function currentCumulativePrices() view returns (uint256, uint256, uint256)",
  "function decimals() view returns (uint8)",
  "function fees() view returns (address)",
  "function getAmountOut(uint256,address) view returns (uint256)",
  "function getReserves() view returns (uint256, uint256, uint256)",
  "function index0() view returns (uint256)",
  "function index1() view returns (uint256)",
  "function lastObservation() view returns (tuple(uint256,uint256,uint256))",
  "function metadata() view returns (uint256, uint256, uint256, uint256, bool, address, address)",
  "function mint(address) returns (uint256)",
  "function name() view returns (string)",
  "function nonces(address) view returns (uint256)",
  "function observationLength() view returns (uint256)",
  "function observations(uint256) view returns (uint256, uint256, uint256)",
  "function permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
  "function prices(address,uint256,uint256) view returns (uint256[])",
  "function quote(address,uint256,uint256) view returns (uint256)",
  "function reserve0() view returns (uint256)",
  "function reserve0CumulativeLast() view returns (uint256)",
  "function reserve1() view returns (uint256)",
  "function reserve1CumulativeLast() view returns (uint256)",
  "function sample(address,uint256,uint256,uint256) view returns (uint256[])",
  "function skim(address)",
  "function stable() view returns (bool)",
  "function supplyIndex0(address) view returns (uint256)",
  "function supplyIndex1(address) view returns (uint256)",
  "function swap(uint256,uint256,address,bytes)",
  "function symbol() view returns (string)",
  "function sync()",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function tokens() view returns (address, address)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function transferFrom(address,address,uint256) returns (bool)",
] as const;

export class Pair__factory {
  static readonly abi = _abi;
  static createInterface(): PairInterface {
    return new utils.Interface(_abi) as PairInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Pair {
    return new Contract(address, _abi, signerOrProvider) as Pair;
  }
}
