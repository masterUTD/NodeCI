// BlogFormReview shows users their form inputs for review
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

class BlogFormReview extends Component {
  renderFields() {
    const { formValues } = this.props; // Aqui tomo los formValues de el formulario BlogForm

    return _.map(formFields, ({ name, label }) => {
      return (
        <div key={name}>
          <label>{label}</label>
          <div>{formValues[name]}</div>
        </div>
      );
    });
  }

  renderButtons() {
    const { onCancel } = this.props; // esta prop es pasada por el conponente BlogNew

    return (
      <div>
        <button
          className="yellow darken-3 white-text btn-flat"
          onClick={onCancel}
        >
          Back
        </button>
        <button className="green btn-flat right white-text">
          Save Blog
          <i className="material-icons right">email</i>
        </button>
      </div>
    );
  }

  onSubmit(event) {
    event.preventDefault();

    const { submitBlog, history, formValues } = this.props; // history viene de react-router-dom creo o de withRouter

    submitBlog(formValues, history); // submitBlog viene de las acciones
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h5>Please confirm your entries</h5>
        {this.renderFields()} 

        {this.renderButtons()}
      </form>
    );
  }
}





function mapStateToProps(state) {
  return { formValues: state.form.blogForm.values }; // aqui tomo el estado form de reduxForm y lo paso como props a este Componente
}

export default connect(mapStateToProps, actions)(withRouter(BlogFormReview));
