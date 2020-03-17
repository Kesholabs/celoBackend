import BigNumber from 'bignumber.js';
import { Address } from '../base';
import { Attestations } from '../generated/Attestations';
import { BaseWrapper } from './BaseWrapper';
export interface AttestationStat {
    completed: number;
    total: number;
}
export interface AttestationStateForIssuer {
    attestationState: AttestationState;
}
export interface AttestationsToken {
    address: Address;
    fee: BigNumber;
}
export interface AttestationsConfig {
    attestationExpiryBlocks: number;
    attestationRequestFees: AttestationsToken[];
}
/**
 * Contract for managing identities
 */
export declare enum AttestationState {
    None = 0,
    Incomplete = 1,
    Complete = 2
}
export interface ActionableAttestation {
    issuer: Address;
    blockNumber: number;
    attestationServiceURL: string;
    name: string | undefined;
}
export interface UnselectedRequest {
    blockNumber: number;
    attestationsRequested: number;
    attestationRequestFeeToken: string;
}
export declare class AttestationsWrapper extends BaseWrapper<Attestations> {
    /**
     *  Returns the time an attestation can be completable before it is considered expired
     */
    attestationExpiryBlocks: () => Promise<number>;
    /**
     * Returns the attestation request fee in a given currency.
     * @param address Token address.
     * @returns The fee as big number.
     */
    attestationRequestFees: (arg0: string) => Promise<BigNumber>;
    selectIssuersWaitBlocks: () => Promise<number>;
    /**
     * @notice Returns the unselected attestation request for an identifier/account pair, if any.
     * @param identifier Hash of the identifier.
     * @param account Address of the account.
     */
    getUnselectedRequest: (args_0: string, args_1: string) => Promise<{
        blockNumber: number;
        attestationsRequested: number;
        attestationRequestFeeToken: string;
    }>;
    waitForSelectingIssuers: (phoneNumber: string, account: string, timeoutSeconds?: number, pollDurationSeconds?: number) => Promise<void>;
    /**
     * Returns the issuers of attestations for a phoneNumber/account combo
     * @param phoneNumber Phone Number
     * @param account Account
     */
    getAttestationIssuers: (args_0: string, args_1: string) => Promise<string[]>;
    /**
     * Returns the attestation state of a phone number/account/issuer tuple
     * @param phoneNumber Phone Number
     * @param account Account
     */
    getAttestationState: (phoneNumber: string, account: Address, issuer: Address) => Promise<AttestationStateForIssuer>;
    /**
     * Returns the attestation stats of a phone number/account pair
     * @param phoneNumber Phone Number
     * @param account Account
     */
    getAttestationStat: (phoneNumber: string, account: Address) => Promise<AttestationStat>;
    /**
     * Calculates the amount of StableToken required to request Attestations
     * @param attestationsRequested  The number of attestations to request
     */
    attestationFeeRequired(attestationsRequested: number): Promise<BigNumber>;
    /**
     * Approves the necessary amount of StableToken to request Attestations
     * @param attestationsRequested The number of attestations to request
     */
    approveAttestationFee(attestationsRequested: number): Promise<import("./BaseWrapper").CeloTransactionObject<boolean>>;
    /**
     * Returns an array of attestations that can be completed, along with the issuers' attestation
     * service urls
     * @param phoneNumber
     * @param account
     */
    getActionableAttestations(phoneNumber: string, account: Address): Promise<ActionableAttestation[]>;
    /**
     * Returns an array of issuer addresses that were found to not run the attestation service
     * @param phoneNumber
     * @param account
     */
    getNonCompliantIssuers(phoneNumber: string, account: Address): Promise<Address[]>;
    private isIssuerRunningAttestationService;
    /**
     * Completes an attestation with the corresponding code
     * @param phoneNumber The phone number of the attestation
     * @param account The account of the attestation
     * @param issuer The issuer of the attestation
     * @param code The code received by the validator
     */
    complete(phoneNumber: string, account: Address, issuer: Address, code: string): Promise<import("./BaseWrapper").CeloTransactionObject<void>>;
    /**
     * Given a list of issuers, finds the matching issuer for a given code
     * @param phoneNumber The phone number of the attestation
     * @param account The account of the attestation
     * @param code The code received by the validator
     * @param issuers The list of potential issuers
     */
    findMatchingIssuer(phoneNumber: string, account: Address, code: string, issuers: string[]): Promise<string | null>;
    /**
     * Returns the current configuration parameters for the contract.
     * @param tokens List of tokens used for attestation fees.
     */
    getConfig(tokens: string[]): Promise<AttestationsConfig>;
    /**
     * Lookup mapped walleet addresses for a given list of hashes of phone numbers
     * @param phoneNumberHashes The hashes of phone numbers to lookup
     */
    lookupPhoneNumbers(phoneNumberHashes: string[]): Promise<Record<string, Record<string, AttestationStat>>>;
    /**
     * Requests attestations for a phone number
     * @param phoneNumber The phone number for which to request attestations for
     * @param attestationsRequested The number of attestations to request
     */
    request(phoneNumber: string, attestationsRequested: number): Promise<import("./BaseWrapper").CeloTransactionObject<void>>;
    /**
     * Selects the issuers for previously requested attestations for a phone number
     * @param phoneNumber The phone number for which to request attestations for
     */
    selectIssuers(phoneNumber: string): import("./BaseWrapper").CeloTransactionObject<void>;
    revealPhoneNumberToIssuer(phoneNumber: string, account: Address, issuer: Address, serviceURL: string): Promise<Response>;
    /**
     * Validates a given code by the issuer on-chain
     * @param phoneNumber The phone number which requested attestation
     * @param account The account which requested attestation
     * @param issuer The address of the issuer of the attestation
     * @param code The code send by the issuer
     */
    validateAttestationCode(phoneNumber: string, account: Address, issuer: Address, code: string): Promise<boolean>;
}
