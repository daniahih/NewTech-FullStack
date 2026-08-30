const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Movies API",
    version: "1.0.0",
    description: "A simple CRUD API for managing movies",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  tags: [
    {
      name: "Movies",
    },
  ],
  paths: {
    "/movies": {
      get: {
        summary: "Get all movies",
        tags: ["Movies"],
        responses: {
          200: {
            description: "List of movies",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Movie" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Add a new movie",
        tags: ["Movies"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MovieInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Movie created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Movie" },
              },
            },
          },
          400: {
            description: "Title and rating are required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/movies/{id}": {
      get: {
        summary: "Get a movie by id",
        tags: ["Movies"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
            description: "The movie id",
          },
        ],
        responses: {
          200: {
            description: "The requested movie",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Movie" },
              },
            },
          },
          404: {
            description: "Movie not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update a movie",
        tags: ["Movies"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
            description: "The movie id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MovieInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Movie updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Movie" },
              },
            },
          },
          404: {
            description: "Movie not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a movie",
        tags: ["Movies"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
            description: "The movie id",
          },
        ],
        responses: {
          200: {
            description: "Movie deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Movie not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Movie: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Interstellar" },
          rating: { type: "number", example: 9 },
        },
      },
      MovieInput: {
        type: "object",
        required: ["title", "rating"],
        properties: {
          title: { type: "string", example: "Interstellar" },
          rating: { type: "number", example: 9 },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

export default swaggerSpec;
