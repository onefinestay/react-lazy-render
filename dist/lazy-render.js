"use strict";

var React = require('react/addons');
var _ = require('lodash');
var cloneWithProps = React.addons.cloneWithProps;
var cx = React.addons.classSet;

var LazyRender = React.createClass({displayName: 'LazyRender',
  propTypes: {
    children: React.PropTypes.array.isRequired,
    maxHeight: React.PropTypes.number.isRequired
  },

  getDefaultProps: function() {
    return {
      padding: 3
    };
  },

  getInitialState: function() {
    return {
      childrenTop: 0,
      childrenToRender: 10,
      scrollTop: 0,
      height: this.props.maxHeight
    };
  },

  onScroll: function(event) {
    var container = this.refs.container.getDOMNode();
    var scrollTop = container.scrollTop;

    var childrenTop = Math.floor(scrollTop / this.state.childHeight);
    var childrenBottom = (this.props.children.length - childrenTop -
                          this.state.childrenToRender);

    if (childrenBottom < 0) {
      childrenBottom = 0;
    }

    this.setState({
      childrenTop: childrenTop,
      childrenBottom: childrenBottom,
      scrollTop: scrollTop
    });
  },

  getHeight: function(numChildren, childHeight, maxHeight) {
    var fullHeight = numChildren * childHeight;
    if (fullHeight < maxHeight) {
      return fullHeight;
    } else {
      return maxHeight;
    }
  },

  componentWillReceiveProps: function(nextProps) {
    var childrenTop = Math.floor(this.state.scrollTop / this.state.childHeight);
    var childrenBottom = (nextProps.children.length - childrenTop -
                          this.state.childrenToRender);

    if (childrenBottom < 0) {
      childrenBottom = 0;
    }

    var height = this.getHeight(
      nextProps.children.length,
      this.state.childHeight,
      nextProps.maxHeight
    );

    var numberOfItems = Math.ceil(height / this.state.childHeight);

    if (height < this.props.maxHeight) {
      numberOfItems += this.props.padding;
    }

    this.setState({
      childrenTop: childrenTop,
      childrenBottom: childrenBottom,
      childrenToRender: numberOfItems,
      height: height
    });
  },

  componentDidMount: function() {
    var firstChild = this.refs['child-0'];
    var childHeight = firstChild.getDOMNode().clientHeight;

    var height = this.getHeight(
      this.props.children.length,
      childHeight,
      this.props.maxHeight
    );

    var numberOfItems = Math.ceil(height / childHeight);

    if (height < this.props.maxHeight) {
      numberOfItems += this.props.padding;
    }

    this.setState({
      childHeight: childHeight,
      childrenToRender: numberOfItems,
      childrenTop: 0,
      childrenBottom: this.props.children.length - numberOfItems,
      height: height
    });
  },

  render: function() {
    var start = this.state.childrenTop;
    var end = this.state.childrenTop + this.state.childrenToRender;

    var childrenToRender = this.props.children.slice(start, end);
    var children = childrenToRender.map(function(child, index) {
      if (index === 0) {
        return cloneWithProps(child, {ref: 'child-' + index, key: index});
      }
      return child;
    });

    children.unshift(
      React.createElement("div", {style: 
        { height: this.state.childrenTop * this.state.childHeight}, 
      key: "top"})
    );

    children.push(
      React.createElement("div", {style: 
        { height: this.state.childrenBottom * this.state.childHeight}, 
      key: "bottom"})
    );

    var classes = {};
    if (this.props.className) {
      if (typeof this.props.className === 'string') {
        classes[this.props.className] = true;
      } else {
        classes = _.assign({}, classes, this.props.className);
      }
    }

    return (
      React.createElement("div", {style: { height: this.state.height, overflowY: 'auto'}, 
        className: cx(classes), 
        ref: "container", 
        onScroll: this.onScroll}, 
        children
      )
    );
  }
});

module.exports = LazyRender;
