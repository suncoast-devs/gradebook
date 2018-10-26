'use strict';

var BS = ReactBootstrap;


var StudentProgressReport = React.createClass({

  getInitialState: function () {
    return {
      homework: []
    };
  },

  fetchData: function () {
    fetch(`/students/${this.props.student.id}/assignments.json`)
      .then(resp => resp.json())
      .then(json => {
        console.log(json)
        this.setState({
          homework: json
        })
      })
  },

  componentDidMount: function () {
    this.fetchData();
  },

  render: function () {
    console.log({ props: this.props })
    return <div>
      <section className="student-profile">
        <header className="student-name">{this.props.student.name}</header>
        <header className="cohort-name">{this.props.cohort.name}</header>
      </section>
      <section>
        <header>Select Assignments</header>
        <section>
          <ul>
            {this.state.homework.map((hw) => {
              return (<li key={hw.id}>
                <input type="checkbox" id={hw.id} />
                <label htmlFor={hw.id}>
                  <span>
                    {hw.homework.name}
                  </span>
                  |
                      <span>
                    {hw.score}
                  </span>
                </label>
              </li>)
            })}
          </ul>
        </section>
      </section>
    </div>;
  }
});