import React from 'react';
import { render } from 'react-dom';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Modal, ModalBody, ModalHeader, Label, Row, Col } from "reactstrap";
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length; //value > 0
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

function RenderDish({dish}) {
    return(
        <div>
            <FadeTransform in
               transformProps={{
                   exitTransform: 'scale(0.5) translateY(-50%)'
               }}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
            </FadeTransform>
        </div>
    );
}

function RenderComments({comment, postComment, dishId}) {
    if (comment != null){

    
       return(
           <div className="col-12 col-md-5 m-1">
               <h4>Comments</h4>
               <ul className="list-unstyled">
                   <Stagger>
                    {comment.map((comment) => {
                        return(
                            <Fade in>
                                <li key={comment.id}>
                                    <p>{comment.comment}</p>
                                    <p>-- {comment.author}, {new comment}</p>
                                </li>
                            </Fade>
                        );
                    })}
                   </Stagger>
               </ul>
               <CommentForm dishId={dishId} postComment={postComment} />
           </div>
       );
    }
       else {
        return(
            <div></div>
        );
       }
         
};

class CommentForm extends React.Component {

    constructor(props) {
        super(props);

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            isNavOpen: false,
            isModalOpen: false
        };
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment)
    }



    render() {
        return (
            <div>
                <Button outline onClick={this.toggleCommentFormModal}><span className="fa fa-comments fa-lg"></span> Submit Comment</Button>
                <Modal isOpen={this.state.isCommentFormModalOpen} toggle={this.toggleCommentFormModal} >
                <ModalHeader toggle={this.toggleCommentFormModal}> Submit Comment </ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleCommentFormSubmit(values)}>
                        <Row className="form-group">
                            <Col>
                            <Label htmlFor="rating" md={12} >Rating</Label>            
                            <Control.select model=".rating" className="form-control" name="rating" id="rating" validators={{required}}>
                                <option>Please Select</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Control.select>
                            <Errors className="text-danger" model=".author" show="touched" messages={{required: 'Required',}} />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="author" md={12}> Your Name </Label>
                              <Col md={12}>
                              <Control.text model=".author" id="author" name="author" placeholder="First Name" className="form-control" validators={{
                               required, minLength: minLength(3), maxLength: maxLength(15)}}/>
                              <Errors className="text-danger" model=".author" show="touched" messages={{required: 'Required',
                              minLength: 'Must be greater than 2 characters',
                              maxLength: 'Must be 15 characters or less'}} />
                             </Col>
                        </Row>
                        <Row className="form-group">
                           <Label htmlFor="comment" md={12}>Comment</Label>
                              <Col md={12}>
                              <Control.textarea model=".comment" id="comment" name="comment" rows="6" className="form-control" validators={{required}} />
                              <Errors className="text-danger" model=".author" show="touched" messages={{required: 'Required'}} />
                             </Col>
                        </Row>
                        <Button type="submit" color="primary">Submit</Button>
                    </LocalForm>
                </ModalBody>
            </Modal>
        </div>
        );
    } 
} 
const DishDetail = (props) => {

    props.dishes.dishes.map((dish) => {
        return (
            <div className="row"  key={dish.id}>
                <RenderDish dish={dish} onClick={props.onClick} />
            </div>
        );
    });

    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );  
    }

    else if (props.errMess) {
        return(
            <div className="container">
            <div className="row">
                <h4>{props.errMess}</h4>
            </div>
        </div>
        );    
    }

    else if (props.dish != null)
        return (
            <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>                
            </div>
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={props.dish} />
                </div>
                <div className="row">
                    <RenderComments comments={props.comments} 
                    postComment={props.postComment}
                    dishId={props.dish.id}
                    />
                </div>
            </div>
            </div>
        );
        else
        return(
            <div></div>
        );
};

export default DishDetail;