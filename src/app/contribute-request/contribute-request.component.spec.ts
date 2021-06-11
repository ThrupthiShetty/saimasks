import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributeRequestComponent } from './contribute-request.component';

describe('ContributeRequestComponent', () => {
  let component: ContributeRequestComponent;
  let fixture: ComponentFixture<ContributeRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributeRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
