"use strict";

var React = require('react/addons');
var elementSize = require("element-size");
var cloneWithProps = React.addons.cloneWithProps;

var LazyRender = React.createClass({displayName: "LazyRender",
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

  getElementHeight: function(element) {
    var marginTop = parseInt(window.getComputedStyle(element).marginTop);
    return elementSize(element)[1] - marginTop; //remove one margin since the margins are shared by adjacent elements
  },

  componentWillReceiveProps: function(nextProps) {
    var childHeight = this.state.childHeight || 1;
    if(!this.state.childHeight && this.getChildHeight){
      childHeight = this.getChildHeight();
    }

    var childrenTop = Math.floor(this.state.scrollTop / childHeight);
    var childrenBottom = (nextProps.children.length - childrenTop -
                          this.state.childrenToRender);

    if (childrenBottom < 0) {
      childrenBottom = 0;
    }

    var height = this.getHeight(
      nextProps.children.length,
      childHeight,
      nextProps.maxHeight
    );

    var numberOfItems = Math.ceil(height / childHeight);

    if (height === this.props.maxHeight) {
      numberOfItems += this.props.itemPadding;
    }

    this.setState({
      childHeight: childHeight,
      childrenTop: childrenTop,
      childrenBottom: childrenBottom,
      childrenToRender: numberOfItems,
      height: height
    });
  },

  componentDidMount: function() {
    var childHeight = this.getChildHeight();

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

  componentDidUpdate: function() {
    //important to update the child height in the case that the children change(example: ajax call for data)
    if (this.state.childHeight !== this.getChildHeight()) {
      this.setState({childHeight: this.getChildHeight()});
    }
  },

  getChildHeight: function() {
    var firstChild = this.refs['child-0'];
    var el = firstChild.getDOMNode();
    return this.getElementHeight(el);
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

    return (
      React.createElement("div", {style: { height: this.state.height, overflowY: 'auto'}, 
        className: this.props.className, 
        ref: "container", 
        onScroll: this.onScroll}, 
        children
      )
    );
  }
});

module.exports = LazyRender;
