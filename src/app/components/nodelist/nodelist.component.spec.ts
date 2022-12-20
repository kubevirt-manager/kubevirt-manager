import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { NodelistComponent } from './nodelist.component';

describe('NodelistComponent', () => {
  let component: NodelistComponent;
  let fixture: ComponentFixture<NodelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ NodelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
