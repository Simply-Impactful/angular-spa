import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionConfirmDialogComponent } from './action-confirm-dialog.component';

describe('ActionConfirmDialogComponent', () => {
  let component: ActionConfirmDialogComponent;
  let fixture: ComponentFixture<ActionConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
