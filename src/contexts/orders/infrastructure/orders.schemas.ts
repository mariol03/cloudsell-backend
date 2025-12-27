export const checkoutSchema = {
    body: {
        type: "object",
        required: ["userId"],
        properties: { userId: { type: "string" } },
    },
};