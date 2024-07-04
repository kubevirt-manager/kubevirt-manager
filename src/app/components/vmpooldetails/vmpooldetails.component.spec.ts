import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VmpooldetailsComponent } from './vmpooldetails.component';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('VmpooldetailsComponent', () => {
  let component: VmpooldetailsComponent;
  let fixture: ComponentFixture<VmpooldetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [VmpooldetailsComponent],
    imports: [RouterTestingModule, FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(VmpooldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain Tab: Overview', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#overview');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Tab: Template', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#template');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Tab: Liveness', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#liveness');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Tab: Readiness', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#readiness');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Tab: Virtual Machines', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#virtualmachines');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Delete VM', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-deletevm');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Replicas', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-replicas');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Change Type', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-type');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Resize', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-resize');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Priority Class', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-pc');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Liveness', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-liveness');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Readiness', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-readiness');
    expect(contentValue).toBeTruthy();
  });
});
