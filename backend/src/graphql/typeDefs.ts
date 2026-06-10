export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type ProjectMember {
    id: ID!
    projectId: ID!
    userId: ID!
    user: User!
    createdAt: String!
  }

  type Project {
    id: ID!
    name: String!
    location: String!
    creatorId: ID!
    creator: User!
    members: [ProjectMember!]!
    createdAt: String!
    updatedAt: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateProjectInput {
    name: String!
    location: String!
  }

  input UpdateProjectInput {
    name: String
    location: String
  }

  type Query {
    health: String!
    dbHealth: String!
    me: User
    projects: [Project!]!
    project(id: ID!): Project!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
  }
`;
