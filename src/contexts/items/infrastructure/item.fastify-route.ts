import { FastifyInstance } from "fastify";
import { createItemController, deleteItemController, getItemByIdController, getItemByNameController, getItemsController, updateItemController, addCategoryToItemController, deleteCategoryFromItemController } from "./item.fastify-controller";

// Esquema de respuesta para obtener todos los items basado en ItemEntity
const getItemsSchema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          category: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
}

// Esquema de respuesta para obtener un solo item basado en ItemEntity
const getItemByIdSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
      // El campo 'id' es requerido para buscar el item por su identificador
    },
    required: ['id']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
        // Agrega aquí otras propiedades relevantes del ItemEntity si existen
      }
    }
  }
}

// Esquema para crear un item
const createItemSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' }
      // Agrega aquí otras propiedades requeridas para crear un item
    },
    required: ['name', 'description']
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
        // Agrega aquí otras propiedades relevantes del ItemEntity si existen
      }
    }
  }
}

// Esquema para actualizar un item basado en ItemUpdateDto y ItemEntity
const updateItemSchema = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' }
      // El campo 'id' es requerido, los demás son opcionales según el DTO
    },
    required: ['id']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
        // Propiedades reflejando el modelo de ItemEntity
      }
    }
  }
}

// Esquema para eliminar un item
const deleteItemSchema = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'string' }
      // El campo 'id' es requerido para eliminar el item
    },
    required: ['id']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
        // Puedes agregar más información si lo consideras necesario
      }
    }
  }
}

// Esquema para obtener un item por nombre
const getItemByNameSchema = {
  params: {
    type: 'object',
    properties: {
      name: { type: 'string' }
      // El campo 'name' es requerido para buscar el item por nombre
    },
    required: ['name']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
        // Agrega aquí otras propiedades relevantes del ItemEntity si existen
      }
    }
  }
}

// Esquema para agregar una categoría a un item
const addCategorySchema = {
  body: {
    type: "object",
    properties: {
      item: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      },
      category: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      }
    },
    required: ["item", "category"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        category: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" }
            }
          }
        }
      }
    }
  }
};

// Esquema para eliminar una categoría de un item
const deleteCategorySchema = {
  body: {
    type: "object",
    properties: {
      item: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      },
      category: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      }
    },
    required: ["item", "category"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
};

export const itemRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", {schema: getItemsSchema}, getItemsController);
  fastify.get("/id/:id",{schema: getItemByIdSchema},getItemByIdController);
  fastify.get("/name/:name",{schema: getItemByNameSchema},getItemByNameController);
  fastify.put("/",{schema: createItemSchema},createItemController);
  fastify.patch("/",{schema: updateItemSchema},updateItemController);
  fastify.delete("/",{schema: deleteItemSchema},deleteItemController);
  fastify.post("/add-category", { schema: addCategorySchema }, addCategoryToItemController);
  fastify.post("/delete-category", { schema: deleteCategorySchema }, deleteCategoryFromItemController);
};