"use strict";

var React = require('react');
var _ = require('lodash');
var fs = require('fs');

var Header = require('./components/header.jsx');
var Footer = require('./components/footer.jsx');
var GithubRibbon = require('./components/github-ribbon.jsx');
var CodeSnippet = require('./components/code-snippet.jsx');
var Install = require('./components/install.jsx');

var LazyRender = require('../');

var NAMES = [
  "Thea Neeld",
  "Katharina Massie",
  "Janene Tillinghast",
  "Lucia Brookins",
  "Louann Crase",
  "Jillian Loring",
  "Luciana Blanchard",
  "Kathern Kiel",
  "Patty Jeter",
  "Rodrick Ovellette",
  "Nilsa Sparrow",
  "Renae Luque",
  "Shawn Reiter",
  "Thomasena Southern",
  "Sheron Kroner",
  "Yuonne Housman",
  "Oliva Stroop",
  "Tomiko Milliken",
  "Sigrid Bell",
  "Zulema Harte",
  "Julian Brixey",
  "Herta Scher",
  "Delma Wengert",
  "Alejandro Sennett",
  "Norine Water",
  "Zonia Frisch",
  "Robyn Rote",
  "Katharine Hadnot",
  "Jed Eidson",
  "Maricela Merrifield",
  "Della Hausman",
  "Natalie Goodsell",
  "Odis Goulette",
  "Mai Emmanuel",
  "Eulah Bench",
  "Rayna Piatt",
  "Idalia Noakes",
  "Patsy Gaines",
  "Nita Douthit",
  "Barry Tapper",
  "Clarence Stottlemyer",
  "Paula Ryles",
  "Willetta Praylow",
  "Henry Newby",
  "Maximina Brace",
  "Lakita Fekete",
  "Elaine Spinner",
  "Sadie Cogar",
  "Shoshana Hoeft",
  "Denver Patridge"
];

var basicExample = fs.readFileSync(
  __dirname + '/code-snippets/basic.jsx', 'utf8'
);


var Index = React.createClass({
  getInitialState: function() {
    return {
      limit: 5000
    };
  },

  handleClick: function(limit, event) {
    event.preventDefault();
    this.setState({
      limit: limit
    });
  },

  render: function() {
    var rows = _.range(this.state.limit).map(function(row) {
      var index = row % 50;
      return <div className="list-item">
        #{row + 1} {NAMES[index]}
      </div>;
    });

    return (
        <div className="index-component-container">
          <Header />
          <GithubRibbon />

          <div className="content">
            <div className="examples">
              <div className="example-controls">
                <div className="example-controls__count">
                  Viewing {this.state.limit / 1000}K records
                </div>
                <div className="example-controls__limits">
                  <a href="#" className="example-controls__button"
                    onClick={this.handleClick.bind(null, 5000)}>
                    5K Records
                  </a>
                  <a href="#" className="example-controls__button"i
                    onClick={this.handleClick.bind(null, 25000)}>
                    25K Records
                  </a>
                  <a href="#" className="example-controls__button"
                    onClick={this.handleClick.bind(null, 500000)}>
                    500K Records
                  </a>
                </div>
              </div>
              <LazyRender maxHeight={200} className="example-container">
                {rows}
              </LazyRender>

              <CodeSnippet language="javascript" toggle={false}>
                {basicExample}
              </CodeSnippet>
            </div>

            <Install />
          </div>

          <Footer />
        </div>

    );
  }
});

module.exports = Index;
