import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultasMarcadasPage } from './consultas-marcadas.page';

describe('ConsultasMarcadasPage', () => {
  let component: ConsultasMarcadasPage;
  let fixture: ComponentFixture<ConsultasMarcadasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConsultasMarcadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
