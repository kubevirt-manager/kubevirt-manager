import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { KClusterDetailsComponent } from './kcluster-details.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('KClusterDetailsComponent', () => {
  let component: KClusterDetailsComponent;
  let fixture: ComponentFixture<KClusterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [KClusterDetailsComponent],
    imports: [RouterTestingModule, FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(KClusterDetailsComponent);
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
  it('should contain Kubernetes Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#kube');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Services Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#services');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Control Plane Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#controlplane');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Node Pools Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#pools');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Change Control Plane Replicas', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-replicas-cp');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Change Node Pool Replicas', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-replicas-wp');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Windows: Delete Worker Pool', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-delete-wp');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Windows: Config Control Plane', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-config-cp');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Windows: Create Node Pool', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-new-wp');
    expect(contentValue).toBeTruthy();
  });
});
