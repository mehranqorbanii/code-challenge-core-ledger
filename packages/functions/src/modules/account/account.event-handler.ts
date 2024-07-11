import {EventHandler} from "sst/node/event-bus";
import {UserEvents} from "@coding-challenge-core-ledger/core/modules/user";
import {AccountManager} from "@coding-challenge-core-ledger/core/modules/account/managers/account.manager";
import * as console from "node:console";

export const handler = EventHandler(UserEvents.Created, async (evt) => {
    console.info("received new user created domain event")
    try {
        const userId = evt.properties.id
        await AccountManager.createDefaultAccountsForUser(userId);
    } catch (e: any) {
        console.log(`Could not create default account for user ${evt.properties.id} error is ${e}`)
    }
});
