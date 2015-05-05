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

    return <table className="table table-hover" id="students">
      <thead>
        <tr>
          <th>Name</th>
          <th><i className="fa fa-lg fa-github-alt" /></th>
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
        <i className="fa fa-circle" onClick={this.props.assignHomework}/>
      </BS.OverlayTrigger>
    </th>;
  }
});

var StudentListItem = React.createClass({

  getInitialState: function() {
    return {
      issues: []
    }
  },

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

  componentDidMount: function() {
    this.fetchIssues();
  },

  fetchIssues: function() {
    $.ajax({
      url: this.props.data.issues_url,
      dataType: 'json',
      success: function(data) {
        this.setState({ issues: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.homework_url, status, err.toString());
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

      if (assignment) {
        var issue = function() {
          for (var i = this.state.issues.length - 1; i >= 0; i--) {
            if (this.state.issues[i].number === assignment.issue)
              return this.state.issues[i];
          };
          return null;
        }.bind(this)();
      };

      return <HomeworkAssignmentItem key={homework.id} student={student} homework={homework} assignment={assignment} issue={issue} />;
    }.bind(this));

    return <tr>
      <td>
        <BS.ModalTrigger modal={<EditStudentModal {...this.props} onFormSubmit={this.handleUpdate} />}>
          <a href="#">{student.name}</a>
        </BS.ModalTrigger>
      </td>
      <td>
        <a href={"https://github.com/" + student.github}>@{student.github}</a>
      </td>
      {assignmentNodes}
    </tr>;
  }
});

var HomeworkAssignmentItem = React.createClass({

  render: function() {
    var assignment = this.props.assignment;
    var issue = this.props.issue;

    if (assignment) {
      var icon = function() {
        if (issue) {
          if (issue.state == 'open') {
            return 'fa-circle-o';
          } else {
            // TODO:
            // if (assignment is scored) {
            //   return 'fa-check-circle';
            // } else { ....
            return 'fa-circle';
          };
        } else {
          return 'fa-question-circle';
        }
      }();

      var popover = <BS.Popover title={this.props.homework.name}>
        <table className="table">
          <tr>
            <th>State</th>
            <td>{(issue ? issue.state : '??')}</td>
          </tr>
          <tr>
            <th><i className="fa fa-code-fork" /></th>
            <td>
              <a href={"https://github.com/" + this.props.student.github + "/" + this.props.student.assignments_repo + "/issues/" + assignment.issue}>
                #{assignment.issue}
              </a>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <AssignmentScoreButtonGroup {...this.props} />
            </td>
          </tr>
        </table>
      </BS.Popover>;

      return <td className={" assignment score_" + assignment.score + ' ' + (issue ? issue.state : 'unassigned')}>
        <BS.OverlayTrigger placement='left' trigger='click' overlay={popover}>
          <i className={"fa " + icon}/>
        </BS.OverlayTrigger>
      </td>
    } else {
      return <td className="assignment unassigned">
        <i className="fa fa-circle-o" />
      </td>
    }
  }
});

var AssignmentScoreButtonGroup = React.createClass({

  getInitialState: function() {
    return {
      score: this.props.assignment.score
    }
  },

  handleClick: function(assignmentScoreButton) {
    $.ajax({
      url: this.props.assignment.url,
      dataType: 'json',
      type: 'PATCH',
      data: { assignment: { score: assignmentScoreButton.props.score } },
      success: function(data) {
        this.setState({score: assignmentScoreButton.props.score});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.assignment.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return <BS.ButtonToolbar>
      <BS.ButtonGroup bsSize='small' className="assignment-score-buttons">
        <AssignmentScoreButton {...this.props} onClick={this.handleClick} score={0} currentScore={this.state.score} />
        <AssignmentScoreButton {...this.props} onClick={this.handleClick} score={1} currentScore={this.state.score} />
        <AssignmentScoreButton {...this.props} onClick={this.handleClick} score={2} currentScore={this.state.score} />
        <AssignmentScoreButton {...this.props} onClick={this.handleClick} score={3} currentScore={this.state.score} />
        <AssignmentScoreButton {...this.props} onClick={this.handleClick} score={4} currentScore={this.state.score} />
      </BS.ButtonGroup>
    </BS.ButtonToolbar>;
  }
});

var AssignmentScoreButton = React.createClass({

  handleClick: function() {
    this.props.onClick(this);
  },

  render: function() {
    var style = ['default', 'danger', 'warning', 'info', 'primary'][this.props.score];
    var isCurrent = this.props.score === this.props.currentScore;
    return <BS.Button className={isCurrent ? 'current' : ''} bsStyle={style} active={isCurrent} onClick={this.handleClick}>
      {this.props.score}
    </BS.Button>;
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
