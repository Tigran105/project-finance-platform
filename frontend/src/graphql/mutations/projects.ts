import { gql } from "@apollo/client";

import { PROJECT_FIELDS } from "@/graphql/fragments/project";

export const CREATE_PROJECT_MUTATION = gql`
  ${PROJECT_FIELDS}
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      ...ProjectFields
    }
  }
`;
