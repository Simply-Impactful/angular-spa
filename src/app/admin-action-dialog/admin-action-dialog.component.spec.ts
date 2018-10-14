import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdminActionDialogComponent } from './admin-action-dialog.component';
import { ActionService } from '../services/action.service';

import { MaterialModule } from '../material.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('AdminActionDialogComponent', () => {
  let component: AdminActionDialogComponent;
  let fixture: ComponentFixture<AdminActionDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminActionDialogComponent
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
    fixture = TestBed.createComponent(AdminActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
