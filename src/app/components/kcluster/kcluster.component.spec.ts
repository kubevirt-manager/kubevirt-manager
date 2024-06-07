import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { KClusterComponent } from './kcluster.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('KClusterComponent', () => {
  let component: KClusterComponent;
  let fixture: ComponentFixture<KClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [KClusterComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(KClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain component title', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('h3');
    expect(contentValue.textContent).toContain('Clusters');
  });
  it('should contain Add Cluster item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-plus-square'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Clusters table', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.table-sm'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Delete screen', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-delete');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New ClusterScreen', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-new');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Standard Screen', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-newcluster');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Standard Screen: General Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newcluster-home');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Standard Screen: Details Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newcluster-details');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Standard Screen: Network Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newcluster-net');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Standard Screen: Control Plane Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newcluster-controlplane');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Standard Screen: Node Pool Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newcluster-nodepool');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Standard Screen: Advanced Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newcluster-advanced');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Custom Screen', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-newclustercustom');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Custom Screen: General Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newclustercustom-home');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Custom Screen: Details Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newclustercustom-details');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Custom Screen: Network Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newclustercustom-net');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Custom Screen: Control Plane Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newclustercustom-controlplane');
    expect(contentValue).toBeTruthy();
  });
  it('should contain New Cluster Custom Screen: Node Pool Tab', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#newclustercustom-nodepool');
    expect(contentValue).toBeTruthy();
  });
});
