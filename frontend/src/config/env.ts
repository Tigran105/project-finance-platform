const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;

export const env = {
  graphqlUrl: graphqlUrl || "http://localhost:4000/graphql",
} as const;
