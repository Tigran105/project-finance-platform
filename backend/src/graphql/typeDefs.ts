export const typeDefs = `#graphql
  enum InvitationStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

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

  type Invitation {
    id: ID!
    projectId: ID!
    email: String!
    status: InvitationStatus!
    invitedById: ID!
    project: Project!
    invitedBy: User!
    createdAt: String!
    updatedAt: String!
  }

  type Expense {
    id: ID!
    projectId: ID!
    creatorId: ID!
    name: String!
    normalizedName: String!
    amount: Float!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type Income {
    id: ID!
    projectId: ID!
    creatorId: ID!
    name: String!
    normalizedName: String!
    amount: Float!
    creator: User!
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

  input InviteUserInput {
    projectId: ID!
    email: String!
  }

  input CreateExpenseInput {
    projectId: ID!
    name: String!
    amount: Float!
  }

  input UpdateExpenseInput {
    name: String
    amount: Float
  }

  input CreateIncomeInput {
    projectId: ID!
    name: String!
    amount: Float!
  }

  input UpdateIncomeInput {
    name: String
    amount: Float
  }

  type Query {
    health: String!
    dbHealth: String!
    me: User
    projects: [Project!]!
    project(id: ID!): Project!
    myInvitations: [Invitation!]!
    expenses(projectId: ID!): [Expense!]!
    incomes(projectId: ID!): [Income!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!

    inviteUser(input: InviteUserInput!): Invitation!
    acceptInvitation(id: ID!): Invitation!
    rejectInvitation(id: ID!): Invitation!

    createExpense(input: CreateExpenseInput!): Expense!
    updateExpense(id: ID!, input: UpdateExpenseInput!): Expense!
    deleteExpense(id: ID!): Boolean!

    createIncome(input: CreateIncomeInput!): Income!
    updateIncome(id: ID!, input: UpdateIncomeInput!): Income!
    deleteIncome(id: ID!): Boolean!
  }
`;
