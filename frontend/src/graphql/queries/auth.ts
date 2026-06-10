import { gql } from "@apollo/client";

import { USER_FIELDS } from "@/graphql/fragments/user";

export const ME_QUERY = gql`
  ${USER_FIELDS}
  query Me {
    me {
      ...UserFields
    }
  }
`;
