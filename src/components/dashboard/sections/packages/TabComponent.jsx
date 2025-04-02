import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const Tabs = ({ 
  children, 
  defaultActiveTab = 0,
  tabHeaderClassName = '',
  tabContentClassName = '',
  activeTabClassName = 'active',
  inactiveTabClassName = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <div className="tabs-container">
      <div className={`tabs-header ${tabHeaderClassName}`}>
        {React.Children.map(children, (child, index) => {
          if (!child) return null;
          
          return (
            <button
              key={index}
              className={`tab-button ${
                index === activeTab ? activeTabClassName : inactiveTabClassName
              }`}
              onClick={() => setActiveTab(index)}
              aria-selected={index === activeTab}
              role="tab"
            >
              {child.props.label || `Tab ${index + 1}`}
            </button>
          );
        })}
      </div>
      <div className={`tabs-content ${tabContentClassName}`} role="tabpanel">
        {React.Children.toArray(children).find((_, index) => index === activeTab)}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  defaultActiveTab: PropTypes.number,
  tabHeaderClassName: PropTypes.string,
  tabContentClassName: PropTypes.string,
  activeTabClassName: PropTypes.string,
  inactiveTabClassName: PropTypes.string,
};

export const Tab = ({ children }) => {
  return <div className="tab-panel">{children}</div>;
};

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
};