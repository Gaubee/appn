/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const fs = require('fs');

module.exports = function () {
  return {
    api: {
      customElements: JSON.parse(
        fs.readFileSync('custom-elements.json', 'utf-8')
      ),
    },
  };
};
