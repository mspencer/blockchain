import { useNavigate } from 'react-router-dom';
import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const withRouter = WrappedComponent => props => {
    const navigate = useNavigate();

    return (
        <WrappedComponent
        {...props}
        {...{ navigate }}
        />
    );
};

export default withRouter;