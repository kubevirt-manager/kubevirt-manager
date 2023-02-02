import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VmlistComponent } from './vmlist.component';

describe('VmlistComponent', () => {
  let component: VmlistComponent;
  let fixture: ComponentFixture<VmlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ VmlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
