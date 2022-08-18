import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import blogsReducer from './blogsReducer';

export default combineReducers({
  auth: authReducer,
  form: reduxForm,
  blogs: blogsReducer // con el nombre blogs me va a devolver el estado de este reducer
});
