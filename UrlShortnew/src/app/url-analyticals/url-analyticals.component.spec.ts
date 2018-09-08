import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlAnalyticalsComponent } from './url-analyticals.component';

describe('UrlAnalyticalsComponent', () => {
  let component: UrlAnalyticalsComponent;
  let fixture: ComponentFixture<UrlAnalyticalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlAnalyticalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlAnalyticalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
