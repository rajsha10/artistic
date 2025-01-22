import React from 'react';
import './css/Hero.css';

const Hero = () => {
  return (
    <div className="main-box">
        <div className="box">
        {[...Array(10)].map((_, index) => (
            <span key={index} style={{ '--i': index + 1 }}>
            <img 
                src={`/hero/${index + 1}${index === 9 ? '.png' : '.jpg'}`} 
                alt={`Gallery image ${index + 1}`}
            />
            </span>
        ))}
        </div>
    </div>
  );
};

export default Hero;