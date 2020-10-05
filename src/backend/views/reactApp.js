import React from 'react';
import { renderToString } from 'react-dom/server';

import Root from '../../frontend/components/index'

//server side rendering of app
export default function renderReactAppAsString() {

  // Render the component to a string
  const html = renderToString(
     <Root/>
  );


  return {
    html
  };
}

