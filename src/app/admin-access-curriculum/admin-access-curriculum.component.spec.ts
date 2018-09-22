import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessCurriculumComponent } from './admin-access-curriculum.component';

describe('AdminAccessCurriculumComponent', () => {
  let component: AdminAccessCurriculumComponent;
  let fixture: ComponentFixture<AdminAccessCurriculumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccessCurriculumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccessCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
