import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FirewallListComponent } from './firewall-list.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FirewallListComponent', () => {
  let component: FirewallListComponent;
  let fixture: ComponentFixture<FirewallListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [FirewallListComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(FirewallListComponent);
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
    expect(contentValue.textContent).toContain('Firewall Rules');
  });
  it('should contain New Rule item', () => {
    const componentDoc: DebugElement = fixture.debugElement;
    const componentElem = componentDoc.query(By.css('.fa-plus-square'))
    const contentValue = componentElem.nativeElement;
    expect(contentValue).toBeTruthy();
  });
});
