import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ActionComponent } from './action.component';
import { ActionService } from '../services/action.service';

import { MaterialModule } from '../material.module';
import { MatCardModule } from '@angular/material/card';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ActionComponent', () => {
  let component: ActionComponent;
  let fixture: ComponentFixture<ActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionComponent],
      imports: [HttpClientTestingModule, MaterialModule, MatCardModule],
      providers: [ActionService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
