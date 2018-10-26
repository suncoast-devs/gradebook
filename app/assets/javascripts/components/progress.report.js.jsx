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


var StudentProgressReport = React.createClass({

  getInitialState: function () {
    return {
      homework: [],
      selectedHomework: [],
      students: [],

      currentStudent: { next: 0, data: {} },
      currentStep: 1 // 1 assignments, 2 add student page, 3 report to print
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
      .then(json => this.setState({ students: json }))
  },

  componentDidMount: function () {
    this.fetchData();
  },

  startProgressReports: function (selectedHomework) {
    this.setState({
      currentStep: 2,
      currentStudent: {
        next: this.state.currentStudent.next + 1,
        data: this.state.students[this.state.currentStudent.next]
      }
    })
  },

  startNextProgressReport: function () {
    // select "next" student
    // get students assignments. 
    // display good/bad box
  },

  getCurrentPage: function(){
    switch (this.state.currentStep) {
      case 1:
       return <SelectAssignments homework={this.state.homework} startProgressReports={this.startProgressReports} />
       case 2: 
        return <div>{this.state.currentStudent.data.name}</div>
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