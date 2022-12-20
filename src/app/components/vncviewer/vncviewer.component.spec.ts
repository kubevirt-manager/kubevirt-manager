import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});
