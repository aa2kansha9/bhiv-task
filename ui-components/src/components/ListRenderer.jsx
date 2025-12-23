import React from 'react';

const ListRenderer = ({ 
  items, 
  renderItem, 
  emptyMessage = "No items found",
  listClassName = '',
  itemClassName = '',
  ...props 
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${listClassName}`} {...props}>
      {items.map((item, index) => (
        <div key={index} className={itemClassName}>
          {renderItem ? renderItem(item, index) : JSON.stringify(item)}
        </div>
      ))}
    </div>
  );
};

export default ListRenderer;