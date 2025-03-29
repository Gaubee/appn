import {iter_map_not_null} from '@gaubee/util';
import React, {type JSX} from 'react';
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
    };
  }

  render(data) {
    return (
      <>
        <h1>API</h1>
        {customElementDeclarations.map((element) => (
          <div key={element.name}>
            <h2>&lt;{element.tagName}&gt;</h2>
            <div>{element.description}</div>
            {renderTable(
              'Attributes',
              ['name', 'description', 'type.text', 'default'],
              element.attributes
            )}
            {renderTable(
              'Properties',
              ['name', 'attribute', 'description', 'type.text', 'default'],
              element.members.filter((m) => m.kind === 'field')
            )}
            {renderTable(
              'Methods',
              ['name', 'parameters', 'description', 'return.type.text'],
              iter_map_not_null(element.members, (m) => {
                if (m.kind === 'method' && m.privacy !== 'private') {
                  return {
                    ...m,
                    parameters: renderTable(
                      '',
                      ['name', 'description', 'type.text'],
                      m.parameters
                    ),
                  };
                }
              })
            )}
            {renderTable('Events', ['name', 'description'], element.events)}
            {renderTable(
              'Slots',
              [['name', '(default)'], 'description'],
              element.slots
            )}
            {renderTable(
              'CSS Shadow Parts',
              ['name', 'description'],
              element.cssParts
            )}
            {renderTable(
              'CSS Custom Properties',
              ['name', 'description'],
              element.cssProperties
            )}
          </div>
        ))}
      </>
    );
  }
}

/**
 * Reads a (possibly deep) path off of an object.
 */
const get = (obj: any, path: string | [string, string]): string => {
  let fallback = '';
  if (Array.isArray(path)) {
    [path, fallback] = path;
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
const renderTable = (
  name: string,
  properties: (string | [string, string])[],
  data: any[] | undefined
): JSX.Element | string => {
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
              <th key={index}>
                {capitalize((Array.isArray(p) ? p[0] : p).split('.')[0])}
              </th>
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
