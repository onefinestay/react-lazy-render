"use strict";

var React = require('react/addons');
var elementSize = require("element-size");

var LazyRender = React.createClass({
  propTypes: {
    children: React.PropTypes.array.isRequired,
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
    var container = React.findDOMNode(this.refs.container);
    var scrollTop = container.scrollTop;
    var childrenLength = this.getChildrenLength(this.props);

    var childrenTop = Math.floor(scrollTop / this.state.childHeight);
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

    var marginTop = parseInt(elementStyle.marginTop) || 0;
    var marginBottom = parseInt(elementStyle.marginBottom) || 0;

    var elementHeight =
      (elementStyle.height ? parseInt(elementStyle.height) : null)
      || element.clientHeight
      || elementSize(element)[1] - marginTop - marginBottom;

    return elementHeight + marginBottom; //remove one margin since the margins are shared by adjacent elements
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

    var childrenTop = Math.floor(this.state.scrollTop / childHeight);
    var childrenBottom = (childrenLength - childrenTop -
                          this.state.childrenToRender);

    if (childrenBottom < 0) {
      childrenBottom = 0;
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
    var firstChild = this.refs['child-0'];
    var el = React.findDOMNode(firstChild);
    return this.getElementHeight(el);
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

    var children = this.props.children;
    if(React.Children.count(children) === 1) {
      children = [children];
    }

    var childrenToRender = children.slice(start, end);

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
