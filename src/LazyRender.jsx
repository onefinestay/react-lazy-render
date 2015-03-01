"use strict";

var React = require('react/addons');
var cloneWithProps = React.addons.cloneWithProps;

var LazyRender = React.createClass({
  propTypes: {
    children: React.PropTypes.array.isRequired,
    maxHeight: React.PropTypes.number.isRequired,

    className: React.PropTypes.string,
    itemPadding: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      itemPadding: 3
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

  onScroll: function() {
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

    if (height === this.props.maxHeight) {
      numberOfItems += this.props.itemPadding;
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
    var el = firstChild.getDOMNode();
    var childHeight = (el.style.height ? el.style.height.replace('px', '') :
                       null) || el.clientHeight;

    var height = this.getHeight(
      this.props.children.length,
      childHeight,
      this.props.maxHeight
    );

    var numberOfItems = Math.ceil(height / childHeight);

    if (height === this.props.maxHeight) {
      numberOfItems += this.props.itemPadding;
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
      <div style={
        { height: this.state.childrenTop * this.state.childHeight }
      } key="top"></div>
    );

    children.push(
      <div style={
        { height: this.state.childrenBottom * this.state.childHeight }
      } key="bottom"></div>
    );

    return (
      <div style={{ height: this.state.height, overflowY: 'auto' }}
        className={this.props.className}
        ref="container"
        onScroll={this.onScroll}>
        {children}
      </div>
    );
  }
});

module.exports = LazyRender;
