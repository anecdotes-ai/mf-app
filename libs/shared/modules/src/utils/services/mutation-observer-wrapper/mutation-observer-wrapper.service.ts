import { Observable } from 'rxjs';

export class MutationObserverWrapper {
  observeAllChanges(target: HTMLElement): Observable<any> {
    return this.observe(target, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }

  observeChanges(target: HTMLElement, options?: MutationObserverInit): Observable<any> {
    return this.observe(target, options);
  }

  private observe(target: HTMLElement, options?: MutationObserverInit): Observable<any> {
    return new Observable((subscriber) => {
      const observer = new MutationObserver(() => subscriber.next());
      observer.observe(target, options);
      return () => observer.disconnect();
    });
  }
}
