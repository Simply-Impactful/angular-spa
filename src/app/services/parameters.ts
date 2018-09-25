import { BehaviorSubject } from 'rxjs';
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { User } from '../model/User';

export class Parameters {
    userSource = new BehaviorSubject(new User());

    //  public userCopy = new User;
      name: string;
      value: string;
      user$ = this.userSource.asObservable();
      user = new User();

      buildUser(result: CognitoUserAttribute[], cognitoUser: CognitoUser) {
        for (let i = 0; i < result.length; i++) {
            let property = result[i].getName();
            if (property.startsWith('custom:')) {
              property = property.substring(7);
            }
            this.user[property] = result[i].getValue();
          }
          this.user.username = cognitoUser.getUsername();
          this.userSource.next(this.user);
          return this.user;
      }
  }
