import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessUsersComponent } from './admin-access-users.component';

describe('AdminAccessUsersComponent', () => {
  let component: AdminAccessUsersComponent;
  let fixture: ComponentFixture<AdminAccessUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccessUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccessUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
