import {CalculationContext, FeeCalculationStrategy} from "./feeCalculationStrategy";

export class FixedFeeStrategy implements FeeCalculationStrategy {

    calculateFee(context: CalculationContext): number {
        if (!context.value) {
            throw Error("something went wrong");
        }
        return context.value;
    }
}
