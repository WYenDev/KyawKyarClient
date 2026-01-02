import React from 'react';
//import AboutComponent from '../components/About';
import AboutContact from '../components/AboutAndContact';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <AboutContact />
    </div>
  );
};

export default About;
