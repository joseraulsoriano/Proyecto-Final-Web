import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorDashboard } from './professor-dashboard';

describe('ProfessorDashboard', () => {
  let component: ProfessorDashboard;
  let fixture: ComponentFixture<ProfessorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
