import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDeleteDialogComponent } from './action-delete-dialog.component';

describe('ActionDeleteDialogComponent', () => {
  let component: ActionDeleteDialogComponent;
  let fixture: ComponentFixture<ActionDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
