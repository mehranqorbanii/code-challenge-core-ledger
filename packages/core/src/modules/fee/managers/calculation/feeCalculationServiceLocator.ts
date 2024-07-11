import {FeeCalculationStrategy} from "./strategies/feeCalculationStrategy";
import { PercentageFeeStrategy } from "./strategies/percentBasedFeeCalculationStrategy";
import { FixedFeeStrategy } from "./strategies/fixedBasedFeeCalculationStrategy";

//NOTE: not an overengineering just for demonstration purposes
export class FeeCalculationServiceLocator {
    private strategies: { [key: string]: FeeCalculationStrategy } = {};

     constructor() {
        this.strategies["percentage"] = new PercentageFeeStrategy();
        this.strategies["fixed"] = new FixedFeeStrategy();
    }

    getStrategy(type: string): FeeCalculationStrategy {
        const strategy = this.strategies[type];
        if (!strategy) {
            throw new Error(`Fee calculation strategy not found for type: ${type}`);
        }
        return strategy;
    }
}

const feeCalculationServiceLocator = new FeeCalculationServiceLocator();
export default feeCalculationServiceLocator;
