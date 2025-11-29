import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationAction } from './moderation-action';

describe('ModerationAction', () => {
  let component: ModerationAction;
  let fixture: ComponentFixture<ModerationAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModerationAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
