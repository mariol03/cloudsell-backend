import { RouteGenericInterface } from "fastify";
import { ItemCreateDto } from "../application/use-cases/create/dto/item-create.dto";
import { ItemUpdateDto } from "../application/use-cases/update/dto/item-update.dto";
import { ItemDeleteDto } from "../application/use-cases/delete/dto/item-delete.dto";

export interface CreateItemRoute extends RouteGenericInterface {
    Body: ItemCreateDto;
    Response: {
        id: { type: "string" };
        name: { type: "string" };
        description: { type: "string" };
        price: { type: "number" };
        createdAt: { type: "string"; format: "date-time" };
        updatedAt: { type: "string"; format: "date-time" };
    };
}

export interface UpdateItemRoute extends RouteGenericInterface {
    Body: ItemUpdateDto;
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            name: { type: "string" };
            description: { type: "string" };
            price: { type: "number" };
            createdAt: { type: "string"; format: "date-time" };
            updatedAt: { type: "string"; format: "date-time" };
        };
    };
}

export interface DeleteItemRoute extends RouteGenericInterface {
    Body: ItemDeleteDto;
    Response: {
        type: "object";
        properties: {
            success: { type: "boolean" };
            message: { type: "string" };
        };
    };
}
