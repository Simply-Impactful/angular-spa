import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessLevelComponent } from './admin-access-level.component';

describe('AdminAccessLevelComponent', () => {
  let component: AdminAccessLevelComponent;
  let fixture: ComponentFixture<AdminAccessLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccessLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccessLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
