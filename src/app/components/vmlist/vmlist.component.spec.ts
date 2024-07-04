import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VmlistComponent } from './vmlist.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('VmlistComponent', () => {
  let component: VmlistComponent;
  let fixture: ComponentFixture<VmlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [VmlistComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(VmlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain Window: New Virtual Machine', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-newvm');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Delete Virtual Machine', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-delete');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Resize Virtual Machine', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-resize');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Change Virtual Machine Type', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-type');
    expect(contentValue).toBeTruthy();
  });
});
