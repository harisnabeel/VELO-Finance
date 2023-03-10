/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IVotes,
  IVotesInterface,
} from "../../../../../@openzeppelin/contracts/governance/utils/IVotes";

const _abi = [
  "event DelegateChanged(address indexed,address indexed,address indexed)",
  "event DelegateVotesChanged(address indexed,uint256,uint256)",
  "function delegate(address)",
  "function delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)",
  "function delegates(address) view returns (address)",
  "function getPastTotalSupply(uint256) view returns (uint256)",
  "function getPastVotes(address,uint256) view returns (uint256)",
  "function getVotes(address) view returns (uint256)",
] as const;

export class IVotes__factory {
  static readonly abi = _abi;
  static createInterface(): IVotesInterface {
    return new utils.Interface(_abi) as IVotesInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): IVotes {
    return new Contract(address, _abi, signerOrProvider) as IVotes;
  }
}
