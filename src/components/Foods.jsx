import { React, useEffect, useState } from 'react';
import { getFoodResponse } from '../helper/index';
import '../styles/Foods.css'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function Foods() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const category = params.get('category');

    const [food, setFood] = useState([]);

    async function getFoodsInfo() {
        await getFoodResponse().then(res => {
            setFood(res);
        
            if (category !== null){
                console.log(category);
                filterFoods(res);
            }
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }

    function filterFoods(res) {
        // console.log(Object.keys(res[0]).includes('category'));
        const newFoods = res.filter((dish) => {
            return dish['category'].includes(category);
        })
        console.log(newFoods);
        if (newFoods !== undefined || newFoods.length!==0){
            setFood(newFoods)
        }

    }

    useEffect(() => {
        getFoodsInfo();
    }, [])


    return (<>
 
        <h1 style={{textAlign:'center'}}>{category!=null ? category : ''}</h1><br />
        <main className="food-container">
            {food.map((dish, idx) =>
            (
                <div key={idx} className="food-card">
                    <Link to={dish?.url} style={{ textDecoration: 'none' }}>
                        <div className="image-wrapper">
                            <img
                                src={dish?.dish_image?.url}
                                alt={dish?.dish_image?.title}
                                className="food-image"
                            />
                        </div>
                        <div className="food-details">
                            <div className="left-section">
                                <h2 className="dish-title">{dish?.title}</h2>
                                <h3 className="mess-name">{dish?.mess_name}</h3>
                                <h4 className="mess-address">{dish?.mess_address}</h4>
                            </div>
                            <div className="right-sections">
                                <p className="price">Rs. {dish?.rate}</p>
                                <p className="ratings">Rating: {dish?.ratings?.value}</p>
                                <p className="avail-time">
                                    {dish?.avail_from} - {dish?.avail_until}
                                </p>
                            </div>
                        </div>
                        <ul className="categories">
                            {dish?.category.map((option, catIdx) => (
                                <li key={catIdx} className="category-item">
                                    <h4>#{option}</h4>
                                </li>
                            ))}
                        </ul>
                    </Link>
                </div>
            ))}
        </main>
        </>


    );
}
