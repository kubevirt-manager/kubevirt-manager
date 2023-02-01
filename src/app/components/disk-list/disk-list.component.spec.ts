import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { DiskListComponent } from './disk-list.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DiskListComponent', () => {
  let component: DiskListComponent;
  let fixture: ComponentFixture<DiskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      declarations: [ DiskListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiskListComponent);
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
    expect(contentValue.textContent).toContain('Data Volumes');
  });
  it('should contain New Disk item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-plus'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
});
