/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IVotingEscrow,
  IVotingEscrowInterface,
} from "../../../contracts/interfaces/IVotingEscrow";

const _abi = [
  "function abstain(uint256)",
  "function attach(uint256)",
  "function balanceOfNFT(uint256) view returns (uint256)",
  "function checkpoint()",
  "function create_lock_for(uint256,uint256,address) returns (uint256)",
  "function deposit_for(uint256,uint256)",
  "function detach(uint256)",
  "function epoch() view returns (uint256)",
  "function isApprovedOrOwner(address,uint256) view returns (bool)",
  "function ownerOf(uint256) view returns (address)",
  "function point_history(uint256) view returns (tuple(int128,int128,uint256,uint256))",
  "function team() returns (address)",
  "function token() view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function transferFrom(address,address,uint256)",
  "function user_point_epoch(uint256) view returns (uint256)",
  "function user_point_history(uint256,uint256) view returns (tuple(int128,int128,uint256,uint256))",
  "function voting(uint256)",
] as const;

export class IVotingEscrow__factory {
  static readonly abi = _abi;
  static createInterface(): IVotingEscrowInterface {
    return new utils.Interface(_abi) as IVotingEscrowInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IVotingEscrow {
    return new Contract(address, _abi, signerOrProvider) as IVotingEscrow;
  }
}
