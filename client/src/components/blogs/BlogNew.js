// BlogNew shows BlogForm and BlogFormReview
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import BlogForm from './BlogForm';
import BlogFormReview from './BlogFormReview';

class BlogNew extends Component {
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <BlogFormReview
          onCancel={() => this.setState({ showFormReview: false })} //pasamedole esta funcion como props
        />
      );
    }

    return (
      <BlogForm
        onBlogSubmit={() => this.setState({ showFormReview: true })} //pasamedole esta funcion como props
      />
    );
  }

  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
    );
  }
}

export default reduxForm({
  form: 'blogForm' // si le quito esta linea de codigo cuando le de cancel al formulario y vuelva a abrir el formulario me sale con los valores que habia escrito antes
})(BlogNew);
