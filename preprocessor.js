"use strict";

var ReactTools = require('react-tools');

module.exports = {
  process: function(src, file) {
    if (!/\.jsx$/.test(file)) {
      return src;
    }
    return ReactTools.transform(src);
  }
};
