import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VNCViewerComponent } from './vncviewer.component';

describe('VNCViewerComponent', () => {
  let component: VNCViewerComponent;
  let fixture: ComponentFixture<VNCViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
});
