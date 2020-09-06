import React, { useState, useEffect } from 'react'
import Computer from 'bitcoin-computer'
import './App.css'
// import Card from './card'
import Loan from './loan'

function App() {
  
  const [computer, setComputer] = useState(new Computer({
    seed: 'title mercy exhibit wasp diesel tell state snow swamp benefit electric admit',
    chain: 'BSV'
  }))
  const [balance, setBalance] = useState(0)

  // initializing states
  const [amount, setAmount] = useState('')
  const [borrower_name, setBorrowerName] = useState('')
  const [lender_name, setLenderName] = useState('')

  const [revs, setRevs] = useState([])
  const [loans, setLoans] = useState([])
  const [refresh, setRefresh] = useState(0)

  // useEffect performs side effects after you call a function
  useEffect(() => {
    const fetchRevs = async () => {
      setBalance(await computer.db.wallet.getBalance())
      setRevs(await computer.getRevs(computer.db.wallet.getPublicKey()))
      setTimeout(() => setRefresh(refresh + 1), 3500)
    }
    fetchRevs()
  }, [computer.db.wallet, refresh])

  useEffect(() => {
    const fetchLoans = async () => {
      setLoans(await Promise.all(revs.map(async rev => computer.sync(rev))))
    }
    fetchLoans()
  }, [revs, computer])

  useEffect(() => console.log('revs', revs), [revs])
  useEffect(() => console.log('loans', loans), [loans])

  const handleSubmit = async (evt) => {

    // user must fill in all text fields
    if(amount !== "" && borrower_name !== "" && lender_name !== ""){

      // amount has to be an integer number
      if(!isNaN(amount)){

        evt.preventDefault()
        const loan = await computer.new(Loan, [amount, borrower_name, lender_name]) // creating a new loan smart object
        console.log('created loan', loan)
      }
      else {
        alert('The Amount field only takes integer numbers!')
      }
    }
    else {
      alert('All fields need to be filled!')
    }
  }

  // a function that maps all loans created to a table
  function renderTableData() {
    return loans.map(loan => {const {amount, borrower_name, lender_name} = loan
      return (
        <tr key = {amount, borrower_name, lender_name}>
          <td>{amount}</td>
          <td>{borrower_name}</td>
          <td>{lender_name}</td>
        </tr>
      )})
  }

  return (
    <div className="App">
      <h2>Wallet</h2>
      <b>Address</b>&nbsp;{computer.db.wallet.getAddress().toString()}<br />
      <b>Public Key</b>&nbsp;{computer.db.wallet.getPublicKey().toString()}<br />
      <b>Balance</b>&nbsp;{balance/1e8} {computer.db.wallet.restClient.chain}<br />
      <button type="submit" onClick={() => setComputer(new Computer())}>
        Generate New Wallet
      </button>

      <h2>Create New Loan</h2>
      <form onSubmit={handleSubmit}>
        Amount<br />
        <input type="string" value={amount} onChange={e => setAmount(e.target.value)} />

        Borrower<br />
        <input type="string" value={borrower_name} onChange={e => setBorrowerName(e.target.value)} />

        Lender<br />
        <input type="string" value={lender_name} onChange={e => setLenderName(e.target.value)} />

        <button type="submit" value="Send Bitcoin">Create Loan</button>
      </form>

      <h2>Your Loans</h2>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Borrower</th>
              <th>Lender</th>
            </tr>
          </thead>
          <tbody>
            {renderTableData()}
          </tbody>
        </table>
    </div>
  );
}

export default App;
