import { gql } from "@apollo/client";

import { USER_FIELDS } from "@/graphql/fragments/user";

export const PROJECT_FIELDS = gql`
  ${USER_FIELDS}
  fragment ProjectFields on Project {
    id
    name
    location
    creatorId
    createdAt
    updatedAt
    creator {
      ...UserFields
    }
    members {
      id
      projectId
      userId
      createdAt
      user {
        ...UserFields
      }
    }
  }
`;
