import { gql } from "@apollo/client";

import { INVITATION_FIELDS } from "@/graphql/fragments/invitation";

export const INVITE_USER_MUTATION = gql`
  ${INVITATION_FIELDS}
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      ...InvitationFields
    }
  }
`;

export const ACCEPT_INVITATION_MUTATION = gql`
  ${INVITATION_FIELDS}
  mutation AcceptInvitation($id: ID!) {
    acceptInvitation(id: $id) {
      ...InvitationFields
    }
  }
`;

export const REJECT_INVITATION_MUTATION = gql`
  ${INVITATION_FIELDS}
  mutation RejectInvitation($id: ID!) {
    rejectInvitation(id: $id) {
      ...InvitationFields
    }
  }
`;
