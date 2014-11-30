var LazyRender = require('react-lazy-render');

var children = [];
for (var i = 0; i < 5000; i++) {
  // each child must have a consistent height
  children.push(
    <div style={{ height: 20 }}>
      #{i}
    </div>
  );
}

<LazyRender maxHeight={300} className="my-list">
  {children}
</LazyRender>
