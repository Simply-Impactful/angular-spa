import { Component, OnInit, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Levels } from '../model/Levels';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Group } from '../model/Group';
import { Member } from '../model/Member';

export class LevelsMapping {
  levels: Levels[];
  lambdaService: LambdaInvocationService;

  isLoggedIn(message: string, loggedIn: boolean): void {}
    callbackWithParams(error: AWSError, result: any): void {
      if (result) {
        const response = JSON.parse(result);
        this.levels = response.body;
        console.log('response.body', response.body);
       } else {
        console.log('error pulling the levels data: ' + error);
        if (error.toString().includes('credentials')) {
          // retry
          this.lambdaService.listLevelData(this);
        }
      }
    }

    getData() {
        const lambdaService = new LambdaInvocationService;
        lambdaService.listLevelData(this);
    }
    getUserLevel(group: Group, i: number): Member {
      //  find the graphic for the value in the range
      const value = group.groupMembers[i].pointsEarned;
      for (let j = 0; j < this.levels.length; j++) {
          if (this.levels[j].min <= value && this.levels[j].max >= value) {
            group.groupMembers[i].level = this.levels[j].statusGraphicUrl;
          }
      }
      return group.groupMembers[i];
    }

    callbackWithParam(result: any): void {}
  }
