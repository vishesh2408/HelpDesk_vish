// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// export const useAuth = () => {
// 	const context = useContext(AuthContext);
// 	console.log('AuthContext:', context);
// 	return context;
// };


// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
	const context = useContext(AuthContext);
	return context;
};

