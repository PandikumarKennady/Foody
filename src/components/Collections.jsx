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
    <article>
      <h1>{collection?.title}</h1>
      <p>{collection?.description}</p>
      <section>
        {collection?.category?.map((category, index) => (
          <aside key={index}>
            <Link to={category?.category_link?.href}>
              <img
                src={category?.image?.url}
                alt={category?.category_link?.title}
              />
            </Link>
            <h3>{category?.category_link?.title}</h3>
          </aside>
        ))}
      </section>
    </article>
  );

}