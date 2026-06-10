import { gql } from "@apollo/client";

import { PROJECT_FIELDS } from "@/graphql/fragments/project";

export const PROJECTS_QUERY = gql`
  ${PROJECT_FIELDS}
  query Projects {
    projects {
      ...ProjectFields
    }
  }
`;

export const PROJECT_QUERY = gql`
  ${PROJECT_FIELDS}
  query Project($id: ID!) {
    project(id: $id) {
      ...ProjectFields
    }
  }
`;
