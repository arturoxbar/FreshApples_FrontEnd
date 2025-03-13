import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SerieDetailPage } from './serie-detail.page';

describe('SerieDetailPage', () => {
  let component: SerieDetailPage;
  let fixture: ComponentFixture<SerieDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SerieDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
