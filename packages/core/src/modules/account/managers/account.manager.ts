import {baseManager} from "../../base.manager";
import {accounts} from "../models";
import {AccountRepository} from "../repositories/account.repository";
import {InferInsertModel} from "drizzle-orm";
import {AccountEvents} from "../events";
import {use} from "sst/constructs";

const DEFAULT_CURRENCIES = ['USD', 'USDT', 'BTC'];
const accountRepo = new AccountRepository();

class AccountManagerClass {
    private baseManager = baseManager<typeof accounts, AccountRepository>(accountRepo, AccountEvents);

    async get(id: string) {
        let account = await this.baseManager.get(id)
        if (!account) {
            console.info(`No account for ${id}`)
            throw new Error(`No Account exists for  ${id}`);
        }
        return account;
    }

    async create(item: InferInsertModel<typeof accounts>) {
        let accounts = await accountRepo.findByUserIdAndCurrency(item.userId, item.currency)
        if (accounts.length > 0) {
            console.info("account for the specified currency already exists for " + item.userId)
            throw new Error(`Account exists for  ${item.currency}`);
        }
        return this.baseManager.create(item);
    }

    async createDefaultAccountsForUser(userId: string) {
        const now = new Date().toISOString();
        const newAccounts = DEFAULT_CURRENCIES.map(currency => ({
            userId,
            currency,
            balance: 0
        }));
        console.info(`going to create default accounts for user ${userId} accounts size ${newAccounts.length}`);
        await accountRepo.createList(newAccounts);
    }


    async list() {
        return this.baseManager.list();
    }

    async getByUserId(userId: string) {
        return accountRepo.findByUserId(userId);
    }

    async updateBalance(accountId: string, newBalance: number): Promise<void> {
        await accountRepo.updateBalance(accountId, newBalance);
    }
}

export const AccountManager = new AccountManagerClass();