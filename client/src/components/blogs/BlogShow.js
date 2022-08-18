import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id); // haciendo el fetching de los blogs
  }

  render() {
    if (!this.props.blog) {  // return { blog: blogs[ownProps.match.params._id] };
      return '';
    }

    const { title, content } = this.props.blog; 

    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] }; // just to show an specific blog
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
