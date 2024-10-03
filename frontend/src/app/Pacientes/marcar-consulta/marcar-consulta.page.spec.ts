import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarcarConsultaPage } from './marcar-consulta.page';

describe('MarcarConsultaPage', () => {
  let component: MarcarConsultaPage;
  let fixture: ComponentFixture<MarcarConsultaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MarcarConsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
