/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IBribeFactory,
  IBribeFactoryInterface,
} from "../../../contracts/interfaces/IBribeFactory";

const _abi = [
  "function createExternalBribe(address[]) returns (address)",
  "function createInternalBribe(address[]) returns (address)",
] as const;

export class IBribeFactory__factory {
  static readonly abi = _abi;
  static createInterface(): IBribeFactoryInterface {
    return new utils.Interface(_abi) as IBribeFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IBribeFactory {
    return new Contract(address, _abi, signerOrProvider) as IBribeFactory;
  }
}
