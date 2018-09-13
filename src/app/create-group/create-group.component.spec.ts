import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupComponent } from './create-group.component';
import { MaterialModule } from '../material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('CreateGroupComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateGroupComponent],
      imports: [
        MaterialModule,
        MatGridListModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
