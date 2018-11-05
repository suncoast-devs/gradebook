'use strict';

var BS = ReactBootstrap;

var AssignmentScore = React.createClass({
  getInitialState: function () {
    return {
    };
  },

  render: function () {
    switch (parseInt(this.props.score, 10)) {
      case 0:
        return <div className={this.props.className}>Incomplete</div>
      case 1:
        return <div className={this.props.className}>Unacceptable</div>
      case 2:
        return <div className={this.props.className}>Needs Improvement</div>
      case 3:
        return <div className={this.props.className}>Meets Expectations</div>
      case 4:
        return <div className={this.props.className}>Exceeds Expectations</div>
      default:
        return <div className={this.props.className}>Unknown</div>
    }
  }
})

var AssignmentScoreBox = React.createClass({
  getInitialState: function () {
    return {
    };
  },

  render: function () {
    switch (parseInt(this.props.score, 10)) {
      case 0:
        return <div className={"assignment-score-box " + this.props.className}>Incomplete</div>
      case 1:
        return <div className={"assignment-score-box " + this.props.className}>Unacceptable</div>
      case 2:
        return <div className={"assignment-score-box " + this.props.className}>Needs Improvement</div>
      case 3:
        return <div className={"assignment-score-box " + this.props.className}>Meets Expectations</div>
      case 4:
        return <div className={"assignment-score-box " + this.props.className}>Exceeds Expectations</div>
      default:
        return <div className={"assignment-score-box " + this.props.className}>Unknown</div>
    }
  }
})


var SelectAssignments = React.createClass({
  getInitialState: function () {
    return {
      selectedHomework: []
    };
  },

  updateSelectedList: function (e) {
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
      summary: {},
      assignmentIds: this.props.assignments.map(m => m.id),
      showForm: true,
      attendance: "No Attendance Issues", 
      dateRange: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
    };

  },

  fetchData: function () {
    fetch(`/students/${this.props.student.id}/assignments.json`)
      .then(resp => resp.json())
      .then(json => {
        this.setState({
          studentAssignments: json.filter(f => this.state.assignmentIds.includes(f.homework.id)),
          summary: json.filter(f => this.state.assignmentIds.includes(f.homework.id)).reduce((acc, item) => {
            if (acc[item.score]) {
              acc[item.score]++
            } else {
              acc[item.score] = 1;
            }
            return acc
          }, {})
        }, () => {
          // get date range 
          let firstDate = new Date(Date.now() + 24 * 60 * 60 * 1000); 
          let lateDate = new Date(Date.now() - (24 * 60 * 60 * 1000 * 100) )
          console.log({firstDate, lateDate})
          this.state.studentAssignments.forEach(assignment => {
            console.log({assignment})
            if (new Date(assignment.created_at) < firstDate){
              console.log(assignment.created_at, " is before  ", firstDate)
              firstDate = new Date(assignment.created_at);
            }
            if (new Date(assignment.created_at) > lateDate){
              console.log(assignment.created_at, " is after  ", lateDate)
              lateDate = new Date(assignment.created_at);
            }
          });
          console.log("date range: ", {firstDate, lateDate})
          this.setState({
            dateRange: `${firstDate.getMonth() + 1}/${firstDate.getDate()}/${firstDate.getFullYear()} to ${lateDate.getMonth() + 1}/${lateDate.getDate()}/${lateDate.getFullYear()}`
          })
        })
      })
  },

  componentDidUpdate: function () {
    this.fetchData();

  },

  shouldComponentUpdate: function (nextProps, nextState) {
    const _should = (nextProps.student.id !== this.props.student.id ||
      this.state.showForm !== nextState.showForm ||
      this.state.dateRange !== nextState.dateRange || 
      JSON.stringify(this.state.studentAssignments) !== JSON.stringify(nextState.studentAssignments)
    )
    return _should;

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
    return (<section className="progress-report">
      <header className="report-title">
        <h1> <img src="/assets/logo-7e1718be455ad960f928d84c77eba86849faf744deb2c6e2d2b63f7fcb0d32b4.png" height="64px" width="64px" />Progress Report for {this.props.student.name}</h1>
      </header>
      <section className="report-header">
        <header className="left">
          {/* <h3 className="student-name"><i className="fa fa-user" /></h3> */}
          <h3><i className="fa fa-calendar" />{this.state.dateRange}</h3>
          <h3 className="cohort"><i className="fa fa-users" />{this.props.cohort}</h3>
        </header>
      </section>

      <section className="report-body">
        {this.state.showForm && <section className="feedback-form">
          <label>What is {this.props.student.name.substr(0, this.props.student.name.indexOf(' '))} doing well?</label>
          <textarea placeholder="Great CSS, good job creating re-usable code, etc..." onChange={this.handleChange} name="success"></textarea>
          <label>Where can {this.props.student.name.substr(0, this.props.student.name.indexOf(' '))} improve?</label>
          <textarea placeholder="Work on problem solving, repeat old homeworks, etc...." onChange={this.handleChange} name="improvement"></textarea>
          <label>Attendance:</label>
          <textarea onChange={this.handleChange} name="attendance" value="None"></textarea>
          <button onClick={this.createReport} >create</button>
        </section>}

        {!this.state.showForm && <section className="feedback-report">
          <label>What is {this.props.student.name.substr(0, this.props.student.name.indexOf(' '))} doing well?</label>
          <section>{this.state.success}</section>
          <label>Where can {this.props.student.name.substr(0, this.props.student.name.indexOf(' '))} improve?</label>
          <section >{this.state.improvement}</section>
          <label>Attendance:</label>
          <section onChange={this.handleChange} name="attendance">{this.state.attendance}</section>
          <button className="noprint" onClick={this.goToNextStudent}>Next</button>
        </section>}
        <section className="assignments">
          <h3>Assignments</h3>
          <main>
            <section>
              <header>Summary</header>
              <ul className="summary">
                {Object.keys(this.state.summary).map((sum, i) => {
                  return (<li key={i}><AssignmentScore score={sum} className={`score_${sum}`} /><span className={`score_${sum}`}>{" : " + this.state.summary[sum]}</span></li>)
                })}
              </ul>
            </section>
            <hr/>
            <section>

              <header>Results</header>
              <ul className="assignments-list">
                {this.state.studentAssignments.map(ass => {
                  return <li>
                    <h4 className={`score_${ass.score}`}>
                      {ass.homework.name}
                    </h4>
                    <AssignmentScoreBox score={ass.score} className={`score_${ass.score}`} />
                  </li>
                })}
              </ul>
            </section>
          </main>
        </section>
      </section>

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
        this.setState({
          homework: json
        })
      })
    fetch('/students.json')
      .then(resp => resp.json())
      .then(json => this.setState({ students: json }))
  },

  componentDidMount: function () {
    this.fetchData();

  },

  startProgressReports: function (selectedHomework) {
    const _title = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()} ${this.state.students[this.state.currentStudent.next].name}`
    document.title =  _title;
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
      const _title = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()} ${this.state.students[this.state.currentStudent.next].name}`
    document.title =  _title;
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