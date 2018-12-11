import { Component, OnInit, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Levels } from '../model/Levels';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, LoggedInCallback, Callback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Group } from '../model/Group';
import { Member } from '../model/Member';
import { User } from '../model/User';

export class LevelsMapping {
  levels: Levels[];
  user: User;

    isLoggedIn(message: string, loggedIn: boolean): void {}

    // response of listLevelData
    cognitoCallbackWithParam (result: any): void {
      if (result) {
        const response = JSON.parse(result);
        if (response.statusCode !== 200) {
          // retry
          const lambdaService = new LambdaInvocationService();
          lambdaService.listLevelData(this);
        } else {
          this.levels = response.body;
          this.setLevels(this.levels);
        }
       }
    }

    callbackWithParams(error: AWSError, result: any): void {}

    setLevels(levels: Levels[]) {
      this.levels = levels;
    }

    getAllData() {
        const lambdaService = new LambdaInvocationService;
        lambdaService.listLevelData(this);
    }

    getUserLevel(user: User, levels: Levels[]): any {
      //  find the graphic for the value in the range
      const value = user.totalPoints;
      if (!value) {
        user.totalPoints = 0;
      }
      for (let j = 0; j < levels.length; j++) {
          if (levels[j].min <= value && levels[j].max >= value) {
            user.level = levels[j].statusGraphicUrl;
          }
      }
      return user.level;
    }

    getMembersLevels(group: Group, i: number): Member {
      //  find the graphic for the value in the range
      if (!group.members[i].totalMemberPoints) {
        group.members[i].totalMemberPoints = 0;
      }
      if (!group.members[i].pointsEarned) {
        group.members[i].pointsEarned = 0;
      }
      const value = group.members[i].totalMemberPoints;
      if (this.levels) {
        for (let j = 0; j < this.levels.length; j++) {
          if (this.levels[j].min <= value && this.levels[j].max >= value) {
            group.members[i].level = this.levels[j].statusGraphicUrl;
          }
        }
      }
      return group.members[i];
    }

    callbackWithParam(result: any): void {}

    callback(): void {}

    callbackWithParameters(error: AWSError, result: any) {}
  }
