import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCardDishResponse } from "../helper/index";
import { FaPlus, FaMinus } from "react-icons/fa";
import '../styles/Dish.css'

export default function Dish() {
  const { id } = useParams();
  const [nos, setNos] = useState(1)

  const [showModel, setShowModel] = useState(false);
  const [form, setForm] = useState({
    username:"",
    email:"",
    phone:""
  });



  const [dishes, setDishes] = useState({});

  async function getDishesInfo() {
    console.log(id);
    await getCardDishResponse(id).then(res => {
      setDishes(res);
      console.log(res)
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

  function confirmOrder(){
    setShowModel(true);
  }

  const handleInputChange = (e) =>{
    const {name, value} 
  }

)

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
          Price: {nos === (0 || 1) ? dishes?.rate : dishes?.rate * nos}
        </h3>
      </div>


      <button className="order-button"  onClick={confirmOrder}>Order</button>
    </div>
  </div>

  {/* Form for Confirming Order*/ }
  {

  }
</article>

  );
}
