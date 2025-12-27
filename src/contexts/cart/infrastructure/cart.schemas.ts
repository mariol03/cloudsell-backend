export const addSchema = {
    body: {
        type: "object",
        required: ["userId", "itemId", "quantity"],
        properties: {
            userId: { type: "string" },
            itemId: { type: "string" },
            quantity: { type: "number" },
        },
    },
};

export const removeSchema = {
    body: {
        type: "object",
        required: ["userId", "itemId"],
        properties: { userId: { type: "string" }, itemId: { type: "string" } },
    },
};


export const getSchema = {
    params: {
        type: "object",
        required: ["userId"],
        properties: { userId: { type: "string" } },
    },
};