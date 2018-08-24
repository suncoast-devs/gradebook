'use strict';

var BS = ReactBootstrap;


var StudentProgressReport = React.createClass({

    getInitialState: function () {
      return {
        students: [],
        homework: []
      };
    },
  
    fetchData: function () {
     
    },
  
    handleCreate: function (data) {
     
    },
  
    componentDidMount: function () {
      this.fetchData();
    },
  
    render: function () {
      console.log(this.props)
      return <div>
          Hello world
      </div>;
    }
  });