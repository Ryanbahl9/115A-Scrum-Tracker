// https://stackoverflow.com/questions/49426474/can-a-react-portal-be-used-in-a-stateless-functional-component-sfc
// Portal to avoid Modal messing up the formating when confirming delete
import React from 'react';
import reactDom from 'react-dom';

export const Portal = ({ children, className = 'root-portal', el = 'div' }) => {
    const [container] = React.useState(() => {
      // This will be executed only on the initial render
      // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
      return document.createElement(el);
    });

    React.useEffect(() => {
      container.classList.add(className)
      document.body.appendChild(container)
      return () => {
        document.body.removeChild(container)
      }
    }, [])

    return reactDom.createPortal(children, container)
  }