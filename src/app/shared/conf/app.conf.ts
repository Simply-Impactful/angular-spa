export const AppConf: any = {
    appTitle: 'It All Adds Up',
    default: {
        userProfile: 'https://s3.amazonaws.com/simply-impactful-image-data/defaults/default-profile-pic.png',
        groupAvatar: 'https://s3.amazonaws.com/simply-impactful-image-data/defaults/groupAvatar.png',
        facts: 'https://s3.amazonaws.com/simply-impactful-image-data/defaults/groupAvatar.png'// TODO: replace
    },
    aws: {
        lambdaVersion: '',
        s3Version: '2006-03-01'
    },
    imgFolders: {
        adminLanding: 'admin',
        groups: 'groups',
        actions: 'actions',
        assignments: 'assignments',
        facts: 'facts'
    }
};
