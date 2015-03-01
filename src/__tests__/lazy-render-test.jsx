/* global jest, describe, it, expect */
"use strict";

jest.dontMock('../LazyRender.jsx');

describe('LazyRender', function() {
  var React = require('react/addons');
  var LazyRender = require('../LazyRender.jsx');
  var TestUtils = React.addons.TestUtils;

  it('renders children', function() {
    var children = [];
    for (var i = 0; i < 10; i++) {
      children.push(<div className="child" style={{ height: 20 }}>{i}</div>);
    }

    var lazy = TestUtils.renderIntoDocument(
      <LazyRender maxHeight={200}>
        {children}
      </LazyRender>
    );

    var renderedChildren = TestUtils.scryRenderedDOMComponentsWithClass(
      lazy, 'child'
    );
    expect(renderedChildren.length).toEqual(10);
  });

  it('only renders children that are visible', function() {
    var children = [];
    for (var i = 0; i < 100; i++) {
      children.push(<div className="child" style={{ height: 20 }}>{i}</div>);
    }

    var lazy = TestUtils.renderIntoDocument(
      <LazyRender maxHeight={200}>
        {children}
      </LazyRender>
    );

    var renderedChildren = TestUtils.scryRenderedDOMComponentsWithClass(
      lazy, 'child'
    );
    expect(renderedChildren.length).toEqual(13); // item of children plus default padding
  });

  it('renders configurable number of children for padding', function() {
    var children = [];
    for (var i = 0; i < 100; i++) {
      children.push(<div className="child" style={{ height: 20 }}>{i}</div>);
    }

    var lazy = TestUtils.renderIntoDocument(
      <LazyRender maxHeight={200} itemPadding={5}>
        {children}
      </LazyRender>
    );

    var renderedChildren = TestUtils.scryRenderedDOMComponentsWithClass(
      lazy, 'child'
    );
    expect(renderedChildren.length).toEqual(15);
  });
});

