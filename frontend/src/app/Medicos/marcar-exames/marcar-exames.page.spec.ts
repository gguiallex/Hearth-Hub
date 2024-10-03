import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarcarExamesPage } from './marcar-exames.page';

describe('MarcarExamesPage', () => {
  let component: MarcarExamesPage;
  let fixture: ComponentFixture<MarcarExamesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MarcarExamesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
