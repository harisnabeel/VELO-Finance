/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRewardsDistributor,
  IRewardsDistributorInterface,
} from "../../../contracts/interfaces/IRewardsDistributor";

const _abi = [
  "function checkpoint_token()",
  "function checkpoint_total_supply()",
] as const;

export class IRewardsDistributor__factory {
  static readonly abi = _abi;
  static createInterface(): IRewardsDistributorInterface {
    return new utils.Interface(_abi) as IRewardsDistributorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRewardsDistributor {
    return new Contract(address, _abi, signerOrProvider) as IRewardsDistributor;
  }
}
