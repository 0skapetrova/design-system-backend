import { ERRORS } from "../utils/errors/errorCatalog";

const ERROR_CODES = Object.keys(ERRORS);

export const openapiDocument = {
    openapi: "3.0.0",
    info: {
        title: "Design System API",
        version: "0.1.0"
    },
    servers: [
        {
            url: "http://localhost:3000"
        }
    ],
    paths: {
        "/api/auth/me": {
            get: {
                summary: "get current user",
                responses: {
                    "200": {
                        description: "Успешный ответ с данными текущего пользователя",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/UserPublic"
                                }
                            }
                        }
                    },
                    "401": {
                        description: "UNAUTHORIZED",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        description: "USER_NOT_FOUND",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            UserPublic: {
                type: "object",
                properties: {
                    id: {
                        type: "string"
                    },
                    username: {
                        type: "string"
                    },
                    phone: {
                        type: "string"
                    },
                    display_name: {
                        type: "string",
                        nullable: true
                    },
                    avatar_url: {
                        type: "string",
                        nullable: true
                    },
                    created_at: {
                        type: "string"
                    }
                }
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    error: {
                        type: "string",
                        enum: ERROR_CODES
                    },
                    message: {
                        type: "string"
                    },
                    details: {
                        type: "string",
                        nullable: true
                    }
                }
            }
        }
    }
}