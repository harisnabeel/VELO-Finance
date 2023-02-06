/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  GaugeFactory,
  GaugeFactoryInterface,
} from "../../../contracts/factories/GaugeFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_internal_bribe",
        type: "address",
      },
      {
        internalType: "address",
        name: "_external_bribe",
        type: "address",
      },
      {
        internalType: "address",
        name: "_ve",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isPair",
        type: "bool",
      },
      {
        internalType: "address[]",
        name: "allowedRewards",
        type: "address[]",
      },
    ],
    name: "createGauge",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "last_gauge",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class GaugeFactory__factory {
  static readonly abi = _abi;
  static createInterface(): GaugeFactoryInterface {
    return new utils.Interface(_abi) as GaugeFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GaugeFactory {
    return new Contract(address, _abi, signerOrProvider) as GaugeFactory;
  }
}
