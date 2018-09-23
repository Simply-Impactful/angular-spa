export class Parameters {
    //  public userCopy = new User;
      name: string;
      value: string;
      userSource = new BehaviorSubject(new User());
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
