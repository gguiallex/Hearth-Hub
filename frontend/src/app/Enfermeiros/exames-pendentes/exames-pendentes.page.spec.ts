import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamesPendentesPage } from './exames-pendentes.page';

describe('ExamesPendentesPage', () => {
  let component: ExamesPendentesPage;
  let fixture: ComponentFixture<ExamesPendentesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExamesPendentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
