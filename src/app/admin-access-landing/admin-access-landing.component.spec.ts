import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessLandingComponent } from './admin-access-landing.component';

describe('AdminAccessLandingComponent', () => {
  let component: AdminAccessLandingComponent;
  let fixture: ComponentFixture<AdminAccessLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccessLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccessLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
