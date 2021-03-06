import { environment } from '../../../environments/environment';

export const AppConf: any = {
    appTitle: 'It All Adds Up',
    imagesBucketName: 'simply-impactful-image-data',
    default: {
        userProfile: 'https://s3.amazonaws.com/simply-impactful-image-data/defaults/default-profile-pic.png',
        groupAvatar: 'https://s3.amazonaws.com/simply-impactful-image-data/defaults/groupAvatar.png',
        facts: 'https://s3.amazonaws.com/simply-impactful-image-data/defaults/groupAvatar.png', // TODO: replace
        factOfTheDayKey: 'factOfTheDay.json',
        factOfTheDayUri: 'https://s3.amazonaws.com/simply-impactful-image-data/facts/factOfTheDay.json',
        },
    aws: {
        region: environment.region,
        lambdaVersion: '',
        s3Version: '2006-03-01',
    },
    imgFolders: {
        default: 'images',
        adminLanding: 'admin',
        userProfile: 'userProfile',
        groups: 'groups',
        actions: 'actions',
        tileIcons: 'Tile+icons',
        assignments: 'assignments',
        facts: 'facts'
    }
};
