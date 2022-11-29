import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBalancersComponent } from './load-balancers.component';

describe('LoadBalancersComponent', () => {
  let component: LoadBalancersComponent;
  let fixture: ComponentFixture<LoadBalancersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadBalancersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadBalancersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
