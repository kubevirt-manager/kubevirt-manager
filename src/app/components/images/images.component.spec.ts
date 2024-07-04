import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagesComponent } from './images.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ImagesComponent', () => {
  let component: ImagesComponent;
  let fixture: ComponentFixture<ImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesComponent ],
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesComponent);
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
    expect(contentValue.textContent).toContain('Images');
  });
  it('should contain Window: New Image', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-new');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Delete Image', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-delete');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Image Info', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-info');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Edit Image', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-edit');
    expect(contentValue).toBeTruthy();
  });
});