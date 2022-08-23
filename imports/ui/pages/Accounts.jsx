import React, { useState, useEffect } from "react"
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import AccountRow from "../molecules/AccountRow";
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';

const Accounts = props => {

  const [userFilter, setUserFilter] = useState('');
  const [accountsRaw, setAccountsRaw] = useState([]);
  const accountsQuery = gql` query accounts {accounts {
    _id
    firstname
    lastname
    mail
    isOwner
    isAdmin
    avatar
    activated
  }}`;
  const accounts = () => {
    return accountsRaw.filter(a=> a.firstname.toLowerCase().includes(userFilter.toLowerCase()) || a.lastname.toLowerCase().includes(userFilter.toLowerCase()) || a.mail.toLowerCase().includes(userFilter.toLowerCase()))
  }
  const handleFilter = value => {
    setUserFilter(value);
  }
  const loadAccounts = () => {
    props.client.query({
      query:accountsQuery,
      fetchPolicy:"network-only",
    }).then(({data})=>{
      setAccountsRaw(data.accounts)
    })
  }
  useEffect(() => {
    loadAccounts();
  })

  return (
    <div className="page padded is-8 columns">
      <div className="column is-narrow">
        <AdministrationMenu active="accounts"/>
      </div>
      <div className="column">
        <div className="box">
          <input className="input is-large" name="usersFilter" onChange={e=>handleFilter(e.target.value)} placeholder='Search account by name or mail ...'/>
        </div>
        <div className="box">
          <table className="table is-fullwidth is-stripped is-hoverable">
            <thead>
              <tr>
                <td>#</td>
                <td></td>
                <td>Name</td>
                <td>Mail</td>
                <td>Activated</td>
                <td>isAdmin</td>
                <td>isOwner</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {accounts().map((a,i) => <AccountRow key={a._id} loadAccounts={loadAccounts} account={a} index={i}/>)}
            </tbody>
          </table>
          </div>
      </div>
    </div>
  )
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Accounts);