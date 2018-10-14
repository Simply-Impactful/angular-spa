export class Group {
    zipcode?: string;
    type?: string;
    subType?: string[]; // for admin metaData
    groupSubType: string; // for users to create a group, they only need 1
    description?: string;
    other?: string;
    isgroupCreated?: boolean;
    groupLeader?: string;
    members?: Object[]; // for displaying the members
    groupMembers?: string; // for lambda call - requires string
    name?: string;
    groupAvatar?: string;
}
