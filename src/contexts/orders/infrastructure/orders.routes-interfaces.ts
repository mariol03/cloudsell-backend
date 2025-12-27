export interface CreateOrderRouteInterface {
    Body: {
        userId: string;
    };
}

export interface ListOrdersRouteInterface {
    Params: {
        userId: string;
    };
}