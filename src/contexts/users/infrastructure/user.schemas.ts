const UserResponseDto = {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
    image: { type: "string", format: "url" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    role: { type: "string", enum: ["buyer", "seller"] },
    token: { type: "string", format: "jwt" },
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
        },
        required: ["id"],
    },
    response: {
        200: UserResponseDto,
    },
};
