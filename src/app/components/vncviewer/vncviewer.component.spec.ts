import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { VNCViewerComponent } from './vncviewer.component';

describe('VNCViewerComponent', () => {
  let component: VNCViewerComponent;
  let fixture: ComponentFixture<VNCViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ VNCViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VNCViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain status bar', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('#status'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue.textContent).toContain('namespace');
  });
  it('should contain VNC Screen', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#screen');
    expect(contentValue).toBeTruthy();
  });
});
