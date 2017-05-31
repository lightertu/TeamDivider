/**
 * Created by Matt on 5/23/17.
 */
import React from 'react'
import PropTypes from 'prop-types';
import {Button, Modal, Message} from "semantic-ui-react";

export default class DeleteSurveyModal extends React.Component {
    constructor(props) {
        super(props);
        this.deleteSurveyHandler = this.deleteSurveyHandler.bind(this);
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        surveyId: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired
    };
    
    deleteSurveyHandler(payload) {
        this.props.deleteSurvey(this.props.surveyId);
    }

    render() {
        return (
            <Modal open={this.props.openDeleteModal} onUnmount={this.props.fetchSurveyList} size="small" dimmer={"blurring"}>
                <Modal.Header> Delete Survey {this.props.name } </Modal.Header>
                <Modal.Content>
                    <Message negative floating hidden={!this.props.failedToDelete}
                        style={{textAlign:'center'}}
                    >
                        <Message.Header>ERROR: {this.props.editDelete}</Message.Header>
                    </Message>
                    <p>Are you sure you want to delete survey {this.props.name} </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive disabled={this.props.isDeleting}
                    onClick={ this.props.onClose }>
                        Cancel
                    </Button>
                    <Button negative disabled={this.props.isDeleting}
                        loading={this.props.isDeleting}
                        icon='checkmark'
                        labelPosition='right'
                        content='Delete'
                        onClick={this.deleteSurveyHandler}/>
                </Modal.Actions>
            </Modal>
        );
    }
}