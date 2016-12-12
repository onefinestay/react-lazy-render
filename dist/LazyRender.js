"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var elementSize = require("element-size");

var LazyRender = React.createClass({displayName: "LazyRender",
  propTypes: {
    maxHeight: React.PropTypes.number.isRequired,

    className: React.PropTypes.string,
    itemPadding: React.PropTypes.number,

    generatorData: React.PropTypes.array,
    generatorFunction: React.PropTypes.func
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
      height: this.props.maxHeight,
      generatorData: null,
      generatorFunction: null
    };
  },

  componentWillMount: function() {
    var hasGeneratorData = this.props.generatorData === null;
    var hasGeneratorFunction = this.props.generatorFunction === null;

    if(!hasGeneratorData && hasGeneratorFunction) {
      console.error('generatorFunction was supplied, but generatorData was not');
    }

    if(hasGeneratorData && !hasGeneratorFunction) {
      console.log('generatorData was supplied without generatorFunction');
    }
  },

  onScroll: function() {
    var container = this.refs.container;
    var scrollTop = container.scrollTop;
    var childrenLength = this.getChildrenLength(this.props);

    var oldChildTop = this.state.childrenTop;
    var calcTop = scrollTop / this.state.childHeight;
    var tolerance = 0.1;

    var childrenTop = oldChildTop

    if(Math.abs(oldChildTop - calcTop) > tolerance) {
      childrenTop = Math.floor(calcTop);
    }

    var childrenBottom = (childrenLength - childrenTop -
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
    return maxHeight;
    // Return the maxHeight as a stop gap fix for now because the calculation below
    // is incorrect because the getElementHeight function is slightly innacurate for unknown reasons
    var fullHeight = numChildren * childHeight;
    if (fullHeight < maxHeight) {
      return fullHeight;
    } else {
      return maxHeight;
    }
  },

  getElementHeight: function(element) {
    if(element === null) {
      return 0;
    }

    var elementStyle = window.getComputedStyle(element);

    var height = parseFloat(elementStyle.getPropertyValue('height')) || 0

    var ua = window.navigator.userAgent;
    var ie10orOlder = ua.indexOf("MSIE ") >= 0;
    var ie11 = ua.indexOf("Trident") >= 0;

    if(ie10orOlder || ie11) {
      var borderTop = parseFloat(elementStyle.getPropertyValue('border-top-width')) || 0
      var borderBottom = parseFloat(elementStyle.getPropertyValue('border-bottom-width')) || 0
      var marginTop = parseFloat(elementStyle.getPropertyValue('margin-top')) || 0
      var marginBottom = parseFloat(elementStyle.getPropertyValue('margin-bottom')) || 0
      var paddingTop = parseFloat(elementStyle.getPropertyValue('padding-top')) || 0
      var paddingBottom = parseFloat(elementStyle.getPropertyValue('padding-bottom')) || 0

      height += borderTop + borderBottom + marginTop + marginBottom + paddingTop + paddingBottom;
      return height;
    }
    // Use this height calculation for Modern browsers, it will include all the borders/margins needed to be accurate
    else {
      var marginTop = parseInt(window.getComputedStyle(element).marginTop);
      return elementSize(element)[1] - marginTop; //remove one margin since the margins are shared by adjacent elements
    }

  },

  getChildrenLength: function(props) {
    if(props.generatorData) {
      return props.generatorData.length || React.Children.count(props.children);
    }

    return React.Children.count(props.children);
  },

  componentWillReceiveProps: function(nextProps) {
    var childHeight = this.state.childHeight || 1;
    var childrenLength = this.getChildrenLength(nextProps);

    if(!this.state.childHeight && this.getChildHeight){
      childHeight = this.getChildHeight();
    }

    var height = this.getHeight(
      childrenLength,
      childHeight,
      nextProps.maxHeight
    );

    var numberOfItems = Math.ceil(height / childHeight);

    if (height === this.props.maxHeight) {
      numberOfItems += this.props.itemPadding;
    }

    var childrenTop = Math.floor(this.state.scrollTop / childHeight);

    // if children top is larger than the max item count, set it to the bottom
    childrenTop = Math.min(childrenTop, childrenLength - numberOfItems);
    childrenTop = Math.max(childrenTop, 0);

    var childrenBottom = (childrenLength - childrenTop -
                          this.state.childrenToRender);

    childrenBottom = Math.max(childrenBottom, 0);

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
    var childrenLength = this.getChildrenLength(this.props);

    var height = this.getHeight(
      childrenLength,
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
      childrenBottom: childrenLength - numberOfItems,
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
    var firstChild = ReactDOM.findDOMNode(this.refs['child-0']);

    return this.getElementHeight(firstChild);
  },

  generateChildren: function() {
    var start = this.state.childrenTop;
    var end = this.state.childrenTop + this.state.childrenToRender;
    var generationData = this.props.generatorData || [];
    generationData = generationData.slice(start, end);

    if(generationData.length === 0) {
      return this.cloneChildren();
    }

    return generationData.map(function(data, index) {
      var element = this.props.generatorFunction(data, index + start);

      if(index === 0) {
        return React.cloneElement(element, {ref: 'child-' + index});
      }

      return element
    }, this);
  },

  cloneChildren: function() {
    var start = this.state.childrenTop;
    var end = this.state.childrenTop + this.state.childrenToRender;

    var childrenToRender = this.props.children.slice(start, end);

    return childrenToRender.map(function(child, index) {
      if (index === 0) {
        return React.cloneElement(child, {ref: 'child-' + index});
      }
      return child;
    });
  },

  getChildren: function() {
    if(this.props.generatorFunction) {
      return this.generateChildren();
    }

    return this.cloneChildren();
  },

  render: function() {
    var children = this.getChildren();
    var childHeight = (this.state.childHeight) ? this.state.childHeight : 0;
    var childrenBottom = (this.state.childrenBottom) ? this.state.childrenBottom : 0;
    children.unshift(
      React.createElement("div", {style: 
        { height: this.state.childrenTop * childHeight}, 
      key: "top"})
    );

    children.push(
      React.createElement("div", {style: 
        { height: childrenBottom * childHeight}, 
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
