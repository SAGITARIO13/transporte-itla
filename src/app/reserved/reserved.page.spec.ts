import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservedPage } from './reserved.page';

describe('ReservedPage', () => {
  let component: ReservedPage;
  let fixture: ComponentFixture<ReservedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReservedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
