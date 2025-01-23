import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCardDishResponse } from "../helper/index";
import { FaPlus, FaMinus } from "react-icons/fa";
import '../styles/Dish.css'
import axios from "axios";
export default function Dish() {
  const { id } = useParams();
  const [nos, setNos] = useState(1)
  const [price, setPrice] = useState(0)

  const [showModel, setShowModel] = useState(false);
  const [form, setForm] = useState({
    username: "",

    email: "",
    phone: "",
    address: ""
  });

  const [dishes, setDishes] = useState({});

  async function getDishesInfo() {
    await getCardDishResponse(id).then(res => {
      setDishes(res);
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    getDishesInfo();
  }, [])

  function handleIncrement() {
    setNos((nos) => nos + 1);

  }

  function handleDecrement() {
    if (nos == 1) {
      return;
    }
    setNos((nos) => nos - 1)

  }

  function confirmOrder() {
    setShowModel(true);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value })

  };


  const handleSubmit = (e) => {
    e.preventDefault();
    window.alert(`Thanks for the Order ${form.username}\nYour Order Confirmed.`);
    axios.post('https://app.contentstack.com/automations-api/run/da0e25de5c9243e19e269c51630fef67', { 
        
            "to": form.email,
            "subject": "Order Confirmation",
            "body": 'Hii\t' +form.username+',\nYour order is confirmed and got to Delivery soon.\nDelivery Details are as follows:\nYour Contact Details: \n'+form.address+'\n'+form.phone+'\nFood: '+dishes?.title+ '\nRestaurant: '+dishes?.mess_name+'\nQuantity: '+nos+'\nTotal Price: '+price+'\n\nThank You,\nFoody App.'
    
     }).then(res => {
       console.log(res.status)
     }).catch(err => {
       console.log(err);
     })
    
    setShowModel(false);
  }

  const handleCancel = () => {
    setShowModel(false);
  }

  useEffect(() => {
    let new_price = nos === (0 || 1) ? dishes?.rate : dishes?.rate * nos;
    setPrice(new_price)
  }, [nos]);

  return (

    <article className="dish-container">
      <h1 className="dish-header">Discover our Dishes!</h1>
      <div className="dish-content">

        <div className="left-section">
          <img
            src={dishes?.dish_image?.url}
            alt={dishes?.dish_image?.filename}
            className="dish-image"
          />
        </div>


        <div className="right-sections">

          <div className="parallel-section">
            <div className="left-parallel">
              <h2 className="dish-title">{dishes?.title}</h2>
              <h3 className="mess-name">{dishes?.mess_name}</h3>
              <address className="mess-address">{dishes?.mess_address}</address>
            </div>
            <div className="right-parallel">
              <p className="ratings">Rating: {dishes?.ratings?.value}</p>
              <p className="avail-time">
                {dishes?.avail_from} - {dishes?.avail_until}
              </p>
            </div>
          </div>


          <section className="description-section">
            <h3>Description</h3>
            <p>{dishes?.description}</p>
            <h3>Main Ingredients</h3>
            <p>{dishes?.ingredients}</p>
          </section>


          <ul className="categories">
            {dishes?.category?.map((dish, idx) => (
              <li key={idx} className="category-item">
                <h4>#{dish}</h4>
              </li>
            ))}
          </ul>

          {/* Price and Quantity */}
          <div className="price-quantity-section">
            <button onClick={handleIncrement} className="quantity-button">
              <FaPlus />
            </button>
            <p className="quantity">Quantity: {nos}</p>
            <button onClick={handleDecrement} className="quantity-button">
              <FaMinus />
            </button>
            <h3 className="price">
              Price: {price}
            </h3>
          </div>


          <button className="order-button" onClick={confirmOrder}>Order</button>
        </div>
      </div>

      {/* Form for Confirming Order*/}
      {showModel && (
        <div className="modal">
          <div className="modal-content">
            <h2>Order Details</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                required
                placeholder="Enter Customer Name"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your mail"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your Phone No"
              />
              <input
                type="text-area"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                required
                placeholder="Type Delivery Address"
              />
              <p>
                <strong>Food:</strong> {dishes?.title}
              </p>

              <p>
                <strong>Restaurant:</strong> {dishes?.mess_name}
              </p>
              <p>
                <strong>Price:</strong> {price}
              </p>
              <p>
                <strong>Quantity:</strong> {nos}
              </p>


              <div className="modal-actions">
                <button type="submit" className="confirm-button">
                  Confirm
                </button>
                <button type="button" onClick={handleCancel} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>

  );
}
