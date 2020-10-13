import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Levels } from '../model/Levels';
import { LogInService } from '../services/log-in.service';
import { Parameters } from '../services/parameters';
import { CognitoUtil, LoggedInCallback, Callback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { User } from '../model/User';
import { LevelsEnum } from '../model/levelsEnum';
import { Integer } from 'aws-sdk/clients/apigateway';

@Component({
    selector: 'app-level-popup',
    templateUrl: './level-popup.component.html',
    styleUrls: ['./level-popup.component.scss']
})
export class LevelPopupComponent implements OnChanges {

    @Input() user: User = new User;
    @Input() currLevel: string;
    nextLevel: string;
    pointsToNextLevel: Integer = 0;
    showLevelModal: boolean = true;
    highEndPoints: Number;
    lowEndPoints: Number;

    ngOnChanges() {
        if (this.user !== undefined) {
            this.getNextLevel(this.currLevel);
        }
    }

    closeDialog() {
        document.getElementById('mmodal').style.visibility = 'hidden';
        document.getElementById('mmodal-background').style.visibility = 'hidden';
    }

    setBarWidth() {
        const percentage: Number = (this.user.totalPoints) / LevelsEnum[this.currLevel] * 100;
        document.getElementById('innerBar').style.width = String(percentage + '%');
    }


    getNextLevel(level: string) {
        const keys = Object.keys(LevelsEnum).slice(10, 20);
        const index: number = keys.indexOf(String(level));
        const nextLevel = Object.values(LevelsEnum)[index + 1];
        this.nextLevel = String(nextLevel);
        this.pointsToNextLevel = LevelsEnum[this.currLevel] - this.user.totalPoints;
        this.setBarWidth();

        this.highEndPoints = LevelsEnum[this.currLevel];
        this.lowEndPoints = Number(LevelsEnum[Object.values(LevelsEnum)[index - 1]]);
    }
}
