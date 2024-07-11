import {Fee} from "../../../models";

export interface CalculationContext {
    amount?: number;
    value?: number;
}

export class ContextFactory {
    static createContext(fee: Fee, value: number): CalculationContext {
        switch (fee.type) {
            case 'PercentageFee':
                return {amount: Number(fee.amount), value: value};
            case 'FixedFee':
                return {value: Number(value)};
            default:
                throw new Error(`Unknown strategy type: ${fee.type}`);
        }
    }
}

export interface FeeCalculationStrategy {
    calculateFee(context: CalculationContext): number;
}
