import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessActionsComponent } from './admin-access-actions.component';

describe('AdminAccessActionsComponent', () => {
  let component: AdminAccessActionsComponent;
  let fixture: ComponentFixture<AdminAccessActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccessActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccessActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
