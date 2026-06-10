import { gql } from "@apollo/client";

import { PROJECT_FIELDS } from "@/graphql/fragments/project";
import { USER_FIELDS } from "@/graphql/fragments/user";

export const INVITATION_FIELDS = gql`
  ${USER_FIELDS}
  ${PROJECT_FIELDS}
  fragment InvitationFields on Invitation {
    id
    projectId
    email
    status
    invitedById
    createdAt
    updatedAt
    project {
      ...ProjectFields
    }
    invitedBy {
      ...UserFields
    }
  }
`;
