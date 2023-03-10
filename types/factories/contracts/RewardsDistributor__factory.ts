/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  RewardsDistributor,
  RewardsDistributorInterface,
} from "../../contracts/RewardsDistributor";

const _abi = [
  "constructor(address)",
  "event CheckpointToken(uint256,uint256)",
  "event Claimed(uint256,uint256,uint256,uint256)",
  "function checkpoint_token()",
  "function checkpoint_total_supply()",
  "function claim(uint256) returns (uint256)",
  "function claim_many(uint256[]) returns (bool)",
  "function claimable(uint256) view returns (uint256)",
  "function depositor() view returns (address)",
  "function last_token_time() view returns (uint256)",
  "function setDepositor(address)",
  "function start_time() view returns (uint256)",
  "function time_cursor() view returns (uint256)",
  "function time_cursor_of(uint256) view returns (uint256)",
  "function timestamp() view returns (uint256)",
  "function token() view returns (address)",
  "function token_last_balance() view returns (uint256)",
  "function tokens_per_week(uint256) view returns (uint256)",
  "function user_epoch_of(uint256) view returns (uint256)",
  "function ve_for_at(uint256,uint256) view returns (uint256)",
  "function ve_supply(uint256) view returns (uint256)",
  "function voting_escrow() view returns (address)",
] as const;

export class RewardsDistributor__factory {
  static readonly abi = _abi;
  static createInterface(): RewardsDistributorInterface {
    return new utils.Interface(_abi) as RewardsDistributorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RewardsDistributor {
    return new Contract(address, _abi, signerOrProvider) as RewardsDistributor;
  }
}
