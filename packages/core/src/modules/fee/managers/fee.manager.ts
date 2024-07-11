import {baseManager} from "../../base.manager";
import {fees} from "../models";
import feeRepository, {FeeRepository} from "../repositories/fee.repository";
import {FeeEvents} from "../events/fee";
import {InferInsertModel} from "drizzle-orm";
import feeCalculationServiceLocator, {FeeCalculationServiceLocator} from "./calculation/feeCalculationServiceLocator";
import {ContextFactory} from "./calculation/strategies/feeCalculationStrategy";

const DEFAULT_FEE = 1; // in case fee is not set it returns a flat fee of 1.
const feeRepo = new FeeRepository();

class FeeManagerClass {

    private baseManager = baseManager<typeof fees, FeeRepository>(feeRepo, FeeEvents);

    // although fee can be uniq on currency + type but for now we keep the fee uniq by currency, for the sake if simplicity
    async create(newFee: InferInsertModel<typeof fees>) {
        const fee = await feeRepo.getByCurrency(newFee.currency)
        if (fee) {
            throw new Error(`Fee exists for  ${newFee.currency}`);
        }
        return this.baseManager.create(newFee);
    }

    async list() {
        return this.baseManager.list();
    }

    async upsert(data: InferInsertModel<typeof fees>) {
        return this.baseManager.upsert(data);
    }

    async delete(id: string) {
        const fee = feeRepository.get(id)
        if (!fee) {
            throw Error("fee does not exists")
        }
        return this.baseManager.delete(id);
    }

    async getByCurrency(currency: string, value: number): Promise<number> {
        const fee = await feeRepo.getByCurrency(currency);
        if (!fee) return DEFAULT_FEE;
        return feeCalculationServiceLocator.getStrategy(fee.type).calculateFee(ContextFactory.createContext(fee, value))
    }
}

export const FeeManager = new FeeManagerClass();