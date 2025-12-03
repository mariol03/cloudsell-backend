import { FastifyInstance } from "fastify";
import { createCategoryController, deleteCategoryController, retrieveAllCategoriesController, retrieveCategoryByIdController, retrieveCategoryByNameController, updateCategoryController } from "./category.fastify-controller";

const createCategorySchema = {
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: 'string', minLength: 1 }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' }
            }
        }
    }
};

const getCategoryByIdSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' }
            }
        }
    }
};

const getCategoryByNameSchema = {
    params: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', minLength: 1 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' }
            }
        }
    }
};

const deleteCategorySchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' }
            }
        }
    }
};

const getCategoriesSchema = {
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' }
                }
            }
        }
    }
};         

const updateCateorySchema = {
    body: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
            id: { type: 'string' },
            name: { type: 'string', minLength: 1 },
            description: { type: 'string', minLength: 1 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' }
            }
        }
    }
};

export const categoryRoutes = async (fastify: FastifyInstance) => {
  fastify.put('/', { schema: createCategorySchema }, createCategoryController);
  fastify.get('/id/:id', { schema: getCategoryByIdSchema }, retrieveCategoryByIdController);
  fastify.get('/name/:name', { schema: getCategoryByNameSchema }, retrieveCategoryByNameController);
  fastify.patch('/', { schema: updateCateorySchema }, updateCategoryController);
  fastify.delete('/:id', { schema: deleteCategorySchema }, deleteCategoryController);
  fastify.get('/', { schema: getCategoriesSchema }, retrieveAllCategoriesController);
}
