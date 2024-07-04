import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NodelistComponent } from './nodelist.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NodelistComponent', () => {
  let component: NodelistComponent;
  let fixture: ComponentFixture<NodelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NodelistComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
