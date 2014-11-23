"use strict";

var React = require('react/addons');
var _ = require('lodash');

var Header = require('./components/header.jsx');
var Footer = require('./components/footer.jsx');
var GithubRibbon = require('./components/github-ribbon.jsx');
var CodeSnippet = require('./components/code-snippet.jsx');
var Install = require('./components/install.jsx');

var LazyRender = require('../');

var Index = React.createClass({
  render: function() {
    var rows = _.range(50000).map(function(row) {
      var fizzBuzz = '';
      if (row % 3 === 0) fizzBuzz += 'Fizz';
      if (row % 5 === 0) fizzBuzz += 'Buzz';
      return <div style={{ height: 20 }}>{row + 1} {fizzBuzz}</div>;
    });

    return (
      <html>
        <head>
          <title>React Lazy Render Demo</title>
          <link href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/styles/docco.min.css' rel='stylesheet' type='text/css'></link>
          <link href="css/index.css" rel="stylesheet"></link>
        </head>
        <body>
          <Header />
          <GithubRibbon />

          <div className="content">
            <div className="examples">
              <LazyRender maxHeight={200}>
                {rows}
              </LazyRender>
            </div>

            <Install />
          </div>

          <Footer />

          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/highlight.min.js" charSet="utf-8"></script>
          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/languages/javascript.min.js" charSet="utf-8"></script>
          <script src="build/index.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
