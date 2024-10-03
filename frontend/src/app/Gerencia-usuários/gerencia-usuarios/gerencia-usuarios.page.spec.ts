import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciaUsuariosPage } from './gerencia-usuarios.page';

describe('GerenciaUsuariosPage', () => {
  let component: GerenciaUsuariosPage;
  let fixture: ComponentFixture<GerenciaUsuariosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GerenciaUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
