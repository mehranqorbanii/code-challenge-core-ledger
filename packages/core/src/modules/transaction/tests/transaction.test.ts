import {TransactionDTO, TransactionType} from '../dto/transaction.dto';
import {AccountDTO} from '../../account/dto/account.dto';
import {expect, it, describe} from "vitest";
import {Api} from "sst/node/api";
import {User} from "../../user/models";

// describe("Transaction and Account API", () => {
//     const apiUrl = `${Api.api.url}/api/v1`;
//
//     async function createUser(firstName: string, lastName: string): Promise<User> {
//         const response = await fetch(`${apiUrl}/users`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({firstName, lastName}),
//         });
//
//         expect(response.status).toBe(200);
//         return (await response.json()) as User;
//     }
//
//     async function createAccount(userId: string, currency: string): Promise<AccountDTO> {
//         const response = await fetch(`${apiUrl}/users/${userId}/accounts`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({currency}),
//         });
//
//         expect(response.status).toBe(200);
//         return (await response.json()) as AccountDTO;
//     }
//
//     it("should create a deposit transaction", async () => {
//         // Arrange
//         const user = await createUser("Mehran", "Doee");
//         const account = await createAccount(user.id, "ETH");
//         const amount = 100;
//         const requestBody = {
//             accountId: account.id,
//             type: "deposit",
//             amount,
//         };
//
//         // Act: Create Transaction
//         const createResponse = await fetch(`${apiUrl}/transactions`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//         });
//
//         // Assert: Verify the transaction creation response
//         console.log(createResponse.body)
//         expect(createResponse.status).toBe(200);
//         const createdTransaction = (await createResponse.json()) as TransactionDTO;
//         expect(createdTransaction.accountId).toBe(account.id);
//         expect(createdTransaction.type).toBe("deposit");
//         expect(createdTransaction.amount).toBe(amount);
//     }, 30000);
//
//     it("should create a withdraw transaction", async () => {
//         // Arrange
//         const user = await createUser("Jane", "Smith");
//         const account = await createAccount(user.id, "ETH");
//         const amount = 9;
//         const amountDeposit = 500;
//
//         const depositRequest = {
//             accountId: account.id,
//             type: "deposit",
//             amount: amountDeposit,
//         };
//
//         await fetch(`${apiUrl}/transactions`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(depositRequest),
//         });
//
//         const requestBody = {
//             accountId: account.id,
//             type: TransactionType.WITHDRAW,
//             amount,
//         };
//
//         // Act: Create Transaction
//         const createResponse = await fetch(`${apiUrl}/transactions`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//         });
//
//         // Assert: Verify the transaction creation response
//         expect(createResponse.status).toBe(200);
//         const createdTransaction = (await createResponse.json()) as TransactionDTO;
//         expect(createdTransaction.accountId).toBe(account.id);
//         expect(createdTransaction.type).toBe(TransactionType.WITHDRAW);
//         expect(createdTransaction.amount).toBe(amount + 1);
//     },30000);
//
//     it("should not allow a withdraw transaction exceeding the balance", async () => {
//         // Arrange
//         const user = await createUser("Alice", "Brown");
//         const account = await createAccount(user.id, "ETH");
//         const amount = 1000; // Assuming this exceeds the current balance
//         const requestBody = {
//             accountId: account.id,
//             type: TransactionType.WITHDRAW,
//             amount,
//         };
//
//         // Act: Create Transaction
//         const createResponse = await fetch(`${apiUrl}/transactions`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//         });
//
//         // Assert: Verify the transaction creation response
//         expect(createResponse.status).toBe(422); // Assuming 422 Bad Request for insufficient funds
//     });
//
//     it("should not create a transaction for a non-existing account", async () => {
//         // Arrange
//         const nonExistingAccountId = "non-existing-account-id";
//         const amount = 100;
//         const requestBody = {
//             accountId: nonExistingAccountId,
//             type: TransactionType.DEPOSIT,
//             amount,
//         };
//
//         // Act: Create Transaction
//         const createResponse = await fetch(`${apiUrl}/transactions`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//         });
//
//         // Assert: Verify the transaction creation response
//         expect(createResponse.status).toBe(422); // Assuming 422 Unprocessable Entity for non-existing account
//     },30000);
//
//     it("should not create a deposit transaction less than the minimum amount", async () => {
//         // Arrange
//         const user = await createUser("Bob", "Johnson");
//         const account = await createAccount(user.id, "ETH");
//         const amount = 0.5; // Assuming the minimum deposit amount is 1
//         const requestBody = {
//             accountId: account.id,
//             type: TransactionType.DEPOSIT,
//             amount,
//         };
//
//         // Act: Create Transaction
//         const createResponse = await fetch(`${apiUrl}/transactions`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//         });
//
//         // Assert: Verify the transaction creation response
//         expect(createResponse.status).toBe(422); // Assuming 422 Bad Request for invalid deposit amount;
//     });
//
//     it("should create a deposit transaction with a default fee for non-existing fee", async () => {
//         // Arrange
//         const user = await createUser("Eve", "White");
//         const account = await createAccount(user.id, "ETH");
//         const amount = 100;
//         const requestBody = {
//             accountId: account.id,
//             type: TransactionType.DEPOSIT,
//             amount,
//         };
//
//         // Act: Create Transaction
//         const createResponse = await fetch(`${apiUrl}/transactions`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//         });
//
//         // Assert: Verify the transaction creation response
//         expect(createResponse.status).toBe(200);
//         const createdTransaction = (await createResponse.json()) as TransactionDTO;
//         expect(createdTransaction.accountId).toBe(account.id);
//         expect(createdTransaction.type).toBe(TransactionType.DEPOSIT);
//         expect(createdTransaction.amount).toBe(amount);
//         expect(createdTransaction.fee).toBe(1); // Assuming 1 is the default fee
//     },30000);
// });