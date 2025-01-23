import React from 'react'
import '../styles/Report.css'
import axios from 'axios'

const Report = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        var name = e.target.name?.value;
        var email = e.target.mail?.value;
        var query = e.target.query?.value;

        // console.log(name, email, query);
        axios.post('https://app.contentstack.com/automations-api/run/15a4152cf31e449296f89fc9fa781368', {
            "entry": {
                "title": name+email,
                "form": {
                    "name": name,
                    "email": email,
                    "fraud_issue": query
                }
            }
        }).then(res => {
            console.log(res);
            console.log(res.status)
        }).catch(err => {
            console.log(err);
        })
    }

  return (
    // <div>
    //     <h1>Report Fraud</h1>
    //     <form method="post">
    //         <input type="text" placeholder='Enter your Name' required min="3" max='50'/>
    //         <input type="email" name="mail" id="mail" required placeholder='Enter your e-mail' />
    //         <input type="text-area"  placeholder='Fraud issues' required/>

    //         <button type='submit'><h3>Post</h3></button>
    //     </form>
    // </div>
    <div className="fraud-report-container" id='report'>
    <h1 className="fraud-report-title">Report Fraud</h1>
    <form action="" method="get" className="fraud-report-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your Name"
        id='name'
        required
        minLength="3"
        maxLength="50"
        className="form-input"
        name='name'
      />
      <input
        type="email"
        name="mail"
        id="mail"
        required
        placeholder="Enter your e-mail"
        className="form-input"
      />
      <textarea
        placeholder="Fraud issues"
        required
        id='query'
        className="form-textarea"
        name='query'
      ></textarea>
      <button type="submit" className="form-submit-button">
        <h3 className="submit-button-text">Post</h3>
      </button>
    </form>
  </div>
  
  )
}

export default Report