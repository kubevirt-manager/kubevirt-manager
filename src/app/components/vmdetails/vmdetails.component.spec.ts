import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { VmdetailsComponent } from './vmdetails.component';

describe('VmdetailsComponent', () => {
  let component: VmdetailsComponent;
  let fixture: ComponentFixture<VmdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ VmdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmdetailsComponent);
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
  it('should contain Tab: Details', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#details');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Tab: VM Console', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#vmconsole');
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
  it('should contain VNC Screen', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#screen');
    expect(contentValue).toBeTruthy();
  });
  it('should contain VNC Status', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#status');
    expect(contentValue).toBeTruthy();
  });
});
