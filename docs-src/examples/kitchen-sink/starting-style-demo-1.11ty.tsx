import React from 'react';
export default class Page {
  data() {
    return {
      layout: 'root.11ty.ts',
      title: '@starting-style Demo 1',
    };
  }
  render() {
    const css = String.raw;
    const style = css`
      body {
        padding: 1em;
      }
      #btn {
        flex-grow: 0;
        align-self: flex-start;
        padding: 1em;
      }
      .starting-style {
        width: 200px;
        height: 100px;
        border: 1px solid black;
        margin-top: 10px;
      }

      .starting-style::after {
        content: 'class: ' attr(class);
        position: relative;
        top: 3px;
        left: 3px;
      }

      .starting-style {
        background-color: yellow;
        transition: background-color 3s;
      }

      .starting-style.showing {
        background-color: skyblue;
      }

      @starting-style {
        .native.showing {
          background-color: red;
        }
      }
    `;

    const script = () => {
      btn.addEventListener('click', () => {
        btn.disabled = true;
        document.body.append(tmp.content.cloneNode(true));
        const divElem = document.createElement('div');
        divElem.classList.add('showing');
        canvas.appendChild(divElem);

        setTimeout(() => {
          canvas.querySelectorAll('.showing').forEach((elem) => {
            elem.classList.remove('showing');
          });

          setTimeout(() => {
            canvas.innerHTML = '';
            btn.disabled = false;
          }, 3000);
        }, 3000);
      });
    };
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: style}}></style>
        <template id="tmp">
          <div className="native starting-style showing"></div>
          <div className="shim starting-style showing">
            <css-starting-style selector=".shim.showing" cssText="background-color: red!important;"></css-starting-style>
          </div>
        </template>
        <button id="btn">
          Display <code>{'<div>'}</code>'s
        </button>
        <div id="canvas"></div>
        <script dangerouslySetInnerHTML={{__html: `(${script.toString()})()`}}></script>
      </>
    );
  }
}

declare const btn: HTMLButtonElement;
declare const tmp: HTMLTemplateElement;
declare const canvas: HTMLDivElement;
