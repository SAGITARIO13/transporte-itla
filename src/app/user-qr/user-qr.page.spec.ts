import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserQRPage } from './user-qr.page';

describe('UserQRPage', () => {
  let component: UserQRPage;
  let fixture: ComponentFixture<UserQRPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserQRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
