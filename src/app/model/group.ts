export class Group {
    zipcode?: string;
    type?: string;
    subType?: string[];
    description?: string;
    other?: string;
    isgroupCreated?: boolean;
    groupLeader?: string;
    members?: Object[]; // for displaying the members
    groupMembers?: string; // for lambda call - requires string
    name?: string;
    groupAvatar?: string;
}
