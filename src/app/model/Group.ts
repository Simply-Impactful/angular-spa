export class Group {
    zipCode?: string;
    groupType?: string;
    subType?: string[]; // for admin metaData.. change to comma separated string
    groupSubType: string; // for users to create a group, they only need 1
    description?: string;
    other?: string;
    username?: string; // the leader in the request
    leader?: string; // the leaer in the response
    members?: Object[]; // for displaying the members
    membersString?: string; // for lambda call - requires string
    name?: string;
    groupAvatar?: string;
    pointsEarned: number;
    totalPoints: number; // response of get all groups
}
