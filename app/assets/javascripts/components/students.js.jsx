'use strict';

var BS = ReactBootstrap;

var StudentView = React.createClass({

  getInitialState: function() {
    return {
      students: [],
      homework: []
    };
  },

  fetchData: function() {
    $.ajax({
      url: this.props.students_url,
      dataType: 'json',
      success: function(data) {
        this.setState({ students: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.students_url, status, err.toString());
      }.bind(this)
    });

    $.ajax({
      url: this.props.homework_url,
      dataType: 'json',
      success: function(data) {
        this.setState({ homework: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.homework_url, status, err.toString());
      }.bind(this)
    });
  },

  handleCreate: function(data) {
    $.ajax({
      url: this.props.students_url,
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function(data) {
        this.fetchData();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.students_url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.fetchData();
  },

  render: function() {
    return <div>
      <StudentList students={this.state.students} homework={this.state.homework} afterUpdate={this.fetchData} />
      <NewStudentButton onFormSubmit={this.handleCreate} />
    </div>;
  }
});

var StudentList = React.createClass({

  assignHomework: function(homework) {
    this.props.students.forEach(function(student) {
      $.ajax({
        url: student.assignments_url,
        dataType: 'json',
        type: 'POST',
        data: { assignment: { homework_id: homework.id } },
        success: function(data) {
          student.assignments.push(data);
          this.forceUpdate();
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(student.assignments_url, status, err.toString());
        }.bind(this)
      });
    }.bind(this));
  },

  render: function() {
    var listItemNodes = this.props.students.map(function(student) {
      return <StudentListItem {...this.props} key={student.id} data={student} />;
    }.bind(this));

    var homeworkHeaderNodes = this.props.homework.map(function(homework) {
      return <HomeworkHeaderItem {...this.props} key={homework.id} data={homework} assignHomework={this.assignHomework.bind(this, homework)} />;
    }.bind(this));

    return <table className="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          {homeworkHeaderNodes}
        </tr>
      </thead>
      <tbody>
        {listItemNodes}
      </tbody>
    </table>;
  }
});

var HomeworkHeaderItem = React.createClass({

  render: function() {
    var tip = <BS.Tooltip>{this.props.data.name}</BS.Tooltip>;
    return <th className="assignment">
      <BS.OverlayTrigger placement='top' overlay={tip}>
        <i className="fa fa-circle" onClick={this.props.assignHomework}></i>
      </BS.OverlayTrigger>
    </th>;
  }
});

var StudentListItem = React.createClass({

  handleUpdate: function(data) {
    $.ajax({
      url: this.props.data.url,
      dataType: 'json',
      type: 'PATCH',
      data: data,
      success: function(data) {
        this.props.afterUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var student = this.props.data;

    var assignmentNodes = this.props.homework.map(function(homework) {
      var assignment = function() {
        for (var i = student.assignments.length - 1; i >= 0; i--) {
          if (student.assignments[i].homework_id === homework.id)
            return student.assignments[i];
        };
        return null;
      }.bind(this)();
      return <HomeworkAssignmentItem key={homework.id} homework={homework} assignment={assignment} />;
    }.bind(this));

    return <tr>
      <td>
        <BS.ModalTrigger modal={<EditStudentModal {...this.props} onFormSubmit={this.handleUpdate} />}>
          <a href="#">{student.name}</a>
        </BS.ModalTrigger>
      </td>
      {assignmentNodes}
    </tr>;
  }
});

var HomeworkAssignmentItem = React.createClass({

  render: function() {
    var tip = <BS.Tooltip>{this.props.homework.name}</BS.Tooltip>;
    return <td className="assignment">
      <BS.OverlayTrigger placement='top' overlay={tip}>
        <i className={"fa " + (this.props.assignment ? 'fa-circle' : 'fa-circle-o')}  ></i>
      </BS.OverlayTrigger>
    </td>;
  }
});

var EditStudentModal = React.createClass({

  getInitialState: function() {
    return {
      name: this.props.data.name,
      github: this.props.data.github,
      assignments_repo: this.props.data.assignments_repo,
    }
  },

  componentDidMount: function() {
    this.fetchData();
  },

  handleSubmit: function(e) {
    e.preventDefault();

    this.props.onFormSubmit({ student: {
      name: this.state.name,
      github: this.state.github,
      assignments_repo: this.state.assignments_repo,
    }})

    this.props.onRequestHide();
  },

  handleDestroy: function(e) {
    e.preventDefault();
    if (confirm("Delete " + this.state.name + "?")) {
      $.ajax({
        url: this.props.data.url,
        dataType: 'json',
        type: 'DELETE',
        success: function(data) {
          this.props.afterUpdate();
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
      github: this.refs.github.getValue(),
      assignments_repo: this.refs.assignments_repo.getValue()
    })
  },

  fetchData: function() {
    $.ajax({
      url: this.props.data.url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          name: data.name,
          github: data.github,
          assignments_repo: data.assignments_repo,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return <BS.Modal {...this.props} title="Edit Student">
      <div className='modal-body'>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <BS.Input label="Name" type="text" ref="name" value={this.state.name} onChange={this.handleChange} placeholder="Student Name" />
          </div>
          <div className="form-group">
            <BS.Input label="Github" type="text" ref="github" value={this.state.github} onChange={this.handleChange} placeholder="nickname" addonBefore="@" />
          </div>
          <div className="form-group">
            <BS.Input label="Assignments Repo" type="text" ref="assignments_repo" value={this.state.assignments_repo} onChange={this.handleChange} placeholder="repo_name"/>
          </div>
        </form>
      </div>
      <div className='modal-footer'>
        <BS.Button onClick={this.handleDestroy} bsStyle="danger" className="pull-left">Destroy</BS.Button>
        <BS.Button onClick={this.handleSubmit}>Save Student</BS.Button>
      </div>
    </BS.Modal>
  }
});

var NewStudentButton = React.createClass({

  render: function() {
    return <BS.ModalTrigger modal={<NewStudentModal {...this.props} />}>
      <BS.Button>New Student</BS.Button>
    </BS.ModalTrigger>
  }
});

var NewStudentModal = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();

    this.props.onFormSubmit({ student: {
      name: this.refs.name.getValue(),
      github: this.refs.github.getValue(),
      assignments_repo: this.refs.assignments_repo.getValue(),
    }})

    this.refs.name.getDOMNode().value = '';
    this.refs.github.getDOMNode().value = '';
    this.refs.assignments_repo.getDOMNode().value = 'assignments';
    this.props.onRequestHide();
  },

  render: function() {
    return <BS.Modal {...this.props} title="New Student">
      <div className='modal-body'>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <BS.Input label="Name" type="text" ref="name" placeholder="Student Name" />
          </div>
          <div className="form-group">
            <BS.Input label="Github" type="text" ref="github" placeholder="nickname" addonBefore="@" />
          </div>
          <div className="form-group">
            <BS.Input label="Assignments Repo" type="text" ref="assignments_repo" defaultValue="assignments" placeholder="repo_name" />
          </div>
        </form>
      </div>
      <div className='modal-footer'>
        <BS.Button onClick={this.handleSubmit}>Create Student</BS.Button>
      </div>
    </BS.Modal>
  }
});
