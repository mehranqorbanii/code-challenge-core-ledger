import {CalculationContext, FeeCalculationStrategy} from "./feeCalculationStrategy";

export class PercentageFeeStrategy implements FeeCalculationStrategy {
    calculateFee(context: CalculationContext): number {
        if (!context.amount || !context.value) {
            throw Error("something went wrong");
        }
        return context.amount * (context.value / 100);
    }
}
