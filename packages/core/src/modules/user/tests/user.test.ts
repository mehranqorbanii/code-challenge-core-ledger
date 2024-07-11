import {expect, it, describe} from "vitest";
import {Api} from "sst/node/api";
import {User} from "../models";

describe("User", () => {

    const apiUrl = `${Api.api.url}/api/v1/users`;

    it("should create", async () => {
        const firstName = "John";
        const response = await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify({
                firstName,
                lastName: "Perkins",
            }),
        });
        // Check the newly created user exists
        expect(response.status).toBe(200);
        const user = (await response.json()) as User;
        expect(user.firstName).toBe(firstName);

        console.log(user.id);

        const getUserResponse = await fetch(`${apiUrl}/${user.id}`, {
            method: "GET",
        });

        expect(getUserResponse.status).toBe(200);
        const getUser = (await getUserResponse.json()) as User;
        expect(getUser.firstName).toBe(firstName);
    },30000);
    it("should not create a user with invalid firstName", async () => {
        // Arrange
        const invalidFirstName = "J"; // Invalid: Too short
        const lastName = "Perkins";
        const requestBody = {
            firstName: invalidFirstName,
            lastName,
        };

        // Act: Attempt to create User
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        // Assert: Verify the response for invalid firstName
        expect(response.status).toBe(400); // Assuming 400 Bad Request for validation errors
    });
});
