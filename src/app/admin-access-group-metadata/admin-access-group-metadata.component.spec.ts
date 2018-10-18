import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessGroupMetadataComponent } from './admin-access-group-metadata.component';

describe('AdminAccessGroupMetadataComponent', () => {
  let component: AdminAccessGroupMetadataComponent;
  let fixture: ComponentFixture<AdminAccessGroupMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccessGroupMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccessGroupMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
