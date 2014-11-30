/* global jest, describe, it, expect */
"use strict";

jest.dontMock('../lazy-render.jsx');

describe('LazyRender', function() {
  it('renders children', function() {
    var React = require('react/addons');
    var LazyRender = require('../lazy-render.jsx');
    var TestUtils = React.addons.TestUtils;

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
      lazy, 'child');
    expect(renderedChildren.length).toEqual(10);
  });
});

