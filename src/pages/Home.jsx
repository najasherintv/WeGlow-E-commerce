import React from 'react'
import heroImg from '../assets/images/hero.jpg';
import { Link } from 'react-router-dom';
import ChatBot from './ChatBot';


function Home() {
    const cards=[
        {
            title:"Summer Collection",
            subtitle:"starting at $17.99",
            image:"https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/resize-w:1080/Tira_Combos/The-Face-Shop/TIRA006782/934827_combo_2/934827_combo_2_1.jpg"
        },{
            title:"What's New",
            subtitle:"starting at $12.66",
            image:"https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:1080/1128757/POXyfbdcr-1128757_1.jpg"

            
        },{
            title:"Buy 1 get 1",
            subtitle:"Get The glow",
            image:"https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:1080/1133697/TGRXbA8uDm-1133697_1.jpg"
        },
    ];
    const bestSellers =[
        {
            title:"Hydrating Serum",
            subtitle:"Top-rated glow boost",
            image:"https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:494/1177484/s3FUBo0Hq0-1177484_1.jpg"
        },{
            title:"Vitamin c Cleanser",
            subtitle:"Brighten & refresh",
            image:"https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:494/1133701/QYJz_KkVCj-1133701_1.jpg"

        },{
            title:"Nourishing Moisturizer",
            subtitle:"24 Hydration",
            image:"https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:494/1140045/jUHuKTYyI-1140045_1.jpg"

        }
    ]
  return (
    <div className='bg-white'>
        <div
  className="h-screen bg-cover bg-center flex items-center"
  style={{ backgroundImage: `url(${heroImg})` }}
><div className='max-w-lg pl-6 -mt-35  '><h1  className='text-5xl font-bold text-gray-900'>Reveal The <br/> beauty of  Skin</h1><Link to="/Shop"><button className='mt-6 bg-black text-white px-6 py-2 cursor-pointer'>shop now</button></Link></div></div>
<section className="bg-white py-16" id="new">
  <div className="max-w-7xl mx-auto px-4 w-full">
    <h2 className="text-3xl font-bold mb-6 text-center">New Arrivals</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden shadow-md bg-white transition-transform duration-300 hover:shadow-xl hover:scale-105"
        >
          <div className="h-60 flex items-center justify-center bg-white p-4">
            <img
              src={card.image}
              alt={card.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="bg-black p-4 rounded-t-none">
            <h3 className="text-xl font-semibold text-white">{card.title}</h3>
            <p className="text-sm text-white">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



<section className="bg-gray-100 py-16">
  <div className="max-w-7xl mx-auto px-4 w-full">
    <h2 className="text-3xl font-bold mb-6 text-center">Our Best Sellers</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {bestSellers.map((card, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden shadow-md bg-white transition-transform duration-300 hover:shadow-xl hover:scale-105"
        >
          <div className="relative h-60 flex items-center justify-center bg-white p-4">
            <img
              src={card.image}
              alt={card.title}
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="text-sm text-white">{card.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



        
     <ChatBot/>   
    </div>
  
    
  )
}

export default Home