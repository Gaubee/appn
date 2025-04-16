import {iter_map_not_null} from '@gaubee/util';
import React, {ReactNode, type JSX} from 'react';
import {customElementDeclarations} from './custom-elements-metadata.ts';

declare global {
  interface HTMLElementTagNameMap {
    'api-table': HTMLElement;
  }
}

/**
 * This page generates its content from the custom-element.json file as read by
 * the _data/api.11tydata.js script.
 */
export default class Docs {
  data() {
    return {
      layout: 'page.11ty.ts',
      title: 'Appn ➡️ Docs',
      links: ['/css/api.css'],
    };
  }

  render(data) {
    return (
      <>
        <h1>API</h1>
        <nav id="sidebar">
          {customElementDeclarations.map((element) => (
            <li key={element.tagName}>
              <a href={`#${element.tagName}`}>&lt;{element.tagName}&gt;</a>
            </li>
          ))}
        </nav>
        <div id='content'>
          {customElementDeclarations.map((element) => (
            <article key={element.name}>
              <a href={`#${element.tagName}`}>
                <h2 id={element.tagName}>&lt;{element.tagName}&gt;</h2>
              </a>
              <div>{element.description}</div>
              {renderTable(
                'Static Properties',
                ['name', 'description', 'type.text', 'default'],
                iter_map_not_null(element.members, (m) => {
                  if (m.kind === 'field' && m.static && m.privacy !== 'private' && m.privacy !== 'protected') {
                    return m;
                  }
                })
              )}
              {renderTable(
                'Static Methods',
                ['name', 'parameters', 'description', 'return.type.text'],
                iter_map_not_null(element.members, (m) => {
                  if (m.kind === 'method' && m.static && m.privacy !== 'private' && m.privacy !== 'protected') {
                    return {
                      ...m,
                      parameters: renderTable('', ['name', 'description', 'type.text'], m.parameters),
                    };
                  }
                })
              )}
              {renderTable('Attributes', ['name', 'description', 'type.text', 'default'], element.attributes)}

              {renderTable(
                'Properties',
                ['name', 'attribute', 'description', 'type.text', 'default'],
                iter_map_not_null(element.members, (m) => {
                  if (m.kind === 'field' && !m.static && m.privacy !== 'private' && m.privacy !== 'protected' && !m.name.startsWith('on')) {
                    return {...m, attribute: m.attribute ?? m.name.toLowerCase()};
                  }
                })
              )}
              {renderTable(
                'Methods',
                ['name', 'parameters', 'description', 'return.type.text'],
                iter_map_not_null(element.members, (m) => {
                  if (m.kind === 'method' && m.privacy !== 'private' && m.privacy !== 'protected') {
                    return {
                      ...m,
                      parameters: renderTable('', ['name', 'description', 'type.text'], m.parameters),
                    };
                  }
                })
              )}

              {renderTable(
                'Events',
                [{path: 'name', th: 'eventname'}, 'description', {path: 'type.text', th: 'event type', fallback: 'Event'}],
                iter_map_not_null([...element.members, ...(element.events ?? []).map((e) => ({...e, kind: 'event' as const}))], (m) => {
                  if (
                    m.kind === 'field' &&
                    !m.static &&
                    m.privacy !== 'private' &&
                    m.privacy !== 'protected' &&
                    m.name.startsWith('on') &&
                    m.type?.text.startsWith('PropertyEventListener')
                  ) {
                    return {
                      name: m.name.slice(2),
                      description: m.description,
                      type: {
                        text: m.type.text.match(/PropertyEventListener<.+,(.+)>/)?.[1],
                      },
                    };
                  } else if (m.kind === 'event') {
                    return m;
                  }
                })
              )}
              {renderTable('Slots', [{path: 'name', fallback: <i>(default)</i>}, 'description'], element.slots)}
              {renderTable('CSS Shadow Parts', ['name', 'description'], element.cssParts)}
              {renderTable('CSS Custom Properties', ['name', 'description'], element.cssProperties)}
            </article>
          ))}
        </div>
      </>
    );
  }
}

type TableColumnProperty =
  | string
  | {
      path: string;
      th?: string;
      fallback?: string | ReactNode;
    };
/**
 * Reads a (possibly deep) path off of an object.
 */
const get = (obj: any, path: TableColumnProperty): string | ReactNode => {
  let fallback: string | ReactNode = '';
  if (typeof path === 'object') {
    fallback = path.fallback ?? '';
    path = path.path;
  }
  const parts = path.split('.');
  while (obj && parts.length) {
    obj = obj[parts.shift()!];
  }
  return obj == null || obj === '' ? fallback : obj;
};

/**
 * Renders a table of data, plucking the given properties from each item in
 * `data`.
 */
const renderTable = (name: string, properties: TableColumnProperty[], data: any[] | undefined): JSX.Element | string => {
  if (data === undefined || data.length === 0) {
    return '';
  }
  return (
    <>
      {name && <h3>{name}</h3>}
      <table>
        <thead>
          <tr>
            {properties.map((p, index) => (
              <th key={index}>{capitalize((typeof p === 'object' ? p.path : p).split('.')[0])}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {properties.map((p, colIndex) => (
                <td key={colIndex}>{get(item, p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const capitalize = (s) => s[0].toUpperCase() + s.substring(1);
