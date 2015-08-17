/* global jest, describe, it, expect */
"use strict";

jest.dontMock('../LazyRender.jsx');
jest.dontMock('element-size');

describe('LazyRender', function() {
  var React = require('react/addons');
  var LazyRender = require('../LazyRender.jsx');
  var TestUtils = React.addons.TestUtils;

  function makeComponent(childCount, props) {
    props = props || {};

    var children = [];
    for (var i = 0; i < childCount; i++) {
      children.push(<div className="child" key={i} style={{ height: 20 }}>{i}</div>);
    }

    var div = document.createElement('div');
    document.body.appendChild(div);
    var component = React.render(<LazyRender maxHeight={200} {...props}>{children}</LazyRender>, div);

    return component;
  }

  it('renders 1 child', function() {
    var lazy = makeComponent(1);

    var renderedChildren = TestUtils.scryRenderedDOMComponentsWithClass(
      lazy, 'child'
    );
    expect(renderedChildren.length).toEqual(1);
  });

  it('renders children', function() {
    var lazy = makeComponent(10);

    var renderedChildren = TestUtils.scryRenderedDOMComponentsWithClass(
      lazy, 'child'
    );
    expect(renderedChildren.length).toEqual(10);
  });

  it('only renders children that are visible', function() {
    var lazy = makeComponent(100);

    var renderedChildren = TestUtils.scryRenderedDOMComponentsWithClass(
      lazy, 'child'
    );
    expect(renderedChildren.length).toEqual(13); // item of children plus default padding
  });

  it('renders configurable number of children for padding', function() {
    var lazy = makeComponent(100, {itemPadding:5});

    var renderedChildren = TestUtils.scryRenderedDOMComponentsWithClass(
      lazy, 'child'
    );
    expect(renderedChildren.length).toEqual(15);
  });

  it('renders children passed in by data', function() {
    var childData = [];

    for(var i = 0; i < 10; i++) {
      childData.push({value: i, label: "Number " + i});
    }

    function childGen(data, index) {
      return <div className="child" key={data.value} style={{ height: 20 }}>{data.label}</div>
    }

    var lazy = makeComponent(0, {generatorData: childData, generatorFunction: childGen});

    var renderedChildren = TestUtils.scryRenderedDOMComponentsWithClass(
      lazy, 'child'
    );
    expect(renderedChildren.length).toEqual(10);
  });

  it('renders default children when it has no data to display', function() {
    var childData = [];

    function childGen() {
      return <div>Blank</div>
    }

    var lazy = makeComponent(1, {generatorData: childData, generatorFunction: childGen});

    var renderedChildren = TestUtils.scryRenderedDOMComponentsWithClass(
      lazy, 'child'
    );
    expect(renderedChildren.length).toEqual(1);
  })
});

