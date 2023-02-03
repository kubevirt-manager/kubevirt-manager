import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VMPoolsComponent } from './vmpools.component';
import { DebugElement } from '@angular/core';

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
  it('should contain component title', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('h3');
    expect(contentValue.textContent).toContain('VM Pools');
  });
});
