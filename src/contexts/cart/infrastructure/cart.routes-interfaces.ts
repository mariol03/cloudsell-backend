import { RouteGenericInterface } from "fastify";
import { AddToCartDto } from "../application/use-cases/add-to-cart/dto/add-to-card.dto";

export interface AddToCartRouteInterface extends RouteGenericInterface {
    Body: AddToCartDto;
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            userId: { type: "string" };
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
    Body: { userId: string, itemId: string };
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            userId: { type: "string" };
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
    Body: { userId: string };
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            userId: { type: "string" };
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
    Params: { userId: string };
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            userId: { type: "string" };
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

export interface UpdateCartRouteInterface extends RouteGenericInterface {
    Body: { userId: string, itemId: string, quantity: number };
    Response: {
        type: "object";
        properties: {
            id: { type: "string" };
            userId: { type: "string" };
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
