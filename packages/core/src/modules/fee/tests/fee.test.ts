import {expect, it, describe} from "vitest";
import {Api} from "sst/node/api";
import {FeeDTO, FeeType} from "../dto/fee.dto";


describe("Fee API", () => {
    const apiUrl = `${Api.api.url}/api/v1`;

    const fee = {
        currency: 'USD',
        type: "fixed",
        unit: 'ETH',
        amount: 10,
    };

    it("should create a fee", async () => {
        const response = await fetch(`${apiUrl}/fees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currency: 'USDC',
                type: "fixed",
                unit: 'USDC',
                amount: Number(10),
            }),
        });

        expect(response.status).toBe(200);
        const createdFee = (await response.json()) as FeeDTO;
        expect(createdFee.currency).toBe('USDC');
        expect(createdFee.type).toBe(fee.type);
        expect(createdFee.amount).toBe(fee.amount);

        await fetch(`${apiUrl}/fees/${createdFee.id}`, {
            method: "DELETE",
        });
    }, 30000);

    it("should not allow creating a fee for an existing currency", async () => {
        await fetch(`${apiUrl}/fees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fee),
        });

        const response = await fetch(`${apiUrl}/fees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fee),
        });

        expect(response.status).toBe(422);
    });

    it("should get fee list", async () => {
        const response = await fetch(`${apiUrl}/fees`, {
            method: "GET",
        });

        expect(response.status).toBe(200);
        const fees = (await response.json()) as FeeDTO[];
        expect(fees.length).toBeGreaterThan(0);
    });
});