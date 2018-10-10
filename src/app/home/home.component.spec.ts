import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ActionComponent } from '../action/action.component';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../material.module';

import { ActionService } from '../services/action.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CognitoUtil } from '../services/cognito.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActionComponent,
        HomeComponent
      ],
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        CognitoUtil,
        ActionService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
