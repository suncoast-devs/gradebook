'use strict';

var BS = ReactBootstrap;


var SelectAssignments = React.createClass({
  getInitialState: function () {
    return {
      selectedHomework: []
    };
  },


  updateSelectedList: function (e) {
    console.log({ e: e.target })
    if (e.target.checked) {
      // adding to list
      this.setState({
        selectedHomework: this.state.selectedHomework.concat(this.props.homework.filter(w => w.id == e.target.value))
      })
    } else {
      // removing from list
      this.setState({
        selectedHomework: this.state.selectedHomework.filter(w => w.id != e.target.value)
      })
    }
  },

  sendSelectedReports: function () {
    this.props.startProgressReports(this.state.selectedHomework)
  },

  render: function () {
    return (<section>
      <header>Select Assignments</header>
      <section>
        <ul>
          {this.props.homework.map((hw) => {
            return (<li key={hw.id}>
              <input type="checkbox" id={hw.id} value={hw.id} onClick={this.updateSelectedList} />
              <label htmlFor={hw.id}>
                <span>
                  {hw.name}
                </span>
              </label>
            </li>)
          })}
        </ul>
      </section>
      <section>
        <header>selected homework</header>
        <ul>
          {this.state.selectedHomework.map((hw) => {
            return (<li key={hw.id}>
              <span>
                {hw.name}
              </span>

            </li>)
          })}
        </ul>
        <button onClick={this.sendSelectedReports}>go</button>
      </section>
    </section>)
  }

})

var ProgressReport = React.createClass({
  getInitialState: function () {
    return {
      studentAssignments: [],
      assignmentIds: this.props.assignments.map(m => m.id),
      showForm: true,
      attendance: "No Attendance Issues"
    };
  },
  fetchData: function () {
    fetch(`/students/${this.props.student.id}/assignments.json`)
      .then(resp => resp.json())
      .then(json => {
        console.log(json)
        this.setState({
          studentAssignments: json.filter(f => this.state.assignmentIds.includes(f.homework.id))
        })
      })

  },

  componentDidMount: function () {
    this.fetchData();
  },


  createReport: function () {
    this.setState({
      showForm: false
    })
  },

  handleChange: function (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  },

  goToNextStudent: function () {
    this.setState({
      showForm: true
    }, () => this.props.startNextProgressReport())

  },

  render: function () {
    return (<section>
      <header className="report-title">
        <h1> <img src="/assets/logo-7e1718be455ad960f928d84c77eba86849faf744deb2c6e2d2b63f7fcb0d32b4.png" height="64px" width="64px"/>Progress Report</h1>
      </header>
      <section className="report-header">
        <header className="left">
          <h3 className="student-name"><i className="fa fa-user" />{this.props.student.name}</h3>
          <h3><i className="fa fa-calendar" />{new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()}</h3>
          <h3 className="cohort"><i className="fa fa-users" />{this.props.cohort}</h3>
        </header>
        {/* <header className="right">
        </header> */}
      </section>
      {this.state.showForm && <section className="feedback-form">
        <label>What is {this.props.student.name.substr(0, this.props.student.name.indexOf(' '))} doing well?</label>
        <textarea placeholder="Great CSS, good job creating re-usable code, etc..." onChange={this.handleChange} name="success"></textarea>
        <label>Where can {this.props.student.name.substr(0, this.props.student.name.indexOf(' '))} improve?</label>
        <textarea placeholder="Work on problem solving, repeat old homeworks, etc...." onChange={this.handleChange} name="improvement"></textarea>
        <label>Attendance:</label>
        <textarea onChange={this.handleChange} name="attendance">None</textarea>
        <button onClick={this.createReport} >create</button>
      </section>}
      <ul>
        {this.state.studentAssignments.map(ass => {
          return <li>{ass.homework.name} | {ass.score}</li>
        })}
      </ul>
      {!this.state.showForm && <section className="feedback-form">
        <label>What is {this.props.student.name.substr(0, this.props.student.name.indexOf(' '))} doing well?</label>
        <section>{this.state.success}</section>
        <label>Where can {this.props.student.name.substr(0, this.props.student.name.indexOf(' '))} improve?</label>
        <section >{this.state.improvement}</section>
        <label>Attendance:</label>
        <pre onChange={this.handleChange} name="attendance">{this.state.attendance}</pre>
        <button className="noprint" onClick={this.goToNextStudent}>Next</button>
      </section>}
    </section>)
  }
})


var StudentProgressReport = React.createClass({

  getInitialState: function () {
    return {
      homework: [],
      selectedHomework: [],
      students: [],
      reportAssignments: [],
      currentStudent: { next: 0, data: {} },
      currentStep: 1 // 1 assignments, 2 Create reports, 3 completes
    };
  },

  fetchData: function () {
    fetch(`/homework.json`)
      .then(resp => resp.json())
      .then(json => {
        console.log(json)
        this.setState({
          homework: json
        })
      })
    fetch('/students.json')
      .then(resp => resp.json())
      .then(json => this.setState({ students: json },  this.startNextProgressReport))
  },

  componentDidMount: function () {
    this.fetchData();
   
  },

  startProgressReports: function (selectedHomework) {
    console.log("got", selectedHomework)
    this.setState({
      currentStep: 2,
      currentStudent: {
        next: this.state.currentStudent.next + 1,
        data: this.state.students[this.state.currentStudent.next],
      },
      reportAssignments: selectedHomework
    })
  },

  startNextProgressReport: function () {
    if (this.state.currentStudent.next >= this.state.students.length) {
      this.setState({
        currentStep: 3
      })
    } else {
      this.setState({
        currentStep: 2,
        currentStudent: {
          next: this.state.currentStudent.next + 1,
          data: this.state.students[this.state.currentStudent.next],
        }
      })
    }
  },

  getCurrentPage: function () {
    switch (this.state.currentStep) {
      case 1:
        return <SelectAssignments homework={this.state.homework} startProgressReports={this.startProgressReports} />
      case 2:
        return <ProgressReport startNextProgressReport={this.startNextProgressReport} student={this.state.currentStudent.data} cohort={this.props.cohort.name} assignments={this.state.reportAssignments} />
      case 3:
        return <div>done</div>
      default:
        return <SelectAssignments homework={this.state.homework} startProgressReports={this.startProgressReports} />

    }
  },

  render: function () {
    return <div>
      {this.getCurrentPage()}
    </div>;
  }
});