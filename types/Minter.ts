/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface MinterInterface extends utils.Interface {
  functions: {
    "MAX_TEAM_RATE()": FunctionFragment;
    "_rewards_distributor()": FunctionFragment;
    "_ve()": FunctionFragment;
    "_velo()": FunctionFragment;
    "_voter()": FunctionFragment;
    "acceptTeam()": FunctionFragment;
    "active_period()": FunctionFragment;
    "calculate_emission()": FunctionFragment;
    "calculate_growth(uint256)": FunctionFragment;
    "circulating_emission()": FunctionFragment;
    "circulating_supply()": FunctionFragment;
    "initialize(address[],uint256[],uint256)": FunctionFragment;
    "pendingTeam()": FunctionFragment;
    "setTeam(address)": FunctionFragment;
    "setTeamRate(uint256)": FunctionFragment;
    "team()": FunctionFragment;
    "teamRate()": FunctionFragment;
    "update_period()": FunctionFragment;
    "weekly()": FunctionFragment;
    "weekly_emission()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "MAX_TEAM_RATE"
      | "_rewards_distributor"
      | "_ve"
      | "_velo"
      | "_voter"
      | "acceptTeam"
      | "active_period"
      | "calculate_emission"
      | "calculate_growth"
      | "circulating_emission"
      | "circulating_supply"
      | "initialize"
      | "pendingTeam"
      | "setTeam"
      | "setTeamRate"
      | "team"
      | "teamRate"
      | "update_period"
      | "weekly"
      | "weekly_emission"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "MAX_TEAM_RATE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_rewards_distributor",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "_ve", values?: undefined): string;
  encodeFunctionData(functionFragment: "_velo", values?: undefined): string;
  encodeFunctionData(functionFragment: "_voter", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "acceptTeam",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "active_period",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculate_emission",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculate_growth",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "circulating_emission",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "circulating_supply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "pendingTeam",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setTeam",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setTeamRate",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "team", values?: undefined): string;
  encodeFunctionData(functionFragment: "teamRate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "update_period",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "weekly", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "weekly_emission",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "MAX_TEAM_RATE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_rewards_distributor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "_ve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "_velo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "_voter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "acceptTeam", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "active_period",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculate_emission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculate_growth",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "circulating_emission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "circulating_supply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingTeam",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setTeam", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTeamRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "team", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "teamRate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "update_period",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "weekly", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "weekly_emission",
    data: BytesLike
  ): Result;

  events: {
    "Mint(address,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Mint"): EventFragment;
}

export interface MintEventObject {
  sender: string;
  weekly: BigNumber;
  circulating_supply: BigNumber;
  circulating_emission: BigNumber;
}
export type MintEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  MintEventObject
>;

export type MintEventFilter = TypedEventFilter<MintEvent>;

export interface Minter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MinterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    MAX_TEAM_RATE(overrides?: CallOverrides): Promise<[BigNumber]>;

    _rewards_distributor(overrides?: CallOverrides): Promise<[string]>;

    _ve(overrides?: CallOverrides): Promise<[string]>;

    _velo(overrides?: CallOverrides): Promise<[string]>;

    _voter(overrides?: CallOverrides): Promise<[string]>;

    acceptTeam(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    active_period(overrides?: CallOverrides): Promise<[BigNumber]>;

    calculate_emission(overrides?: CallOverrides): Promise<[BigNumber]>;

    calculate_growth(
      _minted: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    circulating_emission(overrides?: CallOverrides): Promise<[BigNumber]>;

    circulating_supply(overrides?: CallOverrides): Promise<[BigNumber]>;

    initialize(
      claimants: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      max: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pendingTeam(overrides?: CallOverrides): Promise<[string]>;

    setTeam(
      _team: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTeamRate(
      _teamRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    team(overrides?: CallOverrides): Promise<[string]>;

    teamRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    update_period(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    weekly(overrides?: CallOverrides): Promise<[BigNumber]>;

    weekly_emission(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  MAX_TEAM_RATE(overrides?: CallOverrides): Promise<BigNumber>;

  _rewards_distributor(overrides?: CallOverrides): Promise<string>;

  _ve(overrides?: CallOverrides): Promise<string>;

  _velo(overrides?: CallOverrides): Promise<string>;

  _voter(overrides?: CallOverrides): Promise<string>;

  acceptTeam(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  active_period(overrides?: CallOverrides): Promise<BigNumber>;

  calculate_emission(overrides?: CallOverrides): Promise<BigNumber>;

  calculate_growth(
    _minted: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  circulating_emission(overrides?: CallOverrides): Promise<BigNumber>;

  circulating_supply(overrides?: CallOverrides): Promise<BigNumber>;

  initialize(
    claimants: PromiseOrValue<string>[],
    amounts: PromiseOrValue<BigNumberish>[],
    max: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  pendingTeam(overrides?: CallOverrides): Promise<string>;

  setTeam(
    _team: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTeamRate(
    _teamRate: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  team(overrides?: CallOverrides): Promise<string>;

  teamRate(overrides?: CallOverrides): Promise<BigNumber>;

  update_period(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  weekly(overrides?: CallOverrides): Promise<BigNumber>;

  weekly_emission(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    MAX_TEAM_RATE(overrides?: CallOverrides): Promise<BigNumber>;

    _rewards_distributor(overrides?: CallOverrides): Promise<string>;

    _ve(overrides?: CallOverrides): Promise<string>;

    _velo(overrides?: CallOverrides): Promise<string>;

    _voter(overrides?: CallOverrides): Promise<string>;

    acceptTeam(overrides?: CallOverrides): Promise<void>;

    active_period(overrides?: CallOverrides): Promise<BigNumber>;

    calculate_emission(overrides?: CallOverrides): Promise<BigNumber>;

    calculate_growth(
      _minted: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    circulating_emission(overrides?: CallOverrides): Promise<BigNumber>;

    circulating_supply(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      claimants: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      max: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    pendingTeam(overrides?: CallOverrides): Promise<string>;

    setTeam(
      _team: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTeamRate(
      _teamRate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    team(overrides?: CallOverrides): Promise<string>;

    teamRate(overrides?: CallOverrides): Promise<BigNumber>;

    update_period(overrides?: CallOverrides): Promise<BigNumber>;

    weekly(overrides?: CallOverrides): Promise<BigNumber>;

    weekly_emission(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "Mint(address,uint256,uint256,uint256)"(
      sender?: PromiseOrValue<string> | null,
      weekly?: null,
      circulating_supply?: null,
      circulating_emission?: null
    ): MintEventFilter;
    Mint(
      sender?: PromiseOrValue<string> | null,
      weekly?: null,
      circulating_supply?: null,
      circulating_emission?: null
    ): MintEventFilter;
  };

  estimateGas: {
    MAX_TEAM_RATE(overrides?: CallOverrides): Promise<BigNumber>;

    _rewards_distributor(overrides?: CallOverrides): Promise<BigNumber>;

    _ve(overrides?: CallOverrides): Promise<BigNumber>;

    _velo(overrides?: CallOverrides): Promise<BigNumber>;

    _voter(overrides?: CallOverrides): Promise<BigNumber>;

    acceptTeam(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    active_period(overrides?: CallOverrides): Promise<BigNumber>;

    calculate_emission(overrides?: CallOverrides): Promise<BigNumber>;

    calculate_growth(
      _minted: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    circulating_emission(overrides?: CallOverrides): Promise<BigNumber>;

    circulating_supply(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      claimants: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      max: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    pendingTeam(overrides?: CallOverrides): Promise<BigNumber>;

    setTeam(
      _team: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTeamRate(
      _teamRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    team(overrides?: CallOverrides): Promise<BigNumber>;

    teamRate(overrides?: CallOverrides): Promise<BigNumber>;

    update_period(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    weekly(overrides?: CallOverrides): Promise<BigNumber>;

    weekly_emission(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    MAX_TEAM_RATE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _rewards_distributor(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _ve(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _velo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _voter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    acceptTeam(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    active_period(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    calculate_emission(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculate_growth(
      _minted: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    circulating_emission(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    circulating_supply(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      claimants: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      max: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    pendingTeam(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setTeam(
      _team: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTeamRate(
      _teamRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    team(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    teamRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    update_period(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    weekly(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    weekly_emission(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}