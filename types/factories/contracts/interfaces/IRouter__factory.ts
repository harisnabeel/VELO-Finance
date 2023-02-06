/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRouter,
  IRouterInterface,
} from "../../../contracts/interfaces/IRouter";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
      {
        internalType: "bool",
        name: "stable",
        type: "bool",
      },
    ],
    name: "pairFor",
    outputs: [
      {
        internalType: "address",
        name: "pair",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IRouter__factory {
  static readonly abi = _abi;
  static createInterface(): IRouterInterface {
    return new utils.Interface(_abi) as IRouterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRouter {
    return new Contract(address, _abi, signerOrProvider) as IRouter;
  }
}
