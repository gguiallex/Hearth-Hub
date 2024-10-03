import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeEnfermeirosPage } from './home-enfermeiros.page';

describe('HomeEnfermeirosPage', () => {
  let component: HomeEnfermeirosPage;
  let fixture: ComponentFixture<HomeEnfermeirosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeEnfermeirosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
