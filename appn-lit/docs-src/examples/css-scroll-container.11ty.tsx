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
      </>
    );
  }
}
