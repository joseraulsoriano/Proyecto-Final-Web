import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteComment } from './confirm-delete-comment';

describe('ConfirmDeleteComment', () => {
  let component: ConfirmDeleteComment;
  let fixture: ComponentFixture<ConfirmDeleteComment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteComment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteComment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
