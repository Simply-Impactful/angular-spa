import { BehaviorSubject } from 'rxjs';
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { User } from '../model/User';

export class Parameters {
    userSource = new BehaviorSubject(new User());

    //  public userCopy = new User;
      name: string;
      value: string;
      user$ = this.userSource.asObservable();

      buildUser(result: CognitoUserAttribute[], cognitoUser: CognitoUser, user: User) {
          for (let i = 0; i < result.length; i++) {
              let property = result[i].getName();
              if (property.startsWith('custom:')) {
                property = property.substring(7);
              }
              user[property] = result[i].getValue();
          }
          user.username = cognitoUser.getUsername();
          this.userSource.next(user);
          return user;
      }
  }
