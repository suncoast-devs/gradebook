'use strict';

var BS = ReactBootstrap;

var HomeworkView = React.createClass({

  getInitialState: function() {
    return {
      homeworks: []
    };
  },

  fetchHomeworks: function() {
    $.ajax({
      iurl: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({ homeworks: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleHomeworkCreate: function(data) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function(data) {
        this.fetchHomeworks();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.fetchHomeworks();
  },

  render: function() {
    return <div>
      <div className="page-header">
        <h1>Homework</h1>
      </div>
      <HomeworkList homeworks={this.state.homeworks} />
      <NewHomeworkButton onHomeworkSubmit={this.handleHomeworkCreate} />
    </div>;
  }
});

var HomeworkList = React.createClass({

  render: function() {
    var homeworkListItemNodes = this.props.homeworks.map(function(homework) {
      return <HomeworkListItem key={homework.id} homework={homework} />;
    });

    return <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Summary</th>
        </tr>
      </thead>
      <tbody>
        {homeworkListItemNodes}
      </tbody>
    </table>;
  }
});

var HomeworkListItem = React.createClass({

  handleClick: function() {
    alert(this.props.homework.url);
  },

  render: function() {
    var homework = this.props.homework;
    return <tr onClick={this.handleClick}>
      <td>{homework.name}</td>
      <td>{homework.summary}</td>
    </tr>;
  }
});

var NewHomeworkButton = React.createClass({

  render: function() {
    return <BS.ModalTrigger modal={<NewHomeworkModal {...this.props} />}>
      <BS.Button>New Homework</BS.Button>
    </BS.ModalTrigger>
  }
});

var NewHomeworkModal = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();

    this.props.onHomeworkSubmit({ homework: {
      name: this.refs.name.getDOMNode().value.trim(),
      summary: this.refs.summary.getDOMNode().value.trim(),
      body: this.refs.body.getDOMNode().value.trim()
    }})

    this.refs.name.getDOMNode().value = '';
    this.refs.summary.getDOMNode().value = '';
    this.refs.name.getDOMNode().value = '';
    this.props.onRequestHide();
  },

  render: function() {
    return <BS.Modal {...this.props} title="New Homework">
      <div className='modal-body'>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" ref="name" placeholder="Assignment #" />
          </div>
          <div className="form-group">
            <label>Summary</label>
            <input type="text" className="form-control" ref="summary" placeholder="Brief Summary" />
          </div>
          <div className="form-group">
            <label>Body</label>
            <textarea rows="18" className="form-control" ref="body" placeholder="Homework"/>
          </div>
        </form>
      </div>
      <div className='modal-footer'>
        <BS.Button onClick={this.handleSubmit}>Create Homework</BS.Button>
      </div>
    </BS.Modal>
  }
});
