import React, {Component} from 'react';
import {Input, Button, Row} from 'react-materialize';
import {connect} from 'react-redux';
import {modifyEvents} from '../store';

export class Home extends Component{
  constructor(props){
    super(props);
    this.state = {
      calendarId: '',
      startDate: '',
      endDate: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange (event){
    const change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);
  }
  onSubmit(event){
    event.preventDefault();
    const {startDate, endDate, calendarId} = this.state;
    const workshopFile = event.target.workshopAssignment.files[0];
    const emailFile = event.target.emailList.files[0];
    this.props.sendInvites(workshopFile, emailFile, calendarId, startDate, endDate);
  }
  render(){
    const {calendars} = this.props;
    const {onChange, onSubmit} = this;

    return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <p> Send GCal invitations for Junior Phase Workshops!
              Just upload a .csv file with the workshop teams and another with a list of the attendees and their emails.
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit}>
        <div className="row">
          <div className="col s12 offset-s2">
            <h5>Calendar</h5>
            <Row>
              <Input s={8} name="calendarId" type="select" label="Select Calendar" onChange={onChange}>
                {calendars.map(calendar => {
                  return (
                    <option key={calendar.id} value={calendar.id}>{calendar.summary}</option>
                  );
                })
              }
              </Input>
            </Row>
          </div>
        </div>
        <div className="row">
          <div className="col s8 offset-s2">
            <Row>
              <Input s={6} name="startDate" type="date" onChange={onChange} label="start date" />
              <Input s={6} name="endDate" type="date" onChange={onChange} label="end date" />
            </Row>
          </div>
        </div>
        <div className="row">
          <div className="col s8 offset-s2">
              <h5>Workshop Assignment Spreadsheet</h5>
              <div className="file-field input-field">
                <div className="btn">
                  <span>Select File</span>
                  <input id="workshopAssignment" type="file" />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" />
                </div>
              </div>
            </div>
        </div>
        <div className="row">
          <div className="col s8 offset-s2">
              <h5>Email List</h5>
              <div className="file-field input-field">
                <div className="btn">
                  <span>Select File</span>
                  <input id="emailList" type="file" />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" />
                </div>
              </div>
          </div>
        </div>
        {/* <div className="row">
          <div className="col s8 offset-s2">
            <h5>Rooms</h5>
            <Row>
                <Input s={6} type="select" defaultValue="" id="lecture-room">
                  <option value="1">For Lectures &amp; Live Reviews/Q&amp;A's </option>
                  <option value="1">Hamilton Hall</option>
                  <option value="2">Von Neumann</option>
                  <option value="3">Python</option>
                </Input>
              <Input s={6} type="select" defaultValue="">
                <option value="1">For Workshops &amp; Review Videos</option>
                <option value="1">Hamilton Hall</option>
                <option value="2">Von Neumann</option>
                <option value="3">Python</option>
              </Input>
            </Row>
          </div>
        </div>
        <div className="row">
          <div className="col s8 offset-s2">
            <p>
              <input type="checkbox" className="filled-in" id="hotseat" />
              <label htmlFor="hotseat">Invite Instructors to Hot Seat</label>
            </p>
            <p>
              <input type="checkbox" className="filled-in" id="retro" />
              <label htmlFor="retro">Invite Instructors to Retrospective</label>
            </p>
          </div>
        </div> */}
        <div className="row">
          <div className="col s8 offset-s2">
            <Button waves="light" className="right">Submit</Button>
          </div>
        </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({calendars}) => {
  return {
    calendars
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendInvites: function (workshopFile, emailFile, calendarId, startDate, endDate) {
      dispatch(modifyEvents(workshopFile, emailFile, calendarId, startDate, endDate));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
