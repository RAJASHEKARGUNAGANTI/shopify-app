import { Image, Layout, LegacyCard } from '@shopify/polaris';
import React from 'react';
import { NavLink } from "react-router-dom";

const ProductCard = (props) => {
  const shortDescription = props.description ? props.description.substring(0, 35) : '';
  const shortLink = props.linkURL ? ("https://dev-xl.myshopify.com/products/"+ props.linkURL).substring(0, 40) : '';
  const cleanedStr = shortDescription.replace(/<\/?p>/g, '');


  return (
    <>
      <Layout.Section oneThird>
      <div className="max-w-sm w-full" onClick={props.onClick}>
        <LegacyCard title={props.title}>
          <img src={props.image} alt={props.title} className= ' w-96 h-80 object-cover ' />
          <div className="p-4">
            <h2 className='text-xl'>RS: {props.price}</h2>
            <h1 className='text-xl text-blue-700 font-semibold'>{cleanedStr}</h1>
            <NavLink to={`/products/${props.linkURL}`}>
              <h2 className='text-md text-green-700'>
                {shortLink}
              </h2>
            </NavLink>
          </div>
        </LegacyCard>
        </div>
      </Layout.Section>
    </>
  );
}

export default ProductCard;
