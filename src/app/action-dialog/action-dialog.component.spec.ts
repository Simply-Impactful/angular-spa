import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ActionDialogComponent } from './action-dialog.component';
import { ActionService } from '../services/action.service';

import { MaterialModule } from '../material.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('ActionDialogComponent', () => {
  let component: ActionDialogComponent;
  let fixture: ComponentFixture<ActionDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActionDialogComponent
      ],
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        MatDialogModule
      ],
      providers: [
        ActionService,
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
