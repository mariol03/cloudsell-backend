export interface CreateOrderRouteInterface {
    Body: {
        ownerId: string;
    };
}

export interface ListOrdersRouteInterface {
    Params: {
        ownerId: string;
    };
}