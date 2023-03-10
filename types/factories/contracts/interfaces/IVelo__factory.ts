/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IVelo,
  IVeloInterface,
} from "../../../contracts/interfaces/IVelo";

const _abi = [
  "function approve(address,uint256) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function mint(address,uint256) returns (bool)",
  "function minter() returns (address)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function transferFrom(address,address,uint256) returns (bool)",
] as const;

export class IVelo__factory {
  static readonly abi = _abi;
  static createInterface(): IVeloInterface {
    return new utils.Interface(_abi) as IVeloInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): IVelo {
    return new Contract(address, _abi, signerOrProvider) as IVelo;
  }
}
