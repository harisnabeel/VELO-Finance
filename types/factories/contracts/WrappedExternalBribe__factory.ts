/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  WrappedExternalBribe,
  WrappedExternalBribeInterface,
} from "../../contracts/WrappedExternalBribe";

const _abi = [
  "constructor(address,address)",
  "event ClaimRewards(address indexed,address indexed,uint256)",
  "event NotifyReward(address indexed,address indexed,uint256,uint256)",
  "function _ve() view returns (address)",
  "function earned(address,uint256) view returns (uint256)",
  "function getEpochStart(uint256) pure returns (uint256)",
  "function getReward(uint256,address[])",
  "function getRewardForOwner(uint256,address[])",
  "function isReward(address) view returns (bool)",
  "function lastEarn(address,uint256) view returns (uint256)",
  "function lastTimeRewardApplicable(address) view returns (uint256)",
  "function left(address) view returns (uint256)",
  "function notifyRewardAmount(address,uint256)",
  "function periodFinish(address) view returns (uint256)",
  "function rewards(uint256) view returns (address)",
  "function rewardsListLength() view returns (uint256)",
  "function swapOutRewardToken(uint256,address,address)",
  "function tokenRewardsPerEpoch(address,uint256) view returns (uint256)",
  "function underlying_bribe() view returns (address)",
  "function voter() view returns (address)",
] as const;

export class WrappedExternalBribe__factory {
  static readonly abi = _abi;
  static createInterface(): WrappedExternalBribeInterface {
    return new utils.Interface(_abi) as WrappedExternalBribeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WrappedExternalBribe {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as WrappedExternalBribe;
  }
}
