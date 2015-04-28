'use strict';

var BS = ReactBootstrap;

var HomeworkView = React.createClass({

  getInitialState: function() {
    return {
      homework: []
    };
  },

  fetchHomework: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({ homework: data });
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
        this.fetchHomework();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.fetchHomework();
  },

  render: function() {
    return <div>
      <HomeworkList homework={this.state.homework} afterHomeworkUpdate={this.fetchHomework} />
      <NewHomeworkButton onHomeworkSubmit={this.handleHomeworkCreate} />
    </div>;
  }
});

var HomeworkList = React.createClass({

  render: function() {
    var homeworkListItemNodes = this.props.homework.map(function(data) {
      return <HomeworkListItem {...this.props} key={data.id} homework={data} />;
    }.bind(this));

    return <table className="table table-hover">
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

  handleHomeworkUpdate: function(data) {
    $.ajax({
      url: this.props.homework.url,
      dataType: 'json',
      type: 'PATCH',
      data: data,
      success: function(data) {
        this.props.afterHomeworkUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var homework = this.props.homework;
    return <BS.ModalTrigger modal={<EditHomeworkModal {...this.props} onHomeworkSubmit={this.handleHomeworkUpdate} />}>
      <tr>
        <td>{homework.name}</td>
        <td>{homework.summary}</td>
      </tr>
    </BS.ModalTrigger>;
  }
});

var EditHomeworkModal = React.createClass({

  getInitialState: function() {
    return {
      name: this.props.homework.name,
      summary: this.props.homework.summary,
      body: ''
    }
  },

  componentDidMount: function() {
    this.fetchHomework();
  },

  handleSubmit: function(e) {
    e.preventDefault();

    this.props.onHomeworkSubmit({ homework: {
      name: this.state.name,
      summary: this.state.summary,
      body: this.state.body
    }})

    this.props.onRequestHide();
  },

  handleDestroy: function(e) {
    e.preventDefault();
    if (confirm("Delete " + this.state.name + "?")) {
      $.ajax({
        url: this.props.homework.url,
        dataType: 'json',
        type: 'DELETE',
        success: function(data) {
          this.props.afterHomeworkUpdate();
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },

  handleChange: function(e) {
    this.setState({
      name: this.refs.name.getValue(),
      summary: this.refs.summary.getValue(),
      body: this.refs.body.getValue()
    })
  },

  fetchHomework: function() {
    $.ajax({
      url: this.props.homework.url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          name: data.name,
          summary: data.summary,
          body: data.body
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return <BS.Modal {...this.props} title="Edit Homework">
      <div className='modal-body'>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <BS.Input label="Name" type="text" ref="name" value={this.state.name} onChange={this.handleChange} placeholder="Assignment #" />
          </div>
          <div className="form-group">
            <BS.Input label="Summary" type="text" ref="summary" value={this.state.summary} onChange={this.handleChange} placeholder="Brief Summary" />
          </div>
          <div className="form-group">
            <BS.Input label="Body" type="textarea" rows="16" ref="body" value={this.state.body} onChange={this.handleChange} placeholder="Homework"/>
          </div>
        </form>
      </div>
      <div className='modal-footer'>
        <BS.Button onClick={this.handleDestroy} bsStyle="danger" className="pull-left">Destroy</BS.Button>
        <BS.Button onClick={this.handleSubmit}>Save Homework</BS.Button>
      </div>
    </BS.Modal>
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
      name: this.refs.name.getValue(),
      summary: this.refs.summary.getValue(),
      body: this.refs.body.getValue()
    }})

    this.refs.name.getDOMNode().value = '';
    this.refs.summary.getDOMNode().value = '';
    this.refs.body.getDOMNode().value = '';
    this.props.onRequestHide();
  },

  render: function() {
    return <BS.Modal {...this.props} title="New Homework">
      <div className='modal-body'>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <BS.Input label="Name" type="text" ref="name" placeholder="Assignment #" />
          </div>
          <div className="form-group">
            <BS.Input label="Summary" type="text" ref="summary" placeholder="Brief Summary" />
          </div>
          <div className="form-group">
            <BS.Input label="Body" type="textarea" rows="16" ref="body" placeholder="Homework"/>
          </div>
        </form>
      </div>
      <div className='modal-footer'>
        <BS.Button onClick={this.handleSubmit}>Create Homework</BS.Button>
      </div>
    </BS.Modal>
  }
});
