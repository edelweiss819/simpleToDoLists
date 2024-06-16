import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import store from './store/store.js';
import './index.css';


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<App/>
		</QueryClientProvider>
	</Provider>,
);
