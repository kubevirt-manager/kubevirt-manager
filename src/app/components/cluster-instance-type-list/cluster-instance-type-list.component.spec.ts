import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ClusterInstanceTypeListComponent } from './cluster-instance-type-list.component';
import { DebugElement } from '@angular/core';

describe('ClusterInstanceTypeListComponent', () => {
  let component: ClusterInstanceTypeListComponent;
  let fixture: ComponentFixture<ClusterInstanceTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ClusterInstanceTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClusterInstanceTypeListComponent);
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
    expect(contentValue.textContent).toContain('Cluster Instance Types');
  });
});
