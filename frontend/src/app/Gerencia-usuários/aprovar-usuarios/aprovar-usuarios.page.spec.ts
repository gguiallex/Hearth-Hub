import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AprovarUsuariosPage } from './aprovar-usuarios.page';

describe('AprovarUsuariosPage', () => {
  let component: AprovarUsuariosPage;
  let fixture: ComponentFixture<AprovarUsuariosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AprovarUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
