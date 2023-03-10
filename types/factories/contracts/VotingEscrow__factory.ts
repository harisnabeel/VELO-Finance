/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  VotingEscrow,
  VotingEscrowInterface,
} from "../../contracts/VotingEscrow";

const _abi = [
  "constructor(address,address)",
  "event Approval(address indexed,address indexed,uint256 indexed)",
  "event ApprovalForAll(address indexed,address indexed,bool)",
  "event DelegateChanged(address indexed,address indexed,address indexed)",
  "event DelegateVotesChanged(address indexed,uint256,uint256)",
  "event Deposit(address indexed,uint256,uint256,uint256 indexed,uint8,uint256)",
  "event Supply(uint256,uint256)",
  "event Transfer(address indexed,address indexed,uint256 indexed)",
  "event Withdraw(address indexed,uint256,uint256,uint256)",
  "function DELEGATION_TYPEHASH() view returns (bytes32)",
  "function DOMAIN_TYPEHASH() view returns (bytes32)",
  "function MAX_DELEGATES() view returns (uint256)",
  "function abstain(uint256)",
  "function approve(address,uint256)",
  "function artProxy() view returns (address)",
  "function attach(uint256)",
  "function attachments(uint256) view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function balanceOfAtNFT(uint256,uint256) view returns (uint256)",
  "function balanceOfNFT(uint256) view returns (uint256)",
  "function balanceOfNFTAt(uint256,uint256) view returns (uint256)",
  "function block_number() view returns (uint256)",
  "function checkpoint()",
  "function checkpoints(address,uint32) view returns (uint256)",
  "function create_lock(uint256,uint256) returns (uint256)",
  "function create_lock_for(uint256,uint256,address) returns (uint256)",
  "function decimals() view returns (uint8)",
  "function delegate(address)",
  "function delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)",
  "function delegates(address) view returns (address)",
  "function deposit_for(uint256,uint256)",
  "function detach(uint256)",
  "function epoch() view returns (uint256)",
  "function getApproved(uint256) view returns (address)",
  "function getPastTotalSupply(uint256) view returns (uint256)",
  "function getPastVotes(address,uint256) view returns (uint256)",
  "function getPastVotesIndex(address,uint256) view returns (uint32)",
  "function getVotes(address) view returns (uint256)",
  "function get_last_user_slope(uint256) view returns (int128)",
  "function increase_amount(uint256,uint256)",
  "function increase_unlock_time(uint256,uint256)",
  "function isApprovedForAll(address,address) view returns (bool)",
  "function isApprovedOrOwner(address,uint256) view returns (bool)",
  "function locked(uint256) view returns (int128, uint256)",
  "function locked__end(uint256) view returns (uint256)",
  "function merge(uint256,uint256)",
  "function name() view returns (string)",
  "function nonces(address) view returns (uint256)",
  "function numCheckpoints(address) view returns (uint32)",
  "function ownerOf(uint256) view returns (address)",
  "function ownership_change(uint256) view returns (uint256)",
  "function point_history(uint256) view returns (int128, int128, uint256, uint256)",
  "function safeTransferFrom(address,address,uint256)",
  "function safeTransferFrom(address,address,uint256,bytes)",
  "function setApprovalForAll(address,bool)",
  "function setArtProxy(address)",
  "function setTeam(address)",
  "function setVoter(address)",
  "function slope_changes(uint256) view returns (int128)",
  "function supply() view returns (uint256)",
  "function supportsInterface(bytes4) view returns (bool)",
  "function symbol() view returns (string)",
  "function team() view returns (address)",
  "function token() view returns (address)",
  "function tokenOfOwnerByIndex(address,uint256) view returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function totalSupplyAt(uint256) view returns (uint256)",
  "function totalSupplyAtT(uint256) view returns (uint256)",
  "function transferFrom(address,address,uint256)",
  "function user_point_epoch(uint256) view returns (uint256)",
  "function user_point_history(uint256,uint256) view returns (int128, int128, uint256, uint256)",
  "function user_point_history__ts(uint256,uint256) view returns (uint256)",
  "function version() view returns (string)",
  "function voted(uint256) view returns (bool)",
  "function voter() view returns (address)",
  "function voting(uint256)",
  "function withdraw(uint256)",
] as const;

export class VotingEscrow__factory {
  static readonly abi = _abi;
  static createInterface(): VotingEscrowInterface {
    return new utils.Interface(_abi) as VotingEscrowInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VotingEscrow {
    return new Contract(address, _abi, signerOrProvider) as VotingEscrow;
  }
}
