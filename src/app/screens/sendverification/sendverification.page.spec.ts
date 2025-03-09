import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendverificationPage } from './sendverification.page';

describe('SendverificationPage', () => {
  let component: SendverificationPage;
  let fixture: ComponentFixture<SendverificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SendverificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
