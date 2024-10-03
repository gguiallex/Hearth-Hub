import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicoPage } from './medico.page';

describe('MedicoPage', () => {
  let component: MedicoPage;
  let fixture: ComponentFixture<MedicoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
