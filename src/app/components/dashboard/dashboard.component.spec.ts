import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const k8sSpy = jasmine.createSpyObj('K8sService',['getNodes'])

    await TestBed.configureTestingModule({
    declarations: [DashboardComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain Prometheus Row One item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('#prometheus-row-one'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Chart: CPU', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#CpuChart');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Chart: Memory', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#MemChart');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Prometheus Row Two item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('#prometheus-row-two'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Chart: Network', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#NetChart');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Chart: Storage', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#StgChart');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Row One item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('#row-one'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Row Two item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('#row-two'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Row Three item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('#row-three'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain node-info', () => {
    component.nodeInfo.running = 1;
    component.nodeInfo.total = 1;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#node-info');
    expect(contentValue.textContent).toContain('1/1');
  });
  it('should contain vm-info', () => {
    component.vmInfo.running = 1;
    component.vmInfo.total = 1;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#vm-info');
    expect(contentValue.textContent).toContain('1/1');
  });
  it('should contain disk-info', () => {
    component.discInfo = 99;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#disk-info');
    expect(contentValue.textContent).toContain('99');
  });
  it('should contain pool-info', () => {
    component.poolInfo.total = 99;
    component.poolInfo.running = 99;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#pool-info');
    expect(contentValue.textContent).toContain('99/99');
  });
  it('should contain cpu-info', () => {
    component.cpuInfo = 128;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#cpu-info');
    expect(contentValue.textContent).toContain('128');
  });
  it('should contain mem-info', () => {
    component.memInfo = 512;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#mem-info');
    expect(contentValue.textContent).toContain('512 GB');
  });
  it('should contain storage-info', () => {
    component.storageInfo = 1024;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#storage-info');
    expect(contentValue.textContent).toContain('1024 GB');
  });
  it('should contain net-info', () => {
    component.netInfo = 5;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#net-info');
    expect(contentValue.textContent).toContain('5');
  });
  it('should contain cluster-info', () => {
    component.kclusterInfo = 5;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#cluster-info');
    expect(contentValue.textContent).toContain('5');
  });
  it('should contain as-info', () => {
    component.autoscaleInfo = 8;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#as-info');
    expect(contentValue.textContent).toContain('8');
  });
  it('should contain it-info', () => {
    component.instanceTypesInfo = 11;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#it-info');
    expect(contentValue.textContent).toContain('11');
  });
  it('should contain svc-info', () => {
    component.loadBalancers = 11;
    fixture.detectChanges();
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#svc-info');
    expect(contentValue.textContent).toContain('11');
  });

});
