import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { VMPoolsComponent } from './vmpools.component';

describe('VMPoolsComponent', () => {
  let component: VMPoolsComponent;
  let fixture: ComponentFixture<VMPoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ VMPoolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VMPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
