import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { KClusterPoolDetailsComponent } from './kcluster-pool-details.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('KClusterDetailsComponent', () => {
  let component: KClusterPoolDetailsComponent;
  let fixture: ComponentFixture<KClusterPoolDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [KClusterPoolDetailsComponent],
    imports: [RouterTestingModule, FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(KClusterPoolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain Overview Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#overview');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Template Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#template');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Autoscaling Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#autoscaling');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Virtual Machines Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#virtualmachines');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Change Node Pool Replicas', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-wp-replicas');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Autoscaling', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-wp-autoscaling');
    expect(contentValue).toBeTruthy();
  });
});
