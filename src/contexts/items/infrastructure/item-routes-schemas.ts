const itemSchema = {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    stock: { type: "number" },
    image: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    user: {
        type: "object",
        properties: { id: { type: "string" } },
    },
    category: {
        type: "array",
        items: {
            type: "object",
            properties: {
                id: { type: "string" },
                name: { type: "string" },
            },
        },
    },
};

// Esquema de respuesta para obtener todos los items basado en ItemEntity
export const getItemsSchema = {
    querystring: {
        type: "object",
        properties: {
            categoryId: { type: "string" },
            minPrice: { type: "number" },
            maxPrice: { type: "number" },
            page: { type: "number" },
            pageSize: { type: "number" },
        },
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: itemSchema,
            },
        },
    },
};

// Esquema de respuesta para obtener un solo item basado en ItemEntity
export const getItemByIdSchema = {
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
            // El campo 'id' es requerido para buscar el item por su identificador
        },
        required: ["id"],
    },
    response: {
        200: {
            type: "object",
            properties: itemSchema,
        },
    },
};

// Esquema para crear un item
export const createItemSchema = {
    body: {
        type: "object",
        properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            image: { type: "string" },
            stock: { type: "number" },
            userId: { type: "string" },
            categories: {
                type: "array",
                items: { type: "string" },
            },
            // Agrega aquí otras propiedades requeridas para crear un item
        },
        required: ["name", "description", "price", "image", "stock"],
    },
    response: {
        201: {
            type: "object",
            properties: itemSchema,
        },
    },
};

// Esquema para actualizar un item basado en ItemUpdateDto y ItemEntity
export const updateItemSchema = {
    body: {
        type: "object",
        properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            image: { type: "string" },
            stock: { type: "number" },
            user: { type: "string" },
            categories: {
                type: "array",
                items: { type: "string" },
            },
            // El campo 'id' es requerido, los demás son opcionales según el DTO
        },
        required: ["id"],
    },
    response: {
        200: {
            type: "object",
            properties: itemSchema,
        },
    },
};

// Esquema para eliminar un item
export const deleteItemSchema = {
    body: {
        type: "object",
        properties: {
            id: { type: "string" },
            user: { type: "string" },
            // El campo 'id' es requerido para eliminar el item
        },
        required: ["id"],
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" },
                // Puedes agregar más información si lo consideras necesario
            },
        },
    },
};

// Esquema para obtener un item por nombre
export const getItemByNameSchema = {
    params: {
        type: "object",
        properties: {
            name: { type: "string" },
            // El campo 'name' es requerido para buscar el item por nombre
        },
        required: ["name"],
    },
    response: {
        200: {
            type: "object",
            properties: itemSchema,
        },
    },
};

export const getItemByUserIdSchema = {
    params: {
        type: "object",
        properties: {
            userId: { type: "string" },
        },
        required: ["userId"],
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: itemSchema,
            },
        },
    },
};

// Esquema para eliminar una categoría de un item
export const deleteCategorySchema = {
    body: {
        type: "object",
        properties: {
            item: {
                type: "object",
                properties: {
                    id: { type: "string" },
                },
                required: ["id"],
            },
            category: {
                type: "object",
                properties: {
                    id: { type: "string" },
                },
                required: ["id"],
            },
        },
        required: ["item", "category"],
    },
    response: {
        200: {
            type: "object",
            properties: {
                message: { type: "string" },
            },
        },
    },
};
