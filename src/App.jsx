import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';

/**
 * Root Application Component conforming to SOLID Principles:
 * - Single Responsibility Principle (SRP): Configures root state and routing providers.
 * - Open/Closed Principle (OCP): Routes and feature slices can be extended without touching App.
 * - Dependency Inversion Principle (DIP): Injects Redux store and Browser router into the component tree.
 */
export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
