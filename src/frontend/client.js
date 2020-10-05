/**
 * Created by bharatbatra on 11/10/17.
 */
import React from 'react';
import { hydrate } from 'react-dom';
import Index from './components/index'

hydrate(
  <Index />,
  document.getElementById('app')
);