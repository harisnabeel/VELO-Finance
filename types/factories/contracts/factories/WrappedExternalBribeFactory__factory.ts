/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  WrappedExternalBribeFactory,
  WrappedExternalBribeFactoryInterface,
} from "../../../contracts/factories/WrappedExternalBribeFactory";

const _abi = [
  "constructor(address)",
  "function createBribe(address) returns (address)",
  "function last_bribe() view returns (address)",
  "function oldBribeToNew(address) view returns (address)",
  "function voter() view returns (address)",
] as const;

export class WrappedExternalBribeFactory__factory {
  static readonly abi = _abi;
  static createInterface(): WrappedExternalBribeFactoryInterface {
    return new utils.Interface(_abi) as WrappedExternalBribeFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WrappedExternalBribeFactory {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as WrappedExternalBribeFactory;
  }
}
