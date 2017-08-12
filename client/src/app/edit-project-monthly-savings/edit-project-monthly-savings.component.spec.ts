import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectMonthlySavingsComponent } from './edit-project-monthly-savings.component';

describe('EditProjectMonthlySavingsComponent', () => {
  let component: EditProjectMonthlySavingsComponent;
  let fixture: ComponentFixture<EditProjectMonthlySavingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectMonthlySavingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectMonthlySavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
