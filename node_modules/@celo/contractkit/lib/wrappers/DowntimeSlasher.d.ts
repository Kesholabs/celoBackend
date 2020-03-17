import BigNumber from 'bignumber.js';
import { Address } from '../base';
import { DowntimeSlasher } from '../generated/DowntimeSlasher';
import { BaseWrapper, CeloTransactionObject } from './BaseWrapper';
/**
 * Contract handling slashing for Validator downtime
 */
export declare class DowntimeSlasherWrapper extends BaseWrapper<DowntimeSlasher> {
    /**
     * Returns slashing incentives.
     * @return Rewards and penaltys for slashing.
     */
    slashingIncentives: () => Promise<{
        reward: BigNumber;
        penalty: BigNumber;
    }>;
    /**
     * Returns slashable downtime in blocks.
     * @return The number of consecutive blocks before a Validator missing from IBFT consensus
     * can be slashed.
     */
    slashableDowntime: () => Promise<number>;
    /**
     * Tests if a validator has been down.
     * @param startBlock First block of the downtime.
     * @param startSignerIndex Validator index at the first block.
     * @param endSignerIndex Validator index at the last block.
     */
    isDown: (startBlock: string | number, startSignerIndex: string | number, endSignerIndex: string | number) => Promise<boolean>;
    /**
     * Slash a Validator for downtime.
     * @param validator Validator to slash for downtime.
     * @param startBlock First block of the downtime, undefined if using endBlock.
     * @param endBlock Last block of the downtime.
     */
    slashValidator(validatorAddress: Address, startBlock?: number, endBlock?: number): Promise<CeloTransactionObject<void>>;
    /**
     * Slash a Validator for downtime.
     * @param startBlock First block of the downtime.
     * @param startSignerIndex Validator index at the first block.
     */
    slashStartSignerIndex(startBlock: number, startSignerIndex: number): Promise<CeloTransactionObject<void>>;
    /**
     * Slash a Validator for downtime.
     * @param endBlock The last block of the downtime to slash for.
     * @param endSignerIndex Validator index at the last block.
     */
    slashEndSignerIndex(endBlock: number, endSignerIndex: number): Promise<CeloTransactionObject<void>>;
    /**
     * Slash a Validator for downtime.
     * @param validator Validator to slash for downtime.
     * @param startBlock First block of the downtime.
     * @param startSignerIndex Validator index at the first block.
     * @param endSignerIndex Validator index at the last block.
     */
    private slash;
}
