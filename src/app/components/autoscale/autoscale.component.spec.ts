import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AutoscaleComponent } from './autoscale.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AutoscaleComponent', () => {
  let component: AutoscaleComponent;
  let fixture: ComponentFixture<AutoscaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AutoscaleComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(AutoscaleComponent);
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
    expect(contentValue.textContent).toContain('Scaling Groups');
  });
  it('should contain Scaling Group item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-plus-square'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: New Auto Scaling Group', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-new');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Edit Auto Scaling Group', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-edit');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Delete Auto Scaling Group', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-delete');
    expect(contentValue).toBeTruthy();
  });
});
