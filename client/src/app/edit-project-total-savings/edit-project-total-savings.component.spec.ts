import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectTotalSavingsComponent } from './edit-project-total-savings.component';

describe('EditProjectTotalSavingsComponent', () => {
  let component: EditProjectTotalSavingsComponent;
  let fixture: ComponentFixture<EditProjectTotalSavingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectTotalSavingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectTotalSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
