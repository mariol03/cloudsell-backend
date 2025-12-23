import { RouteGenericInterface } from "fastify";
import { AddToCartDto } from "../application/use-cases/add-to-cart/dto/add-to-card.dto";

export interface AddToCartRouteInterface extends RouteGenericInterface {
    Body: AddToCartDto;
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            ownerId: { type: "string" };
            items: {
                type: "array";
                items: {
                    type: "object";
                    properties: {
                        itemId: { type: "string" };
                        quantity: { type: "number" };
                    }
                }
            }
        }
    };
}

export interface RemoveFromCartRouteInterface extends RouteGenericInterface {
    Body: { ownerId: string, itemId: string };
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            ownerId: { type: "string" };
            items: {
                type: "array";
                items: {
                    type: "object";
                    properties: {
                        itemId: { type: "string" };
                        quantity: { type: "number" };
                    }
                }
            }
        }
    };
}

export interface CheckoutRouteInterface extends RouteGenericInterface {
    Body: { ownerId: string };
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            ownerId: { type: "string" };
            items: {
                type: "array";
                items: {
                    type: "object";
                    properties: {
                        itemId: { type: "string" };
                        quantity: { type: "number" };
                    }
                }
            }
        }
    };
}

export interface GetCartRouteInterface extends RouteGenericInterface {
    Params: { ownerId: string };
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            ownerId: { type: "string" };
            items: {
                type: "array";
                items: {
                    type: "object";
                    properties: {
                        itemId: { type: "string" };
                        quantity: { type: "number" };
                    }
                }
            }
        }
    };
}
