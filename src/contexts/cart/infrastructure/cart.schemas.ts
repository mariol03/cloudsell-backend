export const addSchema = {
    body: {
        type: "object",
        required: ["ownerId", "itemId", "quantity"],
        properties: {
            ownerId: { type: "string" },
            itemId: { type: "string" },
            quantity: { type: "number" },
        },
    },
};

export const removeSchema = {
    body: {
        type: "object",
        required: ["ownerId", "itemId"],
        properties: { ownerId: { type: "string" }, itemId: { type: "string" } },
    },
};


export const getSchema = {
    params: {
        type: "object",
        required: ["ownerId"],
        properties: { ownerId: { type: "string" } },
    },
};