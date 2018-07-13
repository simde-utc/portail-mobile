import { createCrudActions } from './utils';
import actionTypes from './types';

export const usersActions = createCrudActions(actionTypes.users, 'users');
export const assosActions = createCrudActions(actionTypes.assos, 'assos', {
	getCurrentUser: () => ({
		
	})
});