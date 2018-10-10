import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CreateGroupComponent } from './create-group.component';
import { UploadComponent } from '../upload/upload.component';

import { MaterialModule } from '../material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';

describe('CreateGroupComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateGroupComponent,
        UploadComponent
      ],
      imports: [
        AngularFileUploaderModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        MatGridListModule,
        MatFormFieldModule,
        HttpClientTestingModule
      ],
      providers: [
        LambdaInvocationService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
