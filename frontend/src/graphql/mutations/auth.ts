import { gql } from "@apollo/client";

import { USER_FIELDS } from "@/graphql/fragments/user";

export const LOGIN_MUTATION = gql`
  ${USER_FIELDS}
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  ${USER_FIELDS}
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`;
