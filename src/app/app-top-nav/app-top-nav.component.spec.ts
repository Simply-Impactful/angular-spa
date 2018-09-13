import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTopNavComponent } from './app-top-nav.component';
import { MaterialModule } from '../material.module';
import { MatSelectModule } from '@angular/material/select';

describe('AppTopNavComponent', () => {
  let component: AppTopNavComponent;
  let fixture: ComponentFixture<AppTopNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTopNavComponent],
      imports: [
        MaterialModule,
        MatSelectModule
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
