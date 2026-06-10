import { gql } from "@apollo/client";

import { INVITATION_FIELDS } from "@/graphql/fragments/invitation";

export const MY_INVITATIONS_QUERY = gql`
  ${INVITATION_FIELDS}
  query MyInvitations {
    myInvitations {
      ...InvitationFields
    }
  }
`;
