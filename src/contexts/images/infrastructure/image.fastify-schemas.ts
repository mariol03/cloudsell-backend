export const uploadImageSchema = {
    consumes: ["multipart/form-data"],
    body: {
        type: "object",
        required: ["image", "name"], // 'name' sigue siendo requerido
        properties: {
            image: { isFile: true },
            name: {
                type: "object",
                required: ["value"],
                properties: {
                    value: { type: "string", minLength: 3 }, // Validamos el valor real aquí
                },
            },
        },
    },
};

// esquema de descarga de imagen es un GET
export const downloadImageSchema = {
    params: {
        type: "object",
        required: ["url"],
        properties: {
            url: { type: "string" },
        },
    },
};

export interface MultipartBody {
    name: { value: string };
    image: {
        toBuffer: () => Promise<Buffer>;
        filename: string;
        mimetype: string;
    };
}
