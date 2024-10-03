import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamesMarcadosPage } from './exames-marcados.page';

describe('ExamesMarcadosPage', () => {
  let component: ExamesMarcadosPage;
  let fixture: ComponentFixture<ExamesMarcadosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExamesMarcadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
