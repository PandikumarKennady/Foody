import { React, useEffect, useState } from 'react';
import { getResponse } from '../helper/index';
import '../styles/Collections.css'
import { Link } from 'react-router-dom';

export default function Collections() {

  const [collection, setCollection] = useState({});

  async function getCollectionInfo() {
    await getResponse('categories').then(res => {
      setCollection(res);
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    getCollectionInfo();
  }, [])

  return (
    <article className="collection-container">
    <h1 className="collection-title">{collection?.title}</h1>
    <p className="collection-description">{collection?.description}</p>
    <section className="category-section">
      {collection?.category?.map((category, index) => (
        <aside key={index} className="category-card">
          <Link to={category?.category_link?.href} className="category-link">
            <img
              src={category?.image?.url}
              alt={category?.category_link?.title}
              className="category-image"
            />
          </Link>
          <h3 className="category-title">{category?.category_link?.title}</h3>
        </aside>
      ))}
    </section>
  </article>
  
  );

}