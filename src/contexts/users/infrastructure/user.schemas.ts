const UserResponseDto = {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
    image: { type: "string", format: "url" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    role: { type: "string", enum: ["buyer", "seller"] },
    token: { type: "string", format: "jwt" },
    sellerStats: {
        type: "object",
        properties: {
            id: { type: "string" },
            rating: { type: "number" },
            joinedDate: { type: "string" },
            responseTime: { type: "string" },
            salesCount: { type: "number" },
            location: { type: "string" },
            description: { type: "string" },
        },
        nullable: true,
    },
    buyerStats: {
        type: "object",
        properties: {
            id: { type: "string" },
            purchasesCount: { type: "number" },
            totalSpent: { type: "number" },
        },
        nullable: true,
    },
};

export const registerSchema = {
    body: {
        type: "object",
        required: ["name", "email", "password", "image", "role"],
        properties: {
            name: { type: "string", minLength: 1 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            image: { type: "string", format: "uri" },
            role: { type: "string", enum: ["buyer", "seller"] },
            sellerLocation: { type: "string" },
            sellerDescription: { type: "string" },
            sellerResponseTime: { type: "string" },
        },
    },
    response: {
        201: UserResponseDto,
    },
};

export const loginSchema = {
    body: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 1 },
        },
    },
    response: {
        200: UserResponseDto,
    },
};

export const getMeSchema = {
    response: {
        200: {
            type: "object",
            properties: UserResponseDto,
        },
    },
};

export const userUpdateSchema = {
    body: {
        type: "object",
        properties: {
            id: { type: "string" },
            name: { type: "string", minLength: 1 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            image: { type: "string", format: "uri" },
            role: { type: "string", enum: ["buyer", "seller"] },
            sellerLocation: { type: "string" },
            sellerDescription: { type: "string" },
            sellerResponseTime: { type: "string" },
        },
        required: ["id"],
    },
    response: {
        200: UserResponseDto,
    },
};
