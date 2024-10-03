import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaModalPage } from './consulta-modal.page';

describe('ConsultaModalPage', () => {
  let component: ConsultaModalPage;
  let fixture: ComponentFixture<ConsultaModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConsultaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
