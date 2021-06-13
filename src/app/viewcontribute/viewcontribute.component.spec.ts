import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcontributeComponent } from './viewcontribute.component';

describe('ViewcontributeComponent', () => {
  let component: ViewcontributeComponent;
  let fixture: ComponentFixture<ViewcontributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcontributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcontributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
