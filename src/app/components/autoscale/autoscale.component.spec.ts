import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoscaleComponent } from './autoscale.component';

describe('AutoscaleComponent', () => {
  let component: AutoscaleComponent;
  let fixture: ComponentFixture<AutoscaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoscaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
