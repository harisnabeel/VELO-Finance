/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  BribeFactory,
  BribeFactoryInterface,
} from "../../../contracts/factories/BribeFactory";

const _abi = [
  "function createExternalBribe(address[]) returns (address)",
  "function createInternalBribe(address[]) returns (address)",
  "function last_external_bribe() view returns (address)",
  "function last_internal_bribe() view returns (address)",
] as const;

export class BribeFactory__factory {
  static readonly abi = _abi;
  static createInterface(): BribeFactoryInterface {
    return new utils.Interface(_abi) as BribeFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BribeFactory {
    return new Contract(address, _abi, signerOrProvider) as BribeFactory;
  }
}
