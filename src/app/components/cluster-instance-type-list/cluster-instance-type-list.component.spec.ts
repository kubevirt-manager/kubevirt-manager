import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterInstanceTypeListComponent } from './cluster-instance-type-list.component';

describe('ClusterInstanceTypeListComponent', () => {
  let component: ClusterInstanceTypeListComponent;
  let fixture: ComponentFixture<ClusterInstanceTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClusterInstanceTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClusterInstanceTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
