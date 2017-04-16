import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { Button } from 'semantic-ui-react'
import CreateForm from './CreateForm';
class Welcome extends Component {
    constructor() {
        super();
        this.state = {visible:false}
    }
    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    render() {
        const { visible } = this.state
        console.log(visible);
        let link =(<div><p>&nbsp;</p></div>)
        let loading;
        let form;
        if(visible) {
            // link = <div className="link" key="visible"><p><strong> Copy Link:</strong>  <span className="line">OIGY*R^F*&TOYqipuehp9h&GO^GI%FI%FO&%</span></p></div>
            // loading = "loading button"
            form = <CreateForm active={visible} key="key" toggleVisibility={this.toggleVisibility.bind(this)}/>
        }
        return (
            <div className="container text-center">
        <div className="welcome-header">
            <span><h1 className="header">WELCOME <div className="inner"><i>to</i>Team Divider...</div></h1></span>
        </div>
        <h2 className="sub-header"><i>If this is your first time start by generating a form.</i></h2>
        <br />
        <br />
        <div className="row">
        <div className="ui stackable two column centered grid">
            <div className="column">
            <div className="welcome-button-left">
            <Button onClick={this.toggleVisibility} className={"massive ui labeled icon blue button button " + loading}>
                <i className="download icon"></i>
                Generate Form
            </Button>
            </div>
            </div>

            <div className="column">
            <div className="welcome-button-right">
            <Button className="massive ui labeled icon blue button">
                <i className="users icon"></i>
                Classes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Button>
            </div>
            </div>
        </div>
        <br />
        <br />

        <CSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {form}
        </CSSTransitionGroup>
        </div>
  
    </div>
        )
    }
}

export default Welcome