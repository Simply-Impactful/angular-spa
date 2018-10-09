import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleRowPaginatorComponent } from './double-row-paginator.component';

describe('DoubleRowPaginatorComponent', () => {
  let component: DoubleRowPaginatorComponent;
  let fixture: ComponentFixture<DoubleRowPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubleRowPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleRowPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
