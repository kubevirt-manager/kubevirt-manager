import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KClusterPoolDetailsComponent } from './kcluster-pool-details.component';

describe('KClusterPoolDetailsComponent', () => {
  let component: KClusterPoolDetailsComponent;
  let fixture: ComponentFixture<KClusterPoolDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KClusterPoolDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KClusterPoolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
