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
      endDate: '',
      lectureRoomId: '',
      workshopRoomId: '',
      hotSeat: true,
      retro: true
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }
  onChange (event){
    const change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);
    console.log(this.state);
  }
  onSubmit(event){
    event.preventDefault();
    const workshopFile = event.target.workshopAssignment.files[0];
    const emailFile = event.target.emailList.files[0];
    this.props.sendInvites(workshopFile, emailFile, this.state);
  }
  toggleCheckbox(event){
    const name = event.target.name;
    this.setState({[name]: !this.state[name] });
  }
  render(){
    const {hotSeat, retro} = this.state;
    const {calendars} = this.props;
    const {onChange, onSubmit, toggleCheckbox} = this;
    const cals = calendars.map(calendar => {
      return (
        <option key={calendar.id} value={calendar.id}>{calendar.summary}</option>
      );
    });
    const calOptions = [<option key="0" value="default">Select Calendar</option>, ...cals];

    const rooms = [
      //{name:'C++', email:'fullstackacademy.com_39333634323235313037@resource.calendar.google.com'},
      //{name:'COBOL', email:'fullstackacademy.com_35323539333836393339@resource.calendar.google.com'},
      //{name:'CSS', email:'fullstackacademy.com_3536343433343732363033@resource.calendar.google.com'},
      {name: 'Hamilton Hall', email:  'fullstackacademy.com_3735303135333730393937@resource.calendar.google.com'},
      {name: 'Haskell Hall', email: 'fullstackacademy.com_3835343236323635393636@resource.calendar.google.com'},
      {name: 'Java', email: 'fullstackacademy.com_3936353831343432393833@resource.calendar.google.com'},
      {name: 'Lovelace', email: 'fullstackacademy.com_3136353632363532313037@resource.calendar.google.com'}, {name: 'Python', email: 'fullstackacademy.com_2d323731303936322d393037@resource.calendar.google.com'},
      {name: 'Swift', email: 'fullstackacademy.com_3334373132313536343730@resource.calendar.google.com'},
      {name: 'The Oasis', email: 'fullstackacademy.com_2d3233343538323936313638@resource.calendar.google.com'},
      {name: 'Turing', email: 'fullstackacademy.com_323036313339332d343634@resource.calendar.google.com'},
      {name: 'Von Neumann', email: 'fullstackacademy.com_36363035323430342d323931@resource.calendar.google.com'}
    ];

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
              <Input s={8} name="calendarId" type="select" onChange={onChange} defaultValue="default">
              {/* react-materialize bug won't allow 1 option so must check for option length while loading. somewhat related to https://github.com/react-materialize/react-materialize/issues/411 */}
               {calOptions.length > 1 ? calOptions.map(op => {
                 return op;
               }) : <option key="0" value="default">Select Calendar</option>}
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
        <div className="row">
          <div className="col s8 offset-s2">
            <h5>Rooms</h5>
            <Row>
                <Input s={6} type="select" defaultValue="0" name="lectureRoomId" label="For Lectures &amp; Live Reviews/Q&amp;A's" onChange={onChange}>
                  <option value="0">Select Room</option>
                  {rooms.map(room => {
                    return <option key={room.email} value={room.email}>{room.name}</option>;
                  })}
                </Input>
              <Input s={6} type="select" defaultValue="0" name="workshopRoomId" label="For Workshops &amp; Review Videos" onChange={onChange}>
                <option value="0">Select Room</option>
                {rooms.map(room => {
                  return <option key={room.email} value={room.email}>{room.name}</option>;
                })}
              </Input>
            </Row>
          </div>
        </div>
        <div className="row">
          <div className="col s8 offset-s2">
            <Row>
                <Input type="checkbox" className="filled-in" name="hotSeat" label="Invite to Instructors to Hot Seat" onChange={toggleCheckbox} defaultChecked={hotSeat} />
            </Row>
            <Row>
                <Input type="checkbox" className="filled-in" name="retro" label="Invite Instructors to Retrospective" defaultChecked={retro} onChange={toggleCheckbox} />
            </Row>
          </div>
        </div>
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
    sendInvites: function (workshopFile, emailFile, state) {
      dispatch(modifyEvents(workshopFile, emailFile, state));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
