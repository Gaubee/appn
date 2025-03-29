import React from 'react';
import {styleText} from './css-scroll-container.css.ts';

export default class Page {
  data() {
    return {
      layout: 'example.11ty.ts',
      tags: 'example',
      name: 'css `scroll-state()`',
      description: 'A shadow visual affordance to indicate scroll',
    };
  }
  render(data) {
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>

        <section id="example-1">
          <h3>scroll-state(scrollable: top)</h3>
          <div className="scroll-container">
            <div className="scroller">
              <div className="item">One</div>
              <div className="item">Two</div>
              <div className="item">Three</div>
              <div className="item">Four</div>
              <div className="item">Five</div>
              <div className="item">Six</div>
              <div className="item">Seven</div>
              <div className="item">Eight</div>
              <div className="item">Nine</div>
              <div className="item">Ten</div>
            </div>
          </div>
        </section>

        <section id="example-2">
          <h3>scroll-state(stuck: top)</h3>
          <div className="scroll-container">
            <div className="stuck-top">
              <div className="content">Stuck Top!!</div>
            </div>
            <div className="scroller">
              {Array.from({length: 6}, (_, i) => (
                <div className="item">Item 1/{i}</div>
              ))}
              {Array.from({length: 6}, (_, i) => (
                <div className="item">Item 2/{i}</div>
              ))}
              {Array.from({length: 6}, (_, i) => (
                <div className="item">Item 3/{i}</div>
              ))}
            </div>
            <div className="stuck-bottom">
              <div className="content">Stuck Bottom!!</div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
