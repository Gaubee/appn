import { queryEffect } from './utils';

describe('queryEffect', () => {
  let container: HTMLDivElement;
  debugger

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should detect when an element is added', (done) => {
    const cleanup = queryEffect(container, '.test-element', (element) => {
      expect(element).not.toBeNull();
      expect(element?.textContent).toBe('Test');
      cleanup();
      done();
    });

    const element = document.createElement('div');
    element.className = 'test-element';
    element.textContent = 'Test';
    container.appendChild(element);
  });

  it('should detect when multiple elements are added with selectAll option', (done) => {
    const cleanup = queryEffect(
      container,
      '.test-element',
      (elements) => {
        expect(elements.length).toBe(2);
        cleanup();
        done();
      },
      { selectAll: true }
    );

    const element1 = document.createElement('div');
    element1.className = 'test-element';
    const element2 = document.createElement('div');
    element2.className = 'test-element';

    container.appendChild(element1);
    container.appendChild(element2);
  });

  it('should detect when an element is removed', (done) => {
    const element = document.createElement('div');
    element.className = 'test-element';
    container.appendChild(element);

    let callCount = 0;
    const cleanup = queryEffect(container, '.test-element', (element) => {
      callCount++;
      if (callCount === 1) {
        expect(element).not.toBeNull();
      } else if (callCount === 2) {
        expect(element).toBeNull();
        cleanup();
        done();
      }
    });

    container.removeChild(element);
  });

  it('should cleanup properly when unsubscribed', () => {
    let callCount = 0;
    const cleanup = queryEffect(container, '.test-element', () => {
      callCount++;
    });

    cleanup();

    const element = document.createElement('div');
    element.className = 'test-element';
    container.appendChild(element);

    expect(callCount).toBe(1); // Initial call only
  });

  it('should handle attribute mutations with mutationOptions', (done) => {
    const element = document.createElement('div');
    element.className = 'initial';
    container.appendChild(element);

    const cleanup = queryEffect(
      container,
      '.test-element',
      (element) => {
        expect(element).not.toBeNull();
        cleanup();
        done();
      },
      {
        mutationOptions: {
          attributes: true,
          attributeFilter: ['class'],
          subtree: true,
        },
      }
    );

    element.className = 'test-element';
  });
});