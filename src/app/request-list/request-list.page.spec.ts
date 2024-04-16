import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestListPage } from './request-list.page';

describe('RequestListPage', () => {
  let component: RequestListPage;
  let fixture: ComponentFixture<RequestListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RequestListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
