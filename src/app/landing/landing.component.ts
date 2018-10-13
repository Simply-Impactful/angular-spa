import { Component, OnInit } from '@angular/core';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  conf = AppConf;
  factOfTheDayText: string = '';
  constructor(private s3: S3Service) { }

  ngOnInit() {
    this.factOfTheDayText = 'Americans use about 500 million plastic straws each day.';

    this.s3.listObject(this.conf.default.factOfTheDayKey, this.conf.imgFolders.facts, ((err, data) => {
      if (err) {
        console.error(err);
      }
      this.factOfTheDayText = data.factOfTheDayText;
    }));
  }


}
