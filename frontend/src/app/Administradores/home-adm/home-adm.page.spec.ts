import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeAdmPage } from './home-adm.page';

describe('HomeAdmPage', () => {
  let component: HomeAdmPage;
  let fixture: ComponentFixture<HomeAdmPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeAdmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
