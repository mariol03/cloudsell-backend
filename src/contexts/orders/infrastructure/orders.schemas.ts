export const checkoutSchema = {
    body: {
        type: "object",
        required: ["ownerId"],
        properties: { ownerId: { type: "string" } },
    },
};