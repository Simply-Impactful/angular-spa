import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTopNavComponent } from './admin-top-nav.component';
import { MaterialModule } from '../material.module';
import { MatSelectModule } from '@angular/material/select';

describe('AppTopNavComponent', () => {
  let component: AdminTopNavComponent;
  let fixture: ComponentFixture<AdminTopNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTopNavComponent],
      imports: [
        MaterialModule,
        MatSelectModule
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
