import React from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';

const Demo = props => {

    const navigate = useNavigate();

    const resetDBQuery = gql`mutation resetDB{
        resetDB{
            status
            message
        }
    }`;
    const factoryResetQuery = gql`mutation factoryReset{
        factoryReset{
            status
            message
        }
    }`;

    const resetDB = () => {
        props.client.mutate({
            mutation:resetDBQuery,
        }).then((data)=>{
            props.toastQRM(data.data.resetDB)
        })
    }
    const factoryReset = () => {
        props.client.mutate({
            mutation:factoryResetQuery,
        }).then((data)=>{
            Meteor.logout(()=>{
                setUser("")
                props.client.cache.reset();
                props.client.resetStore();
            });
            props.toastQRM(data.data.factoryReset)
        });
    }
    const generateDummyData = () => {
        
    }

    return (
        <div className="demo-actions-container">
            <div className="box">
                <button className="button is-primary is-large" onClick={generateDummyData}>Generate Dummy Data</button>
                <button className="button is-danger is-large" onClick={resetDB}>Reset Content</button>
                <button className="button is-danger is-large" onClick={factoryReset}>Reset Platform</button>
            </div>
        </div>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
export default withUserContext(Demo);