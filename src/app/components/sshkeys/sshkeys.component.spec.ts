import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SSHKeysComponent } from './sshkeys.component';
import { DebugElement } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DataTablesModule } from 'angular-datatables';
import { By } from '@angular/platform-browser';

describe('SSHKeysComponent', () => {
  let component: SSHKeysComponent;
  let fixture: ComponentFixture<SSHKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SSHKeysComponent ],
      imports: [DataTablesModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SSHKeysComponent);
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
    expect(contentValue.textContent).toContain('SSH');
  });
  it('should contain Refresh item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-sync'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain New SSH Key item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-plus-square'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
  it('should contain Main Datatable', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#sshList_datatable');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: New SSH Key', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-new');
    expect(contentValue).toBeTruthy();
  });
  it('should contain Window: Delete SSH Key', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.nativeElement;
    const contentValue = componentElem.querySelector('#modal-delete');
    expect(contentValue).toBeTruthy();
  });
});
