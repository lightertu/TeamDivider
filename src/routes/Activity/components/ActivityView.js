/**
 * Created by rui on 4/7/17.
 * Additions made by Joseph 5/28/17
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {Grid, Segment} from 'semantic-ui-react'
import {DragDropContext, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ParticipantListSidebar from "./ParticipantListSidebar"
import GroupCard from "./GroupCard/GroupCard"
import FilterMenu from "./FilterMenu"
import {ParticipantTypes} from "../constants/ParticipantTypes"
let Scroll = require('react-scroll')

var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;

const viewTarget = {
    drop(props, monitor) {
        props.setCurrentlySelected("");
    }
};

@DropTarget([ParticipantTypes.GROUPED_PARTICIPANT, ParticipantTypes.UNGROUPED_PARTICIPANT],
    viewTarget, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    })
)
export class ActivityCardViewWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {connectDropTarget, isOver} = this.props;

        return connectDropTarget(
            <div className="" style={ {
                marginTop: "3%",
                paddingLeft: "290px",
            } }>
                <Grid >
                    <Grid.Row>
                        <Grid.Column>
                            { this.props.children }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
export class ActivityView extends React.Component {
    constructor(props) {
        super(props);
        this.props.fetchParticipantList(this.props.activityId);

        this.state = ({filters: [], windowHeight: 500, groupHeight: 140});
        this.setFilterValues = this.setFilterValues.bind(this);
        this.toggleLock = this.toggleLock.bind(this);
        this.getGroupSize = this.getGroupSize.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

    }

    updateDimensions() {
        this.setState({windowHeight: window.innerHeight});
    }

    componentDidMount() { // add event listener
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));

        Events.scrollEvent.register('begin', function(to, element) {
          // console.log("begin", arguments);
        });
     
        Events.scrollEvent.register('end', function(to, element) {
          // console.log("end", arguments);
        });
     
        scrollSpy.update();
    }

    componentWillUnmount() { // remove event listener
        window.removeEventListener("resize", this.updateDimensions.bind(this));

        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }    

    handleScroll(move) {
        scroll.scrollMore(move, {
            duration: 1000,
            smooth: "linear"
        });
    }

    onMouseMove(e) {
        // this.upOrDOwn(e.screenY);
    }

    onDragMove(coor) {
        this.upOrDOwn(coor)
    }

    upOrDOwn(num) {
        let move = 0;
        if(num < 200) {
            move = -270;
        } else if(this.state.windowHeight - num < 150){
            move = 270;
        }
        this.handleScroll(move);
    }

    getGroupSize(size) {
      //  this.setState({groupHeight: size});
    }

    toggleLock(group) {
        this.props.toggleLock(group);
    }

    setFilterValues(input, event) {
        let field = this.state[input];
        if(event.target.getAttribute('class') === "delete icon") {
            let item = event.target.parentNode.getAttribute('value');
            let index = field.indexOf(item)
            if(index >= 0) {
                field.splice(index, 1); // remove item from filter
            }
        } else {
            if(event.target.getAttribute('name') != "-search") {
                if(event.target.getAttribute('name') === null) {
                    field.push(event.target.parentNode.getAttribute('name')); // add item to filter
                } else {
                    field.push(event.target.getAttribute('name')); // add item to filter
                }
            }
        }
        this.setState({field:field});
    }

    setCurrentlySelected(id) {
        this.props.filterParticipantsMatch(id);
    }

    render() {
        const itemsPerRow = 10;
        const cardsPerRow = 1;
        let numOfGroups = this.props.totalCapacity / this.props.groupCapacity;

        let separateIntoGroups = (participants) => {
            let groups = [];
            for (let i = 0; i < numOfGroups; i++) {
                groups.push({
                    groupNumber: i,
                    participants: []
                })
            }

            for (let i = 0; i < participants.length; i++) {
                let participantGroupNumber = participants[i].groupNumber;
                if (participantGroupNumber >= 0 && participantGroupNumber < numOfGroups) {
                    groups[participantGroupNumber].participants.push(participants[i]);
                }
            }

            return groups;
        };

        let dragging = (this.props.matching.get("current").length > 0) ? true : false;

        let getGroupCards = (groups) => {
            return (
                groups.map(
                    (group, i) => (
                        <Grid.Column stretched key={ group.groupNumber }>
                            <GroupCard participants={ group.participants }
                                       capacity={ this.props.groupCapacity }
                                       groupNumber={ group.groupNumber }
                                       itemsPerRow={ itemsPerRow }
                                       updateParticipantGroupNumber={ this.props.updateParticipantGroupNumber }
                                       activityId={ this.props.activityId }
                                       setCurrentlySelected={ this.setCurrentlySelected.bind(this) }
                                       toggleLock={ this.toggleLock.bind(this) }
                                       matching={ this.props.matching.get("matchingCriteria") }
                                       draggedUser={ this.props.matching.get("current") }
                                       group={ i }
                                       unlocked={ this.props.unlocked.get(i) }
                                       filters={ this.state.filters }
                                       getGroupSize={ this.getGroupSize.bind(this) }
                                       onDragMove={ this.onDragMove.bind(this) }/>
                        </Grid.Column>
                    )
                )
            )
        };
       
        return (
            <div onMouseMove={ this.onMouseMove.bind(this) }>
                <ParticipantListSidebar participants={ this.props.participants }
                                        updateParticipantGroupNumber={ this.props.updateParticipantGroupNumber }
                                        activityId={ this.props.activityId }
                                        setCurrentlySelected={this.setCurrentlySelected.bind(this)}
                                        dragging = { dragging }
                                        />
                    <ActivityCardViewWrapper setCurrentlySelected={ this.setCurrentlySelected.bind(this) }>
                    {
                        (this.props.participants.length > 0) &&
                        <FilterMenu activityId={ this.props.activityId }
                                    generateGroupAssignment={ this.props.generateGroupAssignment }
                                    filterValues={ this.props.matching.get("attributes") }
                                    setFilterValues={ this.setFilterValues }/>
                    }
                    
                    <Grid columns={ cardsPerRow }>
                        { getGroupCards(separateIntoGroups(this.props.participants)) }
                    </Grid>
                    </ActivityCardViewWrapper>
                    <div className="footer"></div>

            </div>
        )
    }
}

export default DragDropContext(HTML5Backend)(ActivityView)
