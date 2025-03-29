import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFromComponent } from './employee-from.component';

describe('EmployeeFromComponent', () => {
  let component: EmployeeFromComponent;
  let fixture: ComponentFixture<EmployeeFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFromComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
